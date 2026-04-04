import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { DeliveryPDF, DeliveryData, IssuerInfo } from "@/lib/pdf/DeliveryPDF"
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

    const deliveryNo = invoiceNo.replace(/^INV/, "DEL")
    const qty = parseInt(inv["数量"] || "1", 10) || 1

    const del: DeliveryData = {
      deliveryNo,
      deliveryDate: inv["発行日"] || "",
      clientName: inv["取引先名"] || "",
      subject: inv["件名"] || "",
      items: [{ description: inv["件名"] || "サービス", qty, unit: "式" }],
    }

    const s = data.settings
    const issuer: IssuerInfo = {
      name: s["屋号"] || "（屋号未設定）",
      address: s["住所"] || "",
      tel: s["電話番号"] || "",
      email: s["メールアドレス"] || "",
    }

    const element = React.createElement(DeliveryPDF, { del, issuer }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="delivery_${deliveryNo}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Delivery PDF error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
