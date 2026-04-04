import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf"),
})

const S = StyleSheet.create({
  page: { fontFamily: "NotoSansJP", fontSize: 10, padding: 48, color: "#1a1a1a" },
  title: { fontSize: 22, fontFamily: "NotoSansJP", textAlign: "center", marginBottom: 24, letterSpacing: 4 },
  subNo: { textAlign: "center", fontSize: 10, color: "#666", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  recipientBlock: { width: "50%" },
  issuerBlock: { width: "45%" },
  recipientName: { fontSize: 14, fontFamily: "NotoSansJP", borderBottomWidth: 1, borderBottomColor: "#1a1a1a", paddingBottom: 4, marginBottom: 4 },
  recipientLabel: { fontSize: 9, color: "#666" },
  issuerName: { fontSize: 12, fontFamily: "NotoSansJP", marginBottom: 4 },
  issuerSub: { fontSize: 9, color: "#555", lineHeight: 1.6 },
  metaRow: { flexDirection: "row", marginBottom: 4 },
  metaLabel: { width: 80, fontSize: 9, color: "#666" },
  metaValue: { fontSize: 9 },
  totalBox: { borderWidth: 1, borderColor: "#1a1a1a", padding: 10, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 11 },
  totalValue: { fontSize: 16, fontFamily: "NotoSansJP" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", borderTopWidth: 1, borderTopColor: "#ccc", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 5, paddingHorizontal: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 5, paddingHorizontal: 4 },
  colItem: { width: "40%", fontSize: 9 },
  colQty: { width: "12%", textAlign: "right", fontSize: 9 },
  colUnit: { width: "20%", textAlign: "right", fontSize: 9 },
  colAmount: { width: "16%", textAlign: "right", fontSize: 9 },
  colTax: { width: "12%", textAlign: "center", fontSize: 9 },
  subtotalSection: { marginTop: 4, marginLeft: "auto", width: "45%" },
  subtotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  subtotalLabel: { fontSize: 9, color: "#555" },
  subtotalValue: { fontSize: 9 },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderTopWidth: 1, borderTopColor: "#1a1a1a", marginTop: 2 },
  grandTotalLabel: { fontSize: 10, fontFamily: "NotoSansJP" },
  grandTotalValue: { fontSize: 10, fontFamily: "NotoSansJP" },
  notes: { marginTop: 20, fontSize: 8, color: "#888", lineHeight: 1.6 },
  validBox: { marginTop: 12, padding: 8, backgroundColor: "#f9f9f9", borderWidth: 0.5, borderColor: "#ccc" },
  validText: { fontSize: 9, color: "#555" },
})

function fmt(n: number) { return "¥" + n.toLocaleString("ja-JP") }

export type EstimateData = {
  estimateNo: string
  issueDate: string
  validUntil: string
  clientName: string
  items: { description: string; qty: number; unitPrice: number; amount: number; taxRate: number }[]
  taxableAmount: number
  taxAmount: number
  totalAmount: number
}

export type IssuerInfo = {
  name: string; address: string; tel: string; email: string
  registrationNo: string; bankName: string; bankType: string; bankNo: string; bankHolder: string
}

export function EstimatePDF({ est, issuer }: { est: EstimateData; issuer: IssuerInfo }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.title}>見　積　書</Text>
        <Text style={S.subNo}>No. {est.estimateNo}</Text>

        <View style={S.row}>
          <View style={S.recipientBlock}>
            <Text style={S.recipientName}>{est.clientName} 御中</Text>
            <Text style={S.recipientLabel}>下記の通りお見積り申し上げます。</Text>
          </View>
          <View style={S.issuerBlock}>
            <Text style={S.issuerName}>{issuer.name}</Text>
            <Text style={S.issuerSub}>{issuer.address}</Text>
            <Text style={S.issuerSub}>TEL: {issuer.tel}</Text>
            <Text style={S.issuerSub}>{issuer.email}</Text>
            {issuer.registrationNo ? <Text style={{ fontSize: 9, color: "#555", marginTop: 4 }}>{issuer.registrationNo}</Text> : null}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={S.metaRow}><Text style={S.metaLabel}>見積日：</Text><Text style={S.metaValue}>{est.issueDate}</Text></View>
          <View style={S.metaRow}><Text style={S.metaLabel}>有効期限：</Text><Text style={S.metaValue}>{est.validUntil}</Text></View>
        </View>

        <View style={S.totalBox}>
          <Text style={S.totalLabel}>お見積金額（税込）</Text>
          <Text style={S.totalValue}>{fmt(est.totalAmount)}</Text>
        </View>

        <View style={S.tableHeader}>
          <Text style={S.colItem}>品目・摘要</Text>
          <Text style={S.colQty}>数量</Text>
          <Text style={S.colUnit}>単価</Text>
          <Text style={S.colTax}>税率</Text>
          <Text style={S.colAmount}>金額（税抜）</Text>
        </View>

        {est.items.map((item, i) => (
          <View key={i} style={S.tableRow}>
            <Text style={S.colItem}>{item.description}</Text>
            <Text style={S.colQty}>{item.qty}</Text>
            <Text style={S.colUnit}>{fmt(item.unitPrice)}</Text>
            <Text style={S.colTax}>{item.taxRate}%</Text>
            <Text style={S.colAmount}>{fmt(item.amount)}</Text>
          </View>
        ))}

        <View style={S.subtotalSection}>
          <View style={S.subtotalRow}><Text style={S.subtotalLabel}>小計（税抜）</Text><Text style={S.subtotalValue}>{fmt(est.taxableAmount)}</Text></View>
          <View style={S.subtotalRow}><Text style={S.subtotalLabel}>消費税（10%）</Text><Text style={S.subtotalValue}>{fmt(est.taxAmount)}</Text></View>
          <View style={S.grandTotalRow}><Text style={S.grandTotalLabel}>合計（税込）</Text><Text style={S.grandTotalValue}>{fmt(est.totalAmount)}</Text></View>
        </View>

        <View style={S.validBox}>
          <Text style={S.validText}>※本見積書の有効期限は発行日より30日間です。</Text>
          <Text style={S.validText}>※価格は税込価格です。別途消費税が発生する場合はご相談ください。</Text>
        </View>

        <Text style={S.notes}>本見積書に関するお問い合わせは下記までご連絡ください。{"\n"}{issuer.tel} / {issuer.email}</Text>
      </Page>
    </Document>
  )
}
