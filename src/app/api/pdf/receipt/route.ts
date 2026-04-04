import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { ReceiptPDF, ReceiptData, IssuerInfo } from "@/lib/pdf/ReceiptPDF"
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
    const receiptNo = invoiceNo.replace(/^INV/, "REC")

    const rec: ReceiptData = {
      receiptNo,
      receiptDate: inv["発行日"] || "",
      clientName: inv["取引先名"] || "",
      amount: totalAmount,
      description: inv["件名"] || "サービス代金",
      taxableAmount,
      taxAmount,
    }

    const s = data.settings
    const issuer: IssuerInfo = {
      name: s["屋号"] || "（屋号未設定）",
      address: s["住所"] || "",
      tel: s["電話番号"] || "",
      email: s["メールアドレス"] || "",
      registrationNo: s["インボイス登録番号"] || "",
    }

    const element = React.createElement(ReceiptPDF, { rec, issuer }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt_${receiptNo}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Receipt PDF error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
