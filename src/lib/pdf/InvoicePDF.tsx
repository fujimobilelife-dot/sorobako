import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.otf"),
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10,
    padding: 48,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 22,
    fontFamily: "NotoSansJP",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 4,
  },
  invoiceNo: {
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  issuerBlock: {
    width: "45%",
  },
  recipientBlock: {
    width: "50%",
  },
  recipientName: {
    fontSize: 14,
    fontFamily: "NotoSansJP",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 4,
    marginBottom: 4,
  },
  recipientLabel: {
    fontSize: 9,
    color: "#666",
  },
  issuerName: {
    fontSize: 12,
    fontFamily: "NotoSansJP",
    marginBottom: 4,
  },
  issuerSub: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.6,
  },
  registrationNo: {
    fontSize: 9,
    color: "#555",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    width: 80,
    fontSize: 9,
    color: "#666",
  },
  metaValue: {
    fontSize: 9,
  },
  totalBox: {
    borderWidth: 1,
    borderColor: "#1a1a1a",
    padding: 10,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "NotoSansJP",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  colItem: { width: "40%", fontSize: 9 },
  colQty: { width: "12%", textAlign: "right", fontSize: 9 },
  colUnit: { width: "20%", textAlign: "right", fontSize: 9 },
  colAmount: { width: "16%", textAlign: "right", fontSize: 9 },
  colTax: { width: "12%", textAlign: "center", fontSize: 9 },
  subtotalSection: {
    marginTop: 4,
    marginLeft: "auto",
    width: "45%",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  subtotalLabel: {
    fontSize: 9,
    color: "#555",
  },
  subtotalValue: {
    fontSize: 9,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 2,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "NotoSansJP",
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "NotoSansJP",
  },
  bankSection: {
    marginTop: 28,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    paddingTop: 12,
  },
  bankTitle: {
    fontSize: 9,
    color: "#666",
    marginBottom: 6,
  },
  bankInfo: {
    fontSize: 9,
    lineHeight: 1.8,
    color: "#333",
  },
  notes: {
    marginTop: 16,
    fontSize: 8,
    color: "#888",
    lineHeight: 1.6,
  },
})

export type InvoiceData = {
  invoiceNo: string
  issueDate: string
  dueDate: string
  clientName: string
  items: { description: string; qty: number; unitPrice: number; amount: number; taxRate: number }[]
  taxableAmount: number
  taxAmount: number
  totalAmount: number
}

const ISSUER = {
  name: "FIX-Marketing",
  address: "（住所を入力）",
  tel: "（電話番号を入力）",
  email: "info@sorobako.app",
  registrationNo: "T-XXXXXXXXXXXXXXXXX", // インボイス登録番号（要変更）
  bankName: "（銀行名）（支店名）",
  bankType: "普通",
  bankNo: "（口座番号）",
  bankHolder: "FIX-Marketing（フィックスマーケティング）",
}

function fmt(n: number) {
  return "¥" + n.toLocaleString("ja-JP")
}

export function InvoicePDF({ inv }: { inv: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>請　求　書</Text>
        <Text style={styles.invoiceNo}>No. {inv.invoiceNo}</Text>

        <View style={styles.row}>
          {/* 宛先 */}
          <View style={styles.recipientBlock}>
            <Text style={styles.recipientName}>{inv.clientName} 御中</Text>
            <Text style={styles.recipientLabel}>下記の通りご請求申し上げます。</Text>
          </View>

          {/* 発行元 */}
          <View style={styles.issuerBlock}>
            <Text style={styles.issuerName}>{ISSUER.name}</Text>
            <Text style={styles.issuerSub}>{ISSUER.address}</Text>
            <Text style={styles.issuerSub}>TEL: {ISSUER.tel}</Text>
            <Text style={styles.issuerSub}>{ISSUER.email}</Text>
            <Text style={styles.registrationNo}>適格請求書発行事業者登録番号</Text>
            <Text style={styles.registrationNo}>{ISSUER.registrationNo}</Text>
          </View>
        </View>

        {/* 請求日・支払期限 */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>請求日：</Text>
            <Text style={styles.metaValue}>{inv.issueDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>支払期限：</Text>
            <Text style={styles.metaValue}>{inv.dueDate}</Text>
          </View>
        </View>

        {/* ご請求金額 */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>ご請求金額（税込）</Text>
          <Text style={styles.totalValue}>{fmt(inv.totalAmount)}</Text>
        </View>

        {/* 明細ヘッダー */}
        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>品目・摘要</Text>
          <Text style={styles.colQty}>数量</Text>
          <Text style={styles.colUnit}>単価</Text>
          <Text style={styles.colTax}>税率</Text>
          <Text style={styles.colAmount}>金額（税抜）</Text>
        </View>

        {/* 明細行 */}
        {inv.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colItem}>{item.description}</Text>
            <Text style={styles.colQty}>{item.qty}</Text>
            <Text style={styles.colUnit}>{fmt(item.unitPrice)}</Text>
            <Text style={styles.colTax}>{item.taxRate}%</Text>
            <Text style={styles.colAmount}>{fmt(item.amount)}</Text>
          </View>
        ))}

        {/* 小計・消費税・合計 */}
        <View style={styles.subtotalSection}>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>小計（税抜）</Text>
            <Text style={styles.subtotalValue}>{fmt(inv.taxableAmount)}</Text>
          </View>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>消費税（10%）</Text>
            <Text style={styles.subtotalValue}>{fmt(inv.taxAmount)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>合計（税込）</Text>
            <Text style={styles.grandTotalValue}>{fmt(inv.totalAmount)}</Text>
          </View>
        </View>

        {/* 振込先 */}
        <View style={styles.bankSection}>
          <Text style={styles.bankTitle}>【お振込先】</Text>
          <Text style={styles.bankInfo}>
            {ISSUER.bankName}　{ISSUER.bankType}　{ISSUER.bankNo}{"\n"}
            口座名義：{ISSUER.bankHolder}
          </Text>
        </View>

        <Text style={styles.notes}>
          ※振込手数料はご負担をお願いいたします。{"\n"}
          ※本書は適格請求書（インボイス）として発行しています。
        </Text>
      </Page>
    </Document>
  )
}
