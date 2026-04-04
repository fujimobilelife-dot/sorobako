import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { EstimatePDF, EstimateData, IssuerInfo } from "@/lib/pdf/EstimatePDF"
import React, { JSXElementConstructor, ReactElement } from "react"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invoiceNo = req.nextUrl.searchParams.get("invoiceNo")
  const sheetId = req.nextUrl.searchParams.get("sheetId")
  if (!invoiceNo || !sheetId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  try {
    const data = await getAllSheetData((session as any).accessToken, sheetId)
    const inv = data.invoices.find(r => r["請求書No"] === invoiceNo)
    if (!inv) return NextResponse.json({ error: "請求書が見つかりません" }, { status: 404 })

    const parseAmount = (v: string | undefined) =>
      parseInt((v || "0").replace(/[¥,￥\s]/g, ""), 10) || 0

    const taxableAmount = parseAmount(inv["金額（税抜）"])
    const taxAmount = parseAmount(inv["消費税"])
    const totalAmount = parseAmount(inv["合計（税込）"])
    const qty = parseInt(inv["数量"] || "1", 10) || 1
    const unitPrice = parseAmount(inv["単価"]) || taxableAmount

    // 見積書No = 請求書NoのINV→ESTに変換（または同値）
    const estimateNo = invoiceNo.replace(/^INV/, "EST")
    // 有効期限 = 発行日の30日後
    const issueDate = inv["発行日"] || ""
    let validUntil = ""
    if (issueDate) {
      const d = new Date(issueDate)
      d.setDate(d.getDate() + 30)
      validUntil = d.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-")
    }

    const est: EstimateData = {
      estimateNo,
      issueDate,
      validUntil,
      clientName: inv["取引先名"] || "",
      items: [{ description: inv["件名"] || "サービス", qty, unitPrice, amount: taxableAmount || unitPrice * qty, taxRate: 10 }],
      taxableAmount: taxableAmount || unitPrice * qty,
      taxAmount,
      totalAmount,
    }

    const s = data.settings
    const issuer: IssuerInfo = {
      name: s["屋号"] || "（屋号未設定）",
      address: s["住所"] || "",
      tel: s["電話番号"] || "",
      email: s["メールアドレス"] || "",
      registrationNo: s["インボイス登録番号"] || "",
      bankName: s["銀行名"] || "",
      bankType: s["口座種別"] || "普通",
      bankNo: s["口座番号"] || "",
      bankHolder: s["口座名義"] || "",
    }

    const element = React.createElement(EstimatePDF, { est, issuer }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="estimate_${estimateNo}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Estimate PDF error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
