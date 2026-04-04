import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

const BASE_URL = "https://sorobako.app"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: { icon: "/favicon.svg" },
  title: {
    template: "%s | ソロバコ - 個人事業主の経営管理ツール",
    default: "ソロバコ - 請求・入金・支払い管理を自動化。個人事業主のためのバックオフィスツール",
  },
  description: "Googleスプレッドシートだけで請求書発行、入金管理、経費管理、スタッフ管理まで。月額1,480円で個人事業主のバックオフィスを丸ごとカバー。無料プランあり。",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "ソロバコ - 請求・入金・支払い管理を自動化。個人事業主のためのバックオフィスツール",
    description: "Googleスプレッドシートだけで請求書発行、入金管理、経費管理、スタッフ管理まで。月額1,480円で個人事業主のバックオフィスを丸ごとカバー。無料プランあり。",
    url: BASE_URL,
    siteName: "ソロバコ",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "ソロバコ - 個人事業主の経営管理ツール" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ソロバコ - 請求・入金・支払い管理を自動化。個人事業主のためのバックオフィスツール",
    description: "Googleスプレッドシートだけで請求書発行、入金管理、経費管理、スタッフ管理まで。月額1,480円。無料プランあり。",
    images: ["/api/og"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PX4F3Z2S');`}} />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PX4F3Z2S" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
