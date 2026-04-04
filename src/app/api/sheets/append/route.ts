import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { appendRow } from "@/lib/sheets"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { sheetId, sheetName, values } = await req.json()
    if (!sheetId || !sheetName || !Array.isArray(values)) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 })
    }

    await appendRow((session as any).accessToken, sheetId, sheetName, values)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("Append row error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
