import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // webhookSecretが未設定の場合はスキップ（開発環境）
  if (!webhookSecret || webhookSecret === "whsec_placeholder") {
    return NextResponse.json({ received: true })
  }

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      // 決済成功。プランの更新はフロントエンドの /api/stripe/sync で実行される
      console.log("Checkout completed:", (event.data.object as Stripe.Checkout.Session).id)
      break
    case "customer.subscription.updated":
      console.log("Subscription updated:", (event.data.object as Stripe.Subscription).id)
      break
    case "customer.subscription.deleted":
      // サブスクリプション解約。ユーザーの次回ダッシュボードアクセス時に sync で更新される
      console.log("Subscription cancelled:", (event.data.object as Stripe.Subscription).id)
      break
    default:
      break
  }

  return NextResponse.json({ received: true })
}
