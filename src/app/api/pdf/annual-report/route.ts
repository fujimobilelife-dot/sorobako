import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { AnnualReportPDF, AnnualReportData, MonthlyRow, ClientRanking, ExpenseCategory } from "@/lib/pdf/AnnualReportPDF"
import React, { JSXElementConstructor, ReactElement } from "react"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sheetId = req.nextUrl.searchParams.get("sheetId")
  const yearStr = req.nextUrl.searchParams.get("year") || String(new Date().getFullYear())
  const year = parseInt(yearStr, 10)
  if (!sheetId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  try {
    const data = await getAllSheetData((session as any).accessToken, sheetId)

    const parseAmount = (v: string | undefined) =>
      parseFloat((v || "0").replace(/[¥,￥\s]/g, "")) || 0

    const yearInvoices = data.invoices.filter(inv => {
      const d = new Date(inv["発行日"])
      return !isNaN(d.getTime()) && d.getFullYear() === year
    })
    const yearExpenses = data.expenses.filter(exp => {
      const d = new Date(exp["日付"])
      return !isNaN(d.getTime()) && d.getFullYear() === year
    })
    const yearPayments = data.payments.filter(pay => {
      const d = new Date(pay["支払期限"] || pay["日付"] || "")
      return !isNaN(d.getTime()) && d.getFullYear() === year
    })

    // Monthly aggregation
    const monthMap: Record<string, { revenue: number; expenses: number }> = {}
    for (let m = 1; m <= 12; m++) {
      monthMap[String(m).padStart(2, "0")] = { revenue: 0, expenses: 0 }
    }
    yearInvoices.forEach(inv => {
      const d = new Date(inv["発行日"])
      const key = String(d.getMonth() + 1).padStart(2, "0")
      monthMap[key].revenue += parseAmount(inv["合計（税込）"])
    })
    yearExpenses.forEach(exp => {
      const d = new Date(exp["日付"])
      const key = String(d.getMonth() + 1).padStart(2, "0")
      monthMap[key].expenses += parseAmount(exp["金額（税込）"])
    })
    yearPayments.forEach(pay => {
      const d = new Date(pay["支払期限"] || pay["日付"] || "")
      const key = String(d.getMonth() + 1).padStart(2, "0")
      monthMap[key].expenses += parseAmount(pay["金額（税込）"])
    })

    const monthly: MonthlyRow[] = Object.entries(monthMap).map(([m, v]) => ({
      month: `${year}/${m}`,
      revenue: v.revenue,
      expenses: v.expenses,
      profit: v.revenue - v.expenses,
    }))

    const totalRevenue = monthly.reduce((s, r) => s + r.revenue, 0)
    const totalExpenses = monthly.reduce((s, r) => s + r.expenses, 0)
    const totalProfit = totalRevenue - totalExpenses

    // Client ranking
    const clientMap: Record<string, number> = {}
    yearInvoices.forEach(inv => {
      const name = inv["取引先名"] || "不明"
      clientMap[name] = (clientMap[name] || 0) + parseAmount(inv["合計（税込）"])
    })
    const clientRanking: ClientRanking[] = Object.entries(clientMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], i) => ({
        rank: i + 1,
        name,
        amount,
        share: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
      }))

    // Expense categories
    const catMap: Record<string, number> = {}
    yearExpenses.forEach(exp => {
      const cat = exp["カテゴリ"] || "未分類"
      catMap[cat] = (catMap[cat] || 0) + parseAmount(exp["金額（税込）"])
    })
    const totalPaymentAmount = yearPayments.reduce((s, p) => s + parseAmount(p["金額（税込）"]), 0)
    if (totalPaymentAmount > 0) {
      catMap["支払い（仕入・外注）"] = (catMap["支払い（仕入・外注）"] || 0) + totalPaymentAmount
    }
    const totalExpCat = Object.values(catMap).reduce((s, v) => s + v, 0)
    const expenseCategories: ExpenseCategory[] = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        share: totalExpCat > 0 ? Math.round((amount / totalExpCat) * 100) : 0,
      }))

    const s = data.settings
    const report: AnnualReportData = {
      year,
      issuerName: s["屋号"] || "（屋号未設定）",
      generatedAt: new Date().toLocaleDateString("ja-JP"),
      totalRevenue,
      totalExpenses,
      totalProfit,
      monthly,
      clientRanking,
      expenseCategories,
    }

    const element = React.createElement(AnnualReportPDF, { report }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="annual_report_${year}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Annual Report PDF error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
