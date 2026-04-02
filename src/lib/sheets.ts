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

export async function getAllSheetData(accessToken: string, spreadsheetId: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const sheets = google.sheets({ version: "v4", auth })

  const [clients, invoices, payments, expenses, staff, shifts, salary, settings] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId, range: "取引先!A1:I100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "請求書!A1:K100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "支払い!A1:J100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "経費!A1:G100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "スタッフ!A1:H100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "シフト!A1:G100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "給与!A1:H100" }),
    sheets.spreadsheets.values.get({ spreadsheetId, range: "設定!A1:B20" }),
  ])

  return {
    clients: parseSheet(clients.data.values),
    invoices: parseSheet(invoices.data.values),
    payments: parseSheet(payments.data.values),
    expenses: parseSheet(expenses.data.values),
    staff: parseSheet(staff.data.values),
    shifts: parseSheet(shifts.data.values),
    salary: parseSheet(salary.data.values),
    settings: parseSettings(settings.data.values),
  }
}

function parseSettings(values: string[][] | null | undefined): Record<string, string> {
  if (!values || values.length < 2) return {}
  return values.slice(1).reduce((acc, row) => {
    if (row[0]) acc[row[0]] = row[1] || ""
    return acc
  }, {} as Record<string, string>)
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
