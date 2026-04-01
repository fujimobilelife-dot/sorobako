import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { getAllSheetData } from "@/lib/sheets"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const spreadsheetId = req.nextUrl.searchParams.get("id")
  if (!spreadsheetId) {
    return NextResponse.json({ error: "Missing spreadsheet ID" }, { status: 400 })
  }

  try {
    const data = await getAllSheetData((session as any).accessToken, spreadsheetId)

    // 売上計算（請求書の税込合計）
    const totalRevenue = data.invoices.reduce((sum, inv) => {
      const amount = parseFloat(inv["合計（税込）"]?.replace(/[¥,]/g, "") || "0")
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)

    // 経費計算
    const totalExpenses = data.expenses.reduce((sum, exp) => {
      const amount = parseFloat(exp["金額（税込）"]?.replace(/[¥,]/g, "") || "0")
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)

    // 支払い計算
    const totalPayments = data.payments.reduce((sum, pay) => {
      const amount = parseFloat(pay["金額（税込）"]?.replace(/[¥,]/g, "") || "0")
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)

    // アラート生成
    const alerts = []

    // 未入金アラート（ステータスが「未入金」）
    const unpaid = data.invoices.filter(inv => inv["ステータス"] === "未入金")
    for (const inv of unpaid) {
      const issueDate = new Date(inv["発行日"])
      const daysPassed = Math.floor((Date.now() - issueDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysPassed > 14) {
        alerts.push({
          type: "unpaid",
          severity: daysPassed > 30 ? "critical" : "warning",
          message: `${inv["取引先名"]}への¥${Number(inv["合計（税込）"]?.replace(/[¥,]/g, "") || 0).toLocaleString()}が未入金（${daysPassed}日経過）`,
        })
      }
    }

    // 支払い期限超過アラート
    const overduePayments = data.payments.filter(pay => {
      if (pay["ステータス"] !== "未払い") return false
      const deadline = new Date(pay["支払期限"])
      return deadline.getTime() < Date.now()
    })
    for (const pay of overduePayments) {
      const deadline = new Date(pay["支払期限"])
      const daysOverdue = Math.floor((Date.now() - deadline.getTime()) / (1000 * 60 * 60 * 24))
      alerts.push({
        type: "overdue",
        severity: "critical",
        message: `${pay["取引先名"]}への¥${Number(pay["金額（税込）"]?.replace(/[¥,]/g, "") || 0).toLocaleString()}の支払いが${daysOverdue}日超過`,
      })
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses: totalExpenses + totalPayments,
        grossProfit: totalRevenue - totalExpenses - totalPayments,
        clientCount: data.clients.length,
        invoiceCount: data.invoices.length,
        staffCount: data.staff.length,
      },
      alerts,
      clients: data.clients,
      invoices: data.invoices,
      payments: data.payments,
      expenses: data.expenses,
    })
  } catch (error: any) {
    console.error("Sheets API error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
