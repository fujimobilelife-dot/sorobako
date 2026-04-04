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
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", borderTopWidth: 1, borderTopColor: "#ccc", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 5, paddingHorizontal: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingVertical: 5, paddingHorizontal: 4 },
  colItem: { width: "55%", fontSize: 9 },
  colQty: { width: "15%", textAlign: "right", fontSize: 9 },
  colUnit: { width: "15%", textAlign: "center", fontSize: 9 },
  colNote: { width: "15%", textAlign: "center", fontSize: 9 },
  notes: { marginTop: 24, fontSize: 8, color: "#888", lineHeight: 1.6 },
  confirmBox: { marginTop: 40, borderTopWidth: 0.5, borderTopColor: "#ccc", paddingTop: 16 },
  confirmTitle: { fontSize: 9, color: "#666", marginBottom: 8 },
  confirmRow: { flexDirection: "row", gap: 40 },
  confirmItem: { fontSize: 9, color: "#555" },
  signatureBox: { width: 100, height: 40, borderWidth: 0.5, borderColor: "#ccc", marginTop: 4 },
})

export type DeliveryData = {
  deliveryNo: string
  deliveryDate: string
  clientName: string
  subject: string
  items: { description: string; qty: number; unit: string; note?: string }[]
}

export type IssuerInfo = {
  name: string; address: string; tel: string; email: string
}

export function DeliveryPDF({ del: d, issuer }: { del: DeliveryData; issuer: IssuerInfo }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <Text style={S.title}>納　品　書</Text>
        <Text style={S.subNo}>No. {d.deliveryNo}</Text>

        <View style={S.row}>
          <View style={S.recipientBlock}>
            <Text style={S.recipientName}>{d.clientName} 御中</Text>
            <Text style={S.recipientLabel}>下記の通り納品いたします。</Text>
          </View>
          <View style={S.issuerBlock}>
            <Text style={S.issuerName}>{issuer.name}</Text>
            <Text style={S.issuerSub}>{issuer.address}</Text>
            <Text style={S.issuerSub}>TEL: {issuer.tel}</Text>
            <Text style={S.issuerSub}>{issuer.email}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={S.metaRow}><Text style={S.metaLabel}>納品日：</Text><Text style={S.metaValue}>{d.deliveryDate}</Text></View>
          <View style={S.metaRow}><Text style={S.metaLabel}>件名：</Text><Text style={S.metaValue}>{d.subject}</Text></View>
        </View>

        <View style={S.tableHeader}>
          <Text style={S.colItem}>品目・摘要</Text>
          <Text style={S.colQty}>数量</Text>
          <Text style={S.colUnit}>単位</Text>
          <Text style={S.colNote}>備考</Text>
        </View>

        {d.items.map((item, i) => (
          <View key={i} style={S.tableRow}>
            <Text style={S.colItem}>{item.description}</Text>
            <Text style={S.colQty}>{item.qty}</Text>
            <Text style={S.colUnit}>{item.unit || "式"}</Text>
            <Text style={S.colNote}>{item.note || ""}</Text>
          </View>
        ))}

        <View style={S.confirmBox}>
          <Text style={S.confirmTitle}>【受領確認欄】</Text>
          <View style={S.confirmRow}>
            <Text style={S.confirmItem}>受領日：　　　　年　　月　　日</Text>
            <Text style={S.confirmItem}>受領印：</Text>
          </View>
          <View style={S.signatureBox} />
        </View>

        <Text style={S.notes}>
          ご不明な点がございましたら下記までご連絡ください。{"\n"}
          {issuer.tel} / {issuer.email}
        </Text>
      </Page>
    </Document>
  )
}
