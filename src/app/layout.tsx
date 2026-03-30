import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ソロバコ — ひとり経営のバディ",
  description: "取引先管理も、請求書も、支払いも、スタッフ管理も、ぜんぶ見える。データはあなたのGoogleスプレッドシートに。月1,480円。",
  openGraph: {
    title: "ソロバコ — ひとり経営のバディ",
    description: "会計ソフト「以外」のバックオフィス業務を月1,480円でぜんぶ担う総合ツール",
    url: "https://sorobako.app",
    siteName: "ソロバコ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ソロバコ — ひとり経営のバディ",
    description: "会計ソフト「以外」のバックオフィス業務を月1,480円でぜんぶ担う総合ツール",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
