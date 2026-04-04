import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf"),
})

const S = StyleSheet.create({
  page: { fontFamily: "NotoSansJP", fontSize: 10, padding: 48, color: "#1a1a1a" },
  title: { fontSize: 22, fontFamily: "NotoSansJP", textAlign: "center", marginBottom: 8, letterSpacing: 4 },
  subtitle: { textAlign: "center", fontSize: 10, color: "#666", marginBottom: 28 },
  headerGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  headerCard: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  headerLabel: { fontSize: 8, color: "#666", marginBottom: 2 },
  headerValue: { fontSize: 11, fontFamily: "NotoSansJP" },
  sectionTitle: { fontSize: 10, fontFamily: "NotoSansJP", backgroundColor: "#1a1a1a", color: "#fff", padding: "4 8", marginBottom: 0 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 6, paddingHorizontal: 8 },
  tableRowAlt: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 6, paddingHorizontal: 8, backgroundColor: "#f9fafb" },
  colLabel: { width: "60%", fontSize: 9, color: "#555" },
  colValue: { width: "40%", textAlign: "right", fontSize: 9 },
  totalRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8, backgroundColor: "#eff6ff", borderTopWidth: 1.5, borderTopColor: "#2563eb" },
  totalLabel: { width: "60%", fontSize: 11, fontFamily: "NotoSansJP", color: "#1d4ed8" },
  totalValue: { width: "40%", textAlign: "right", fontSize: 11, fontFamily: "NotoSansJP", color: "#1d4ed8" },
  section: { marginBottom: 20 },
  netBox: { marginTop: 20, borderWidth: 2, borderColor: "#1a1a1a", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  netLabel: { fontSize: 13, fontFamily: "NotoSansJP" },
  netValue: { fontSize: 22, fontFamily: "NotoSansJP" },
  signatureRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
  signatureItem: { alignItems: "center" },
  signatureLabel: { fontSize: 8, color: "#666", marginBottom: 4 },
  signatureBox: { width: 80, height: 50, borderWidth: 0.5, borderColor: "#ccc" },
  notes: { marginTop: 16, fontSize: 8, color: "#888", lineHeight: 1.6 },
})

function fmt(n: number) { return "¥" + Math.round(n).toLocaleString("ja-JP") }

export type PayslipData = {
  staffId: string
  staffName: string
  yearMonth: string
  totalHours: number
  hourlyWage: number
  basicPay: number
  overtimePay: number
  transportPay: number
  grossPay: number
  deductionInsurance: number
  deductionTax: number
  totalDeduction: number
  netPay: number
}

export type IssuerInfo = {
  name: string; address: string; tel: string
}

export function PayslipPDF({ slip, issuer }: { slip: PayslipData; issuer: IssuerInfo }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.title}>給　与　明　細　書</Text>
        <Text style={S.subtitle}>{slip.yearMonth} 分</Text>

        <View style={S.headerGrid}>
          <View style={S.headerCard}>
            <Text style={S.headerLabel}>スタッフID</Text>
            <Text style={S.headerValue}>{slip.staffId}</Text>
          </View>
          <View style={S.headerCard}>
            <Text style={S.headerLabel}>氏名</Text>
            <Text style={S.headerValue}>{slip.staffName}</Text>
          </View>
          <View style={S.headerCard}>
            <Text style={S.headerLabel}>合計勤務時間</Text>
            <Text style={S.headerValue}>{slip.totalHours}h</Text>
          </View>
          <View style={S.headerCard}>
            <Text style={S.headerLabel}>時給</Text>
            <Text style={S.headerValue}>{fmt(slip.hourlyWage)}</Text>
          </View>
        </View>

        {/* 支給 */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>支　給</Text>
          <View style={S.tableRow}>
            <Text style={S.colLabel}>基本給（時給 × 勤務時間）</Text>
            <Text style={S.colValue}>{fmt(slip.basicPay)}</Text>
          </View>
          <View style={S.tableRowAlt}>
            <Text style={S.colLabel}>残業手当</Text>
            <Text style={S.colValue}>{fmt(slip.overtimePay)}</Text>
          </View>
          <View style={S.tableRow}>
            <Text style={S.colLabel}>交通費</Text>
            <Text style={S.colValue}>{fmt(slip.transportPay)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>総支給額</Text>
            <Text style={S.totalValue}>{fmt(slip.grossPay)}</Text>
          </View>
        </View>

        {/* 控除 */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>控　除</Text>
          <View style={S.tableRow}>
            <Text style={S.colLabel}>社会保険料等</Text>
            <Text style={S.colValue}>{fmt(slip.deductionInsurance)}</Text>
          </View>
          <View style={S.tableRowAlt}>
            <Text style={S.colLabel}>所得税（源泉徴収）</Text>
            <Text style={S.colValue}>{fmt(slip.deductionTax)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>控除合計</Text>
            <Text style={S.totalValue}>{fmt(slip.totalDeduction)}</Text>
          </View>
        </View>

        {/* 差引支給額 */}
        <View style={S.netBox}>
          <Text style={S.netLabel}>差引支給額（振込金額）</Text>
          <Text style={S.netValue}>{fmt(slip.netPay)}</Text>
        </View>

        <View style={S.signatureRow}>
          <View style={S.signatureItem}>
            <Text style={S.signatureLabel}>発行者</Text>
            <Text style={{ fontSize: 11, fontFamily: "NotoSansJP" }}>{issuer.name}</Text>
            <Text style={{ fontSize: 8, color: "#555", marginTop: 2 }}>{issuer.address}</Text>
            <Text style={{ fontSize: 8, color: "#555" }}>{issuer.tel}</Text>
          </View>
          <View style={S.signatureItem}>
            <Text style={S.signatureLabel}>確認印</Text>
            <View style={S.signatureBox} />
          </View>
        </View>

        <Text style={S.notes}>
          ※社会保険料・所得税は手入力された値を使用しています。正確な計算は社労士・税理士にご確認ください。{"\n"}
          ※本明細書の数値に疑問がある場合は発行者までご連絡ください。
        </Text>
      </Page>
    </Document>
  )
}
