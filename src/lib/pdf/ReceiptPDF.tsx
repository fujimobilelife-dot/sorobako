import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf"),
})

const S = StyleSheet.create({
  page: { fontFamily: "NotoSansJP", fontSize: 10, padding: 48, color: "#1a1a1a" },
  title: { fontSize: 28, fontFamily: "NotoSansJP", textAlign: "center", marginBottom: 12, letterSpacing: 6 },
  subNo: { textAlign: "center", fontSize: 10, color: "#666", marginBottom: 28 },
  recipientName: { fontSize: 18, fontFamily: "NotoSansJP", borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 6, marginBottom: 4, textAlign: "center" },
  recipientLabel: { fontSize: 9, color: "#666", textAlign: "center", marginBottom: 32 },
  amountBox: { borderWidth: 2, borderColor: "#1a1a1a", padding: 20, marginBottom: 24, alignItems: "center" },
  amountLabel: { fontSize: 11, marginBottom: 8 },
  amountValue: { fontSize: 36, fontFamily: "NotoSansJP", letterSpacing: 2 },
  detailSection: { marginBottom: 24 },
  detailRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 8 },
  detailLabel: { width: "35%", fontSize: 9, color: "#666" },
  detailValue: { width: "65%", fontSize: 9 },
  issuerSection: { marginTop: 32, borderTopWidth: 0.5, borderTopColor: "#ccc", paddingTop: 20, flexDirection: "row", justifyContent: "flex-end" },
  issuerBlock: { width: "45%", textAlign: "right" },
  issuerName: { fontSize: 13, fontFamily: "NotoSansJP", marginBottom: 6 },
  issuerSub: { fontSize: 9, color: "#555", lineHeight: 1.7 },
  registrationNo: { fontSize: 9, color: "#555", marginTop: 4 },
  stampArea: { marginTop: 16, alignItems: "flex-end" },
  stampBox: { width: 60, height: 60, borderWidth: 1, borderColor: "#ccc", alignItems: "center", justifyContent: "center" },
  stampText: { fontSize: 8, color: "#ccc" },
  notes: { marginTop: 20, fontSize: 8, color: "#888", lineHeight: 1.6, textAlign: "center" },
})

function fmt(n: number) { return "¥" + n.toLocaleString("ja-JP") }

export type ReceiptData = {
  receiptNo: string
  receiptDate: string
  clientName: string
  amount: number
  description: string
  taxableAmount: number
  taxAmount: number
}

export type IssuerInfo = {
  name: string; address: string; tel: string; email: string; registrationNo: string
}

export function ReceiptPDF({ rec, issuer }: { rec: ReceiptData; issuer: IssuerInfo }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.title}>領　収　書</Text>
        <Text style={S.subNo}>No. {rec.receiptNo}</Text>

        <Text style={S.recipientName}>{rec.clientName} 様</Text>
        <Text style={S.recipientLabel}>下記の通り領収いたしました。</Text>

        <View style={S.amountBox}>
          <Text style={S.amountLabel}>領収金額（税込）</Text>
          <Text style={S.amountValue}>{fmt(rec.amount)}</Text>
        </View>

        <View style={S.detailSection}>
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>領収日</Text>
            <Text style={S.detailValue}>{rec.receiptDate}</Text>
          </View>
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>但し書き</Text>
            <Text style={S.detailValue}>{rec.description}として</Text>
          </View>
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>内訳</Text>
            <Text style={S.detailValue}>税抜 {fmt(rec.taxableAmount)} / 消費税（10%） {fmt(rec.taxAmount)}</Text>
          </View>
        </View>

        <View style={S.issuerSection}>
          <View style={S.issuerBlock}>
            <Text style={S.issuerName}>{issuer.name}</Text>
            <Text style={S.issuerSub}>{issuer.address}</Text>
            <Text style={S.issuerSub}>TEL: {issuer.tel}</Text>
            <Text style={S.issuerSub}>{issuer.email}</Text>
            {issuer.registrationNo ? (
              <Text style={S.registrationNo}>登録番号: {issuer.registrationNo}</Text>
            ) : null}
          </View>
        </View>

        <View style={S.stampArea}>
          <View style={S.stampBox}><Text style={S.stampText}>印</Text></View>
        </View>

        <Text style={S.notes}>
          ※本領収書は適格請求書（インボイス）として発行しています。{"\n"}
          ※再発行はいたしかねますので大切に保管してください。
        </Text>
      </Page>
    </Document>
  )
}
