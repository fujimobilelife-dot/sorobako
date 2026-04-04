import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Tesseract from "tesseract.js"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await Tesseract.recognize(buffer, "jpn+eng", {
      logger: () => {},
    })

    const text = result.data.text
    const parsed = parseInvoiceText(text)

    return NextResponse.json({ text, parsed })
  } catch (error: any) {
    console.error("OCR error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function parseInvoiceText(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean)

  let clientName = ""
  let amount = ""
  let date = ""
  let description = ""

  // Date: YYYY年MM月DD日 or YYYY/MM/DD or YYYY-MM-DD
  const datePattern = /(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})日?/
  for (const line of lines) {
    const m = line.match(datePattern)
    if (m && !date) {
      date = `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`
    }
  }

  // Amount: ¥xxx,xxx or 合計 xxx,xxx
  const amountPatterns = [
    /合計[^\d]*[\d,]+/,
    /請求金額[^\d]*[\d,]+/,
    /[¥￥]\s*([\d,]+)/,
    /(\d{1,3}(?:,\d{3})+)/,
  ]
  for (const line of lines) {
    for (const pat of amountPatterns) {
      const m = line.match(pat)
      if (m && !amount) {
        const raw = m[0].replace(/[^0-9,]/g, "").replace(/,/g, "")
        if (raw.length >= 3) { amount = raw; break }
      }
    }
    if (amount) break
  }

  // Client name: line containing 御中 or 様
  for (const line of lines) {
    if (line.includes("御中") || line.includes("様")) {
      clientName = line.replace(/御中|様/g, "").replace(/[　\s]+/g, " ").trim()
      if (clientName) break
    }
  }

  // Description: line after 件名 or 品名
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("件名") || lines[i].includes("品名")) {
      const val = lines[i].replace(/件名[：:]/g, "").replace(/品名[：:]/g, "").trim()
      description = val || lines[i + 1] || ""
      break
    }
  }

  return { clientName, amount, date, description }
}
