import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
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
    const data = await getAllSheetData((session as any).accessToken, sheetId)
    const savedCustomerId = data.settings["stripeCustomerId"]

    let customerId = savedCustomerId
    if (!customerId) {
      const customers = await stripe.customers.list({ email: session.user.email!, limit: 1 })
      if (customers.data.length === 0) {
        return NextResponse.json({ error: "Stripeカスタマーが見つかりません" }, { status: 404 })
      }
      customerId = customers.data[0].id
    }

    const base = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Portal error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
