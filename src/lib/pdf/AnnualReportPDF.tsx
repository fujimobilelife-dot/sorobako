import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf"),
})

const S = StyleSheet.create({
  page: { fontFamily: "NotoSansJP", fontSize: 9, padding: 40, color: "#1a1a1a" },
  coverPage: { fontFamily: "NotoSansJP", fontSize: 9, padding: 40, color: "#1a1a1a", alignItems: "center", justifyContent: "center" },
  coverTitle: { fontSize: 28, fontFamily: "NotoSansJP", letterSpacing: 4, marginBottom: 16 },
  coverYear: { fontSize: 18, fontFamily: "NotoSansJP", color: "#2563eb", marginBottom: 8 },
  coverSub: { fontSize: 11, color: "#666", marginBottom: 48 },
  coverLine: { width: 200, height: 1, backgroundColor: "#ccc", marginBottom: 48 },
  coverName: { fontSize: 14, fontFamily: "NotoSansJP", marginBottom: 4 },
  coverGenDate: { fontSize: 9, color: "#888" },
  sectionTitle: { fontSize: 13, fontFamily: "NotoSansJP", marginBottom: 12, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#2563eb" },
  summaryGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  summaryCard: { flex: 1, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 4 },
  summaryLabel: { fontSize: 8, color: "#666", marginBottom: 4 },
  summaryValue: { fontSize: 16, fontFamily: "NotoSansJP" },
  summaryValueProfit: { fontSize: 16, fontFamily: "NotoSansJP", color: "#2563eb" },
  summaryValueExpense: { fontSize: 16, fontFamily: "NotoSansJP", color: "#dc2626" },
  tableHeader: { flexDirection: "row", backgroundColor: "#1a1a1a", paddingVertical: 5, paddingHorizontal: 4, marginTop: 4 },
  tableHeaderText: { color: "#fff", fontSize: 8, fontFamily: "NotoSansJP" },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5", paddingVertical: 4, paddingHorizontal: 4 },
  tableRowAlt: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5", paddingVertical: 4, paddingHorizontal: 4, backgroundColor: "#f9fafb" },
  tableText: { fontSize: 8 },
  colMonth: { width: "12%" },
  colRevenue: { width: "22%", textAlign: "right" },
  colExpense: { width: "22%", textAlign: "right" },
  colProfit: { width: "22%", textAlign: "right" },
  colMargin: { width: "22%", textAlign: "right" },
  rankNo: { width: "8%" },
  rankName: { width: "42%" },
  rankAmount: { width: "25%", textAlign: "right" },
  rankShare: { width: "25%", textAlign: "right" },
  expCat: { width: "50%" },
  expAmt: { width: "30%", textAlign: "right" },
  expShare: { width: "20%", textAlign: "right" },
  totalRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 4, backgroundColor: "#eff6ff", borderTopWidth: 1, borderTopColor: "#2563eb" },
  totalText: { fontSize: 8, fontFamily: "NotoSansJP", color: "#1d4ed8" },
  pageNum: { position: "absolute", bottom: 24, right: 40, fontSize: 8, color: "#aaa" },
  section: { marginBottom: 28 },
})

function fmt(n: number) { return "¥" + Math.round(n).toLocaleString("ja-JP") }

export type MonthlyRow = {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export type ClientRanking = {
  rank: number
  name: string
  amount: number
  share: number
}

export type ExpenseCategory = {
  category: string
  amount: number
  share: number
}

export type AnnualReportData = {
  year: number
  issuerName: string
  generatedAt: string
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  monthly: MonthlyRow[]
  clientRanking: ClientRanking[]
  expenseCategories: ExpenseCategory[]
}

export function AnnualReportPDF({ report }: { report: AnnualReportData }) {
  const marginPct = report.totalRevenue > 0
    ? Math.round(report.totalProfit / report.totalRevenue * 100)
    : 0

  return (
    <Document>
      {/* 表紙 */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverTitle}>年　間　収　支　レポート</Text>
        <Text style={S.coverYear}>{report.year}年度</Text>
        <Text style={S.coverSub}>Annual Financial Report</Text>
        <View style={S.coverLine} />
        <Text style={S.coverName}>{report.issuerName}</Text>
        <Text style={S.coverGenDate}>作成日: {report.generatedAt}</Text>
      </Page>

      {/* サマリー + 月次表 */}
      <Page size="A4" style={S.page}>
        <View style={S.section}>
          <Text style={S.sectionTitle}>{report.year}年度 収支サマリー</Text>
          <View style={S.summaryGrid}>
            <View style={S.summaryCard}>
              <Text style={S.summaryLabel}>年間売上合計</Text>
              <Text style={S.summaryValue}>{fmt(report.totalRevenue)}</Text>
            </View>
            <View style={S.summaryCard}>
              <Text style={S.summaryLabel}>年間経費合計</Text>
              <Text style={S.summaryValueExpense}>{fmt(report.totalExpenses)}</Text>
            </View>
            <View style={S.summaryCard}>
              <Text style={S.summaryLabel}>年間粗利合計</Text>
              <Text style={S.summaryValueProfit}>{fmt(report.totalProfit)}</Text>
            </View>
            <View style={S.summaryCard}>
              <Text style={S.summaryLabel}>粗利率</Text>
              <Text style={S.summaryValueProfit}>{marginPct}%</Text>
            </View>
          </View>
        </View>

        <View style={S.section}>
          <Text style={S.sectionTitle}>月別収支</Text>
          <View style={S.tableHeader}>
            <Text style={[S.tableHeaderText, S.colMonth]}>月</Text>
            <Text style={[S.tableHeaderText, S.colRevenue]}>売上</Text>
            <Text style={[S.tableHeaderText, S.colExpense]}>経費</Text>
            <Text style={[S.tableHeaderText, S.colProfit]}>粗利</Text>
            <Text style={[S.tableHeaderText, S.colMargin]}>粗利率</Text>
          </View>
          {report.monthly.map((row, i) => {
            const margin = row.revenue > 0 ? Math.round(row.profit / row.revenue * 100) : 0
            return (
              <View key={i} style={i % 2 === 0 ? S.tableRow : S.tableRowAlt}>
                <Text style={[S.tableText, S.colMonth]}>{row.month}</Text>
                <Text style={[S.tableText, S.colRevenue]}>{fmt(row.revenue)}</Text>
                <Text style={[S.tableText, S.colExpense]}>{fmt(row.expenses)}</Text>
                <Text style={[S.tableText, S.colProfit]}>{fmt(row.profit)}</Text>
                <Text style={[S.tableText, S.colMargin]}>{margin}%</Text>
              </View>
            )
          })}
          <View style={S.totalRow}>
            <Text style={[S.totalText, S.colMonth]}>合計</Text>
            <Text style={[S.totalText, S.colRevenue]}>{fmt(report.totalRevenue)}</Text>
            <Text style={[S.totalText, S.colExpense]}>{fmt(report.totalExpenses)}</Text>
            <Text style={[S.totalText, S.colProfit]}>{fmt(report.totalProfit)}</Text>
            <Text style={[S.totalText, S.colMargin]}>{marginPct}%</Text>
          </View>
        </View>
        <Text style={S.pageNum}>2</Text>
      </Page>

      {/* 取引先ランキング + 経費カテゴリ */}
      <Page size="A4" style={S.page}>
        <View style={S.section}>
          <Text style={S.sectionTitle}>取引先別 売上ランキング</Text>
          <View style={S.tableHeader}>
            <Text style={[S.tableHeaderText, S.rankNo]}>順位</Text>
            <Text style={[S.tableHeaderText, S.rankName]}>取引先名</Text>
            <Text style={[S.tableHeaderText, S.rankAmount]}>売上合計</Text>
            <Text style={[S.tableHeaderText, S.rankShare]}>構成比</Text>
          </View>
          {report.clientRanking.slice(0, 15).map((c, i) => (
            <View key={i} style={i % 2 === 0 ? S.tableRow : S.tableRowAlt}>
              <Text style={[S.tableText, S.rankNo]}>{c.rank}</Text>
              <Text style={[S.tableText, S.rankName]}>{c.name}</Text>
              <Text style={[S.tableText, S.rankAmount]}>{fmt(c.amount)}</Text>
              <Text style={[S.tableText, S.rankShare]}>{c.share}%</Text>
            </View>
          ))}
        </View>

        <View style={S.section}>
          <Text style={S.sectionTitle}>経費カテゴリ別内訳</Text>
          <View style={S.tableHeader}>
            <Text style={[S.tableHeaderText, S.expCat]}>カテゴリ</Text>
            <Text style={[S.tableHeaderText, S.expAmt]}>合計金額</Text>
            <Text style={[S.tableHeaderText, S.expShare]}>構成比</Text>
          </View>
          {report.expenseCategories.map((c, i) => (
            <View key={i} style={i % 2 === 0 ? S.tableRow : S.tableRowAlt}>
              <Text style={[S.tableText, S.expCat]}>{c.category || "未分類"}</Text>
              <Text style={[S.tableText, S.expAmt]}>{fmt(c.amount)}</Text>
              <Text style={[S.tableText, S.expShare]}>{c.share}%</Text>
            </View>
          ))}
          <View style={S.totalRow}>
            <Text style={[S.totalText, S.expCat]}>合計</Text>
            <Text style={[S.totalText, S.expAmt]}>{fmt(report.totalExpenses)}</Text>
            <Text style={[S.totalText, S.expShare]}>100%</Text>
          </View>
        </View>

        <Text style={{ fontSize: 7, color: "#aaa", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          本レポートはGoogleスプレッドシートのデータをもとに自動生成されたものです。{"\n"}
          経費計算は支払いシートと経費シートの合計値です。会計上の正確な数値ではありません。正確な申告には会計ソフト・税理士をご利用ください。
        </Text>
        <Text style={S.pageNum}>3</Text>
      </Page>
    </Document>
  )
}
