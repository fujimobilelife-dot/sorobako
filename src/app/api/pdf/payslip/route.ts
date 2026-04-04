import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllSheetData } from "@/lib/sheets"
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer"
import { PayslipPDF, PayslipData, IssuerInfo } from "@/lib/pdf/PayslipPDF"
import React, { JSXElementConstructor, ReactElement } from "react"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const staffId  = req.nextUrl.searchParams.get("staffId")
  const yearMonth = req.nextUrl.searchParams.get("yearMonth")
  const sheetId  = req.nextUrl.searchParams.get("sheetId")
  if (!staffId || !yearMonth || !sheetId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  try {
    const data = await getAllSheetData((session as any).accessToken, sheetId)

    const staffRecord = data.staff.find(s => s["スタッフID"] === staffId)
    if (!staffRecord) {
      return NextResponse.json({ error: "スタッフが見つかりません" }, { status: 404 })
    }

    // Find salary record matching staffId and yearMonth (対象年月 or 年月)
    const salaryRecord = data.salary.find(
      s => s["スタッフID"] === staffId &&
        (s["対象年月"] === yearMonth || s["年月"] === yearMonth)
    )

    const parseAmount = (v: string | undefined) =>
      parseInt((v || "0").replace(/[¥,￥\s]/g, ""), 10) || 0

    const totalHours    = parseFloat(salaryRecord?.["勤務時間"] || "0") || 0
    const hourlyWage    = parseAmount(staffRecord?.["時給"])
    const basicPay      = parseAmount(salaryRecord?.["基本給"]) || Math.round(hourlyWage * totalHours)
    const overtimePay   = parseAmount(salaryRecord?.["残業手当"])
    const transportPay  = parseAmount(salaryRecord?.["交通費"])
    const grossPay      = parseAmount(salaryRecord?.["総支給額"]) || basicPay + overtimePay + transportPay
    const netPay        = parseAmount(salaryRecord?.["差引支給額"]) || grossPay
    const totalDeduction = grossPay - netPay
    const deductionInsurance = Math.round(totalDeduction * 0.7)
    const deductionTax  = totalDeduction - deductionInsurance

    const slip: PayslipData = {
      staffId,
      staffName: staffRecord["氏名"] || staffRecord["スタッフ名"] || "",
      yearMonth,
      totalHours,
      hourlyWage,
      basicPay,
      overtimePay,
      transportPay,
      grossPay,
      deductionInsurance,
      deductionTax,
      totalDeduction,
      netPay,
    }

    const s = data.settings
    const issuer: IssuerInfo = {
      name: s["屋号"] || "（屋号未設定）",
      address: s["住所"] || "",
      tel: s["電話番号"] || "",
    }

    const element = React.createElement(PayslipPDF, { slip, issuer }) as ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    const buffer = await renderToBuffer(element)

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payslip_${staffId}_${yearMonth}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Payslip PDF error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
