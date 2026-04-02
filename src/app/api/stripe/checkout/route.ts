import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { priceId, sheetId } = await req.json()
  if (!priceId || !sheetId) {
    return NextResponse.json({ error: "Missing priceId or sheetId" }, { status: 400 })
  }

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { sheetId, userEmail: session.user.email },
    subscription_data: { metadata: { sheetId, userEmail: session.user.email } },
    success_url: `${base}/dashboard?upgraded=true&sid=${encodeURIComponent(sheetId)}`,
    cancel_url: `${base}/dashboard`,
    locale: "ja",
  })

  return NextResponse.json({ url: checkoutSession.url })
}
