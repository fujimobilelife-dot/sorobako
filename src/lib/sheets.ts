import { google } from "googleapis"

export async function getSheetData(accessToken: string, spreadsheetId: string, range: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const sheets = google.sheets({ version: "v4", auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  return response.data.values || []
}

// シートを安全に取得（シートが存在しない・range parseエラーの場合はnullを返す）
async function safeGetSheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  range: string
): Promise<string[][] | null> {
  try {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range })
    return res.data.values ?? null
  } catch (e: any) {
    // シートが存在しない or range parseエラーはスキップ
    const msg: string = e?.message ?? ""
    if (
      msg.includes("Unable to parse range") ||
      msg.includes("Requested entity was not found") ||
      e?.code === 400 ||
      e?.code === 404
    ) {
      return null
    }
    throw e
  }
}

export async function getAllSheetData(accessToken: string, spreadsheetId: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const sheets = google.sheets({ version: "v4", auth })

  const [clients, invoices, payments, expenses, staff, shifts, salary, settings] = await Promise.all([
    safeGetSheet(sheets, spreadsheetId, "取引先!A1:I100"),
    safeGetSheet(sheets, spreadsheetId, "請求書!A1:K100"),
    safeGetSheet(sheets, spreadsheetId, "支払い!A1:J100"),
    safeGetSheet(sheets, spreadsheetId, "経費!A1:G100"),
    safeGetSheet(sheets, spreadsheetId, "スタッフ!A1:H100"),
    safeGetSheet(sheets, spreadsheetId, "シフト!A1:G100"),
    safeGetSheet(sheets, spreadsheetId, "給与!A1:H100"),
    safeGetSheet(sheets, spreadsheetId, "設定!A1:B20"),
  ])

  // 設定シートがない場合はデフォルト値で継続（エラーにしない）
  const settingsData = parseSettings(settings)

  return {
    clients: parseSheet(clients),
    invoices: parseSheet(invoices),
    payments: parseSheet(payments),
    expenses: parseSheet(expenses),
    staff: parseSheet(staff),
    shifts: parseSheet(shifts),
    salary: parseSheet(salary),
    settings: settingsData,
  }
}

export async function updateSetting(accessToken: string, spreadsheetId: string, key: string, value: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: "v4", auth })

  const existing = await safeGetSheet(sheets, spreadsheetId, "設定!A1:B20")
  if (existing === null) {
    // 設定シートがない場合はスキップ（エラーにしない）
    console.warn("updateSetting: 設定シートが見つかりません。スキップします。")
    return
  }
  const values = existing

  // header行(index 0)を除いてキー検索（1-based row = index+1）
  const rowIndex = values.findIndex((row, i) => i > 0 && row[0] === key)

  if (rowIndex !== -1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `設定!B${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [[value]] },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "設定!A:B",
      valueInputOption: "RAW",
      requestBody: { values: [[key, value]] },
    })
  }
}

export async function appendRow(accessToken: string, spreadsheetId: string, sheetName: string, values: string[]) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: "v4", auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  })
}

function parseSettings(values: string[][] | null | undefined): Record<string, string> {
  // 設定シートがない場合はデフォルト値を返す
  const defaults: Record<string, string> = { plan: "free" }
  if (!values || values.length < 2) return defaults
  const result = values.slice(1).reduce((acc, row) => {
    if (row[0]) acc[row[0]] = row[1] || ""
    return acc
  }, {} as Record<string, string>)
  // デフォルト値で不足分を補完
  return { ...defaults, ...result }
}

function parseSheet(values: string[][] | null | undefined) {
  if (!values || values.length < 2) return []
  const headers = values[0]
  return values.slice(1).map(row => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = row[i] || "" })
    return obj
  })
}
