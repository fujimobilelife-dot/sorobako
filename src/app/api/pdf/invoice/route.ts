import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { InvoicePDF, InvoiceData } from "@/lib/pdf/InvoicePDF"
import React, { JSXElementConstructor, ReactElement } from "react"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invoiceNo = req.nextUrl.searchParams.get("invoiceNo")
  const sheetId = req.nextUrl.searchParams.get("sheetId")
  if (!invoiceNo || !sheetId) {
    return NextResponse.json({ error: "Missing invoiceNo or sheetId" }, { status: 400 })
  }

  try {
    const data = await getAllSheetData((session as any).accessToken, sheetId)

    const inv = data.invoices.find(r => r["請求書No"] === invoiceNo)
    if (!inv) {
      return NextResponse.json({ error: "請求書が見つかりません" }, { status: 404 })
    }

    // 取引先情報（取引先IDまたは取引先名で検索）
    const client = data.clients.find(
      c => c["取引先ID"] === inv["取引先ID"] || c["取引先名"] === inv["取引先名"]
    )
    const clientName = inv["取引先名"] || client?.["取引先名"] || ""

    // 金額のパース（¥や,を除去）
    const parseAmount = (v: string | undefined) =>
      parseInt((v || "0").replace(/[¥,￥\s]/g, ""), 10) || 0

    const taxableAmount = parseAmount(inv["金額（税抜）"])
    const taxAmount = parseAmount(inv["消費税"])
    const totalAmount = parseAmount(inv["合計（税込）"])

    // 明細（1行1請求書の形式を想定。品目・数量・単価があれば使う）
    const qty = parseInt(inv["数量"] || "1", 10) || 1
    const unitPrice = parseAmount(inv["単価"]) || taxableAmount
    const items = [
      {
        description: inv["件名"] || "サービス料",
        qty,
        unitPrice,
        amount: taxableAmount || unitPrice * qty,
        taxRate: 10,
      },
    ]

    const invoiceData: InvoiceData = {
      invoiceNo: inv["請求書No"] || invoiceNo,
      issueDate: inv["発行日"] || "",
      dueDate: inv["支払期限"] || "",
      clientName,
      items,
      taxableAmount: taxableAmount || items[0].amount,
      taxAmount,
      totalAmount,
    }

    const element = React.createElement(InvoicePDF, { inv: invoiceData }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice_${invoiceNo}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("PDF generation error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
