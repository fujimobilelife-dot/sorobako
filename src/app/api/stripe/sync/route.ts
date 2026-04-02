import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateSetting } from "@/lib/sheets"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sheetId } = await req.json()
  if (!sheetId) {
    return NextResponse.json({ error: "Missing sheetId" }, { status: 400 })
  }

  try {
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 })

    let plan: "free" | "pro" = "free"
    let customerId = ""

    if (customers.data.length > 0) {
      const customer = customers.data[0]
      customerId = customer.id

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      })
      if (subscriptions.data.length > 0) plan = "pro"
    }

    const token = (session as any).accessToken
    await updateSetting(token, sheetId, "plan", plan)
    if (customerId) await updateSetting(token, sheetId, "stripeCustomerId", customerId)

    return NextResponse.json({ plan })
  } catch (error: any) {
    console.error("Stripe sync error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
