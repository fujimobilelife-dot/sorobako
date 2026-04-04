import { ImageResponse } from "next/og"
import { readFile } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET() {
  const fontData = await readFile(
    path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf")
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "NotoSansJP",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 20,
            letterSpacing: "0.06em",
          }}
        >
          ソロバコ
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 32,
            fontWeight: 500,
          }}
        >
          個人事業主の経営管理ツール
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          請求・入金・支払い管理を自動化。Googleスプレッドシートで完結。
        </div>
        <div
          style={{
            marginTop: 48,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 40,
            padding: "12px 32px",
            fontSize: 18,
            color: "#ffffff",
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          sorobako.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
