import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import Stripe from "stripe"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken || (session as any).error === "RefreshAccessTokenError") {
    return NextResponse.json({ error: "再ログインが必要です。一度ログアウトして再度ログインしてください。" }, { status: 401 })
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

    // 給与合計（労働分配率計算用）
    const totalPayroll = data.salary.reduce((sum, sal) => {
      const amount = parseFloat(sal["総支給額"]?.replace(/[¥,]/g, "") || "0")
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

    // プラン判定: Stripe APIを正とする（Webhookのタイミング問題を回避）
    let plan: "free" | "pro" = "free"
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (stripeKey && session.user?.email) {
      try {
        const stripe = new Stripe(stripeKey)
        const customers = await stripe.customers.list({ email: session.user.email, limit: 1 })
        if (customers.data.length > 0) {
          const subs = await stripe.subscriptions.list({
            customer: customers.data[0].id,
            status: "active",
            limit: 1,
          })
          if (subs.data.length > 0) plan = "pro"
        }
      } catch (stripeErr: any) {
        // Stripe APIエラー時はスプシのplan設定にフォールバック
        console.warn("Stripe plan check failed, falling back to sheet setting:", stripeErr.message)
        plan = data.settings["plan"] === "pro" ? "pro" : "free"
      }
    } else {
      // Stripeキー未設定（ローカル開発）はスプシのplan設定を使用
      plan = data.settings["plan"] === "pro" ? "pro" : "free"
    }

    return NextResponse.json({
      plan,
      summary: {
        totalRevenue,
        totalExpenses: totalExpenses + totalPayments,
        grossProfit: totalRevenue - totalExpenses - totalPayments,
        clientCount: data.clients.length,
        invoiceCount: data.invoices.length,
        staffCount: data.staff.length,
        totalPayroll,
      },
      alerts,
      clients: data.clients,
      invoices: data.invoices,
      payments: data.payments,
      expenses: data.expenses,
      staff: data.staff,
      salary: data.salary,
    })
  } catch (error: any) {
    console.error("Sheets API error:", error.message)
    const msg: string = error.message ?? ""
    if (msg.includes("Unable to parse range") || msg.includes("設定")) {
      return NextResponse.json(
        { error: "設定シートが見つかりません。最新のテンプレートをご利用ください。" },
        { status: 400 }
      )
    }
    if (msg.includes("PERMISSION_DENIED") || msg.includes("forbidden")) {
      return NextResponse.json(
        { error: "スプレッドシートへのアクセス権限がありません。スプシをご自身のアカウントで開いているか確認してください。" },
        { status: 403 }
      )
    }
    if (msg.includes("NOT_FOUND") || msg.includes("not found")) {
      return NextResponse.json(
        { error: "スプレッドシートが見つかりません。URLが正しいか確認してください。" },
        { status: 404 }
      )
    }
    return NextResponse.json({ error: "データの取得に失敗しました。再試行してください。" }, { status: 500 })
  }
}
