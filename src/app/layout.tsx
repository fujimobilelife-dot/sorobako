import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "ソロバコ — ひとり経営のバディ",
  description: "請求漏れ、入金忘れ、支払い遅延——ひとり経営の「取りこぼし」を防ぐ。データはあなたのGoogleスプレッドシートに。月1,480円。",
  openGraph: {
    title: "ソロバコ — ひとり経営のバディ",
    description: "請求漏れ、入金忘れの損失を防ぐ。ひとり経営のお金を守るツール。月1,480円。",
    url: "https://sorobako.app",
    siteName: "ソロバコ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ソロバコ — ひとり経営のバディ",
    description: "請求漏れ、入金忘れの損失を防ぐ。ひとり経営のお金を守るツール。月1,480円。",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
