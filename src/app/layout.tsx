import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ソロバコ — ひとり経営のバディ | 取引先管理・請求書作成・支払い管理',
  description: '月980円で、取引先ごとの売上も、請求書も、支払いも、ぜんぶ見える。データはあなたのGoogleスプレッドシートに。',
  openGraph: {
    title: 'ソロバコ — ひとり経営のバディ',
    description: '請求忘れ、もうしない。取引先の管理も、請求書も、支払いも、ぜんぶ見える。月980円。',
    url: 'https://sorobako.app',
    siteName: 'ソロバコ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ソロバコ — ひとり経営のバディ',
    description: '請求忘れ、もうしない。取引先の管理も、請求書も、支払いも、ぜんぶ見える。月980円。',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
