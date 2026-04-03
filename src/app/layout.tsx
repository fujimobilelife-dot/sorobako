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
