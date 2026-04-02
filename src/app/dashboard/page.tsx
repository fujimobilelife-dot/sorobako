"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"

type Alert = { type: string; severity: string; message: string }
type Summary = {
  totalRevenue: number
  totalExpenses: number
  grossProfit: number
  clientCount: number
  invoiceCount: number
  staffCount: number
}
type DashboardData = {
  plan: "free" | "pro"
  summary: Summary
  alerts: Alert[]
  clients: Record<string, string>[]
  invoices: Record<string, string>[]
  payments: Record<string, string>[]
  expenses: Record<string, string>[]
}

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_1THkDnAZHuZy9Zn0GZQWc7eV"
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "price_1THkFOAZHuZy9Zn0tTC79s8y"

function isCurrentMonth(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

// ---- UpgradeModal ----
function UpgradeModal({
  feature,
  onClose,
  onCheckout,
  checkoutLoading,
}: {
  feature: string
  onClose: () => void
  onCheckout: (isYearly: boolean) => void
  checkoutLoading: boolean
}) {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}
      onClick={onClose}
    >
      <div
        style={{background:"#fff",borderRadius:16,padding:32,maxWidth:420,width:"92%"}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:8}}>🔒</div>
          <h2 style={{fontSize:18,marginBottom:4}}>Proプランで{feature}を解放</h2>
          <p style={{color:"#666",fontSize:13,lineHeight:1.6}}>
            アラート・スタッフ管理・年間レポートなど全機能が使えます。
          </p>
        </div>

        {/* 月払い/年払いトグル */}
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,padding:3,marginBottom:20,gap:3}}>
          <button
            onClick={() => setIsYearly(false)}
            style={{
              flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background: !isYearly ? "#fff" : "transparent",
              color: !isYearly ? "var(--c-text)" : "#888",
              boxShadow: !isYearly ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            月払い
          </button>
          <button
            onClick={() => setIsYearly(true)}
            style={{
              flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background: isYearly ? "#fff" : "transparent",
              color: isYearly ? "var(--c-text)" : "#888",
              boxShadow: isYearly ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}
          >
            年払い
            <span style={{background:"#d1fae5",color:"#065f46",fontSize:10,padding:"1px 6px",borderRadius:99,fontWeight:700}}>
              2ヶ月おトク
            </span>
          </button>
        </div>

        {/* 価格表示 */}
        <div style={{textAlign:"center",marginBottom:20,padding:"16px 0",borderTop:"1px solid #f3f4f6",borderBottom:"1px solid #f3f4f6"}}>
          {isYearly ? (
            <>
              <div style={{fontSize:32,fontWeight:700,letterSpacing:-1}}>
                ¥14,800<span style={{fontSize:14,fontWeight:400,color:"#888"}}>/年</span>
              </div>
              <div style={{fontSize:12,color:"#666",marginTop:4}}>月あたり¥1,233（税別）— 通常より¥2,960お得</div>
            </>
          ) : (
            <>
              <div style={{fontSize:32,fontWeight:700,letterSpacing:-1}}>
                ¥1,480<span style={{fontSize:14,fontWeight:400,color:"#888"}}>/月</span>
              </div>
              <div style={{fontSize:12,color:"#666",marginTop:4}}>税込¥1,628 / いつでも解約可能</div>
            </>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onCheckout(isYearly)}
          disabled={checkoutLoading}
          className="btn btn-primary"
          style={{width:"100%",justifyContent:"center",marginBottom:10,opacity:checkoutLoading?0.7:1}}
        >
          {checkoutLoading ? "処理中..." : `今すぐ${isYearly ? "年額" : "月額"}プランにアップグレード →`}
        </button>
        <button onClick={onClose} className="btn btn-ghost" style={{width:"100%",justifyContent:"center"}}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

// ---- ProGate ----
function ProGate({
  plan,
  feature,
  onUpgrade,
  children,
}: {
  plan: "free" | "pro"
  feature: string
  onUpgrade: (feature: string) => void
  children: React.ReactNode
}) {
  if (plan === "pro") return <>{children}</>
  return (
    <div style={{position:"relative",borderRadius:8,overflow:"hidden"}}>
      <div style={{filter:"blur(4px)",pointerEvents:"none",userSelect:"none",opacity:0.55}}>
        {children}
      </div>
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
        background:"rgba(255,255,255,0.78)",
      }}>
        <span style={{fontSize:28,marginBottom:8}}>🔒</span>
        <p style={{fontWeight:600,marginBottom:12,fontSize:14}}>{feature}はPro限定機能です</p>
        <button onClick={() => onUpgrade(feature)} className="btn btn-primary" style={{padding:"6px 20px",fontSize:13}}>
          Proにアップグレード
        </button>
      </div>
    </div>
  )
}

// ---- 月利用バー ----
function MonthUsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min((used / limit) * 100, 100)
  const over = used > limit
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:over?"#b91c1c":"#555"}}>
      <span>{label}: {used}/{limit}件</span>
      <div style={{width:80,height:6,background:"#e5e7eb",borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:over?"#ef4444":"var(--c-accent)",borderRadius:99}} />
      </div>
      {over && <span style={{fontWeight:600}}>上限超過</span>}
    </div>
  )
}

// ---- Main ----
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [sheetId, setSheetId] = useState("")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedSheetId, setSavedSheetId] = useState("")
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [syncMessage, setSyncMessage] = useState("")
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sorobako_sheet_id")
    if (saved) { setSheetId(saved); setSavedSheetId(saved) }
  }, [])

  useEffect(() => {
    if (savedSheetId && session) fetchData(savedSheetId)
  }, [savedSheetId, session])

  // ?upgraded=true の処理
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("upgraded") !== "true") return

    const sid = params.get("sid") || localStorage.getItem("sorobako_sheet_id") || ""
    if (!sid) return

    setSyncMessage("プランを確認中...")
    fetch("/api/stripe/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheetId: sid }),
    })
      .then(r => r.json())
      .then(json => {
        setSyncMessage(json.plan === "pro" ? "✅ Proプランが有効になりました！" : "")
        // URL から upgraded パラメータを除去して再読み込み
        window.history.replaceState({}, "", "/dashboard")
        if (sid) fetchData(sid)
      })
      .catch(() => setSyncMessage(""))
  }, [])

  const fetchData = async (id: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/sheets?id=${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error((await res.json()).error || "データの取得に失敗しました")
      setData(await res.json())
      localStorage.setItem("sorobako_sheet_id", id)
      setSavedSheetId(id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (isYearly: boolean) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: isYearly ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID,
          sheetId: savedSheetId,
        }),
      })
      const { url, error: err } = await res.json()
      if (err) throw new Error(err)
      if (url) window.location.href = url
    } catch (e: any) {
      alert("決済ページの読み込みに失敗しました: " + e.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetId: savedSheetId }),
      })
      const { url, error: err } = await res.json()
      if (err) throw new Error(err)
      if (url) window.location.href = url
    } catch (e: any) {
      alert("ポータルの読み込みに失敗しました: " + e.message)
    } finally {
      setPortalLoading(false)
    }
  }

  if (status === "loading") return <div className="dash-loading">読み込み中...</div>

  if (!session) {
    return (
      <div className="dash-login">
        <div className="dash-login-card">
          <div className="logo"><div className="logo-mark">S</div>ソロバコ</div>
          <h1>ダッシュボード</h1>
          <p>Googleアカウントでログインして、<br/>スプレッドシートのデータを表示します。</p>
          <button onClick={() => signIn("google")} className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Googleでログイン</button>
          <a href="/" className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}}>トップに戻る</a>
        </div>
      </div>
    )
  }

  if (!savedSheetId) {
    return (
      <div className="dash-login">
        <div className="dash-login-card">
          <div className="logo"><div className="logo-mark">S</div>ソロバコ</div>
          <h1>スプレッドシートを接続</h1>
          <p>ソロバコのテンプレートをコピーしたスプレッドシートのURLまたはIDを入力してください。</p>
          <input
            type="text"
            value={sheetId}
            onChange={e => setSheetId(e.target.value)}
            placeholder="スプレッドシートのURL or ID"
            className="dash-input"
          />
          <button
            onClick={() => {
              let id = sheetId.trim()
              const match = id.match(/\/d\/([a-zA-Z0-9_-]+)/)
              if (match) id = match[1]
              if (id) fetchData(id)
            }}
            className="btn btn-primary"
            style={{width:"100%",justifyContent:"center"}}
            disabled={!sheetId.trim()}
          >接続する</button>
          {error && <div className="dash-error">{error}</div>}
          <button onClick={() => signOut()} className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}}>ログアウト</button>
        </div>
      </div>
    )
  }

  const plan = data?.plan ?? "free"
  const isFree = plan === "free"
  const FREE_LIMIT = 3

  const allInvoices = data?.invoices ?? []
  const allExpenses = data?.expenses ?? []
  const thisMonthInvoices = allInvoices.filter(inv => isCurrentMonth(inv["発行日"]))
  const thisMonthExpenses = allExpenses.filter(exp => isCurrentMonth(exp["日付"] || ""))
  const visibleInvoices = isFree ? thisMonthInvoices.slice(0, FREE_LIMIT) : allInvoices
  const visibleExpenses = isFree ? thisMonthExpenses.slice(0, FREE_LIMIT) : allExpenses
  const invoiceOver = isFree && thisMonthInvoices.length > FREE_LIMIT
  const expenseOver = isFree && thisMonthExpenses.length > FREE_LIMIT

  return (
    <div className="dash-container">
      <nav className="dash-nav">
        <div className="wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="/" className="logo" style={{textDecoration:"none",color:"var(--c-text)"}}>
            <div className="logo-mark">S</div>ソロバコ
          </a>
          <div style={{display:"flex",alignItems:"center",gap:12,fontSize:13}}>
            <span style={{
              background: isFree ? "#f3f4f6" : "var(--c-accent)",
              color: isFree ? "#555" : "#fff",
              fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:99,
            }}>
              {isFree ? "無料プラン" : "✓ Pro"}
            </span>
            <span style={{color:"var(--c-muted)"}}>{session.user?.email}</span>
            {!isFree && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                style={{background:"none",border:"none",color:"var(--c-accent)",cursor:"pointer",fontSize:13}}
              >
                {portalLoading ? "..." : "プラン管理"}
              </button>
            )}
            <button
              onClick={() => { localStorage.removeItem("sorobako_sheet_id"); setSavedSheetId(""); setData(null) }}
              style={{background:"none",border:"none",color:"var(--c-accent)",cursor:"pointer",fontSize:13}}
            >シート変更</button>
            <button
              onClick={() => signOut()}
              style={{background:"none",border:"none",color:"var(--c-muted)",cursor:"pointer",fontSize:13}}
            >ログアウト</button>
          </div>
        </div>
      </nav>

      <div className="wrap" style={{paddingTop:24,paddingBottom:60}}>
        {/* 決済成功メッセージ */}
        {syncMessage && (
          <div style={{background:"#d1fae5",border:"1px solid #6ee7b7",borderRadius:8,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#065f46",fontWeight:600}}>
            {syncMessage}
          </div>
        )}

        {loading && <div className="dash-loading">データを読み込み中...</div>}
        {error && (
          <div className="dash-error">
            {error}
            <button onClick={() => fetchData(savedSheetId)} className="btn btn-ghost" style={{marginLeft:12,padding:"4px 12px",fontSize:12}}>再試行</button>
          </div>
        )}

        {data && (
          <>
            {/* 無料プランバナー */}
            {isFree && (
              <div style={{
                background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:8,
                padding:"12px 16px",marginBottom:20,
                display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",
              }}>
                <span style={{fontSize:13,color:"#92400e"}}>
                  🔓 <strong>無料プラン</strong> — 今月分・月3件まで表示。アラート等のPro機能はロックされています。
                </span>
                <button
                  onClick={() => setUpgradeFeature("全機能")}
                  className="btn btn-primary"
                  style={{padding:"4px 14px",fontSize:12,flexShrink:0}}
                >
                  Proにアップグレード
                </button>
              </div>
            )}

            {/* アラート（Pro限定） */}
            <ProGate plan={plan} feature="アラート" onUpgrade={setUpgradeFeature}>
              <div className="dash-alerts">
                {data.alerts.length > 0 ? (
                  <>
                    <h3>⚠️ {data.alerts.length}件のアラート</h3>
                    {data.alerts.map((alert, i) => (
                      <div key={i} className={`dash-alert-item ${alert.severity}`}>
                        <span className="dash-alert-badge">{alert.type === "unpaid" ? "未入金" : "支払い超過"}</span>
                        {alert.message}
                      </div>
                    ))}
                  </>
                ) : (
                  <p style={{color:"var(--c-muted)",fontSize:14,margin:0}}>✅ 現在アラートはありません</p>
                )}
              </div>
            </ProGate>

            {/* サマリーカード */}
            <div className="dash-metrics">
              <div className="dash-metric-card">
                <div className="dash-metric-label">売上{isFree && <span style={{fontSize:10,color:"#999",marginLeft:4}}>（今月）</span>}</div>
                <div className="dash-metric-value">¥{data.summary.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="dash-metric-card">
                <div className="dash-metric-label">経費・支払い{isFree && <span style={{fontSize:10,color:"#999",marginLeft:4}}>（今月）</span>}</div>
                <div className="dash-metric-value expense">¥{data.summary.totalExpenses.toLocaleString()}</div>
              </div>
              <div className="dash-metric-card">
                <div className="dash-metric-label">粗利{isFree && <span style={{fontSize:10,color:"#999",marginLeft:4}}>（今月）</span>}</div>
                <div className="dash-metric-value profit">¥{data.summary.grossProfit.toLocaleString()}</div>
              </div>
            </div>

            {/* 前月比・前年比（Pro限定） */}
            <ProGate plan={plan} feature="前月比・前年比レポート" onUpgrade={setUpgradeFeature}>
              <div className="dash-metrics">
                <div className="dash-metric-card">
                  <div className="dash-metric-label">前月比</div>
                  <div className="dash-metric-value" style={{color:"var(--c-accent)"}}>＋12.4%</div>
                </div>
                <div className="dash-metric-card">
                  <div className="dash-metric-label">前年比</div>
                  <div className="dash-metric-value" style={{color:"var(--c-accent)"}}>＋34.2%</div>
                </div>
                <div className="dash-metric-card">
                  <div className="dash-metric-label">年間予測売上</div>
                  <div className="dash-metric-value">¥2,400,000</div>
                </div>
              </div>
            </ProGate>

            {/* 統計 */}
            <div className="dash-stats">
              <div className="dash-stat">取引先: <strong>{data.summary.clientCount}社</strong></div>
              <div className="dash-stat">請求書: <strong>{data.summary.invoiceCount}件</strong></div>
              <div className="dash-stat">スタッフ: <strong>{data.summary.staffCount}名</strong></div>
            </div>

            {/* 請求書一覧 */}
            <div className="dash-section">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:12,flexWrap:"wrap"}}>
                <h2 style={{margin:0}}>請求書一覧</h2>
                {isFree && <MonthUsageBar used={thisMonthInvoices.length} limit={FREE_LIMIT} label="今月" />}
              </div>
              {invoiceOver && (
                <div style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#92400e",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                  <span>今月の請求書が{FREE_LIMIT}件を超えています。すべて表示するにはProが必要です。</span>
                  <button onClick={() => setUpgradeFeature("請求書の全件表示")} className="btn btn-primary" style={{padding:"3px 12px",fontSize:12,flexShrink:0}}>アップグレード</button>
                </div>
              )}
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr><th>請求書No</th><th>取引先</th><th>件名</th><th>合計</th><th>ステータス</th><th></th></tr>
                  </thead>
                  <tbody>
                    {visibleInvoices.map((inv, i) => (
                      <tr key={i}>
                        <td>{inv["請求書No"]}</td>
                        <td>{inv["取引先名"]}</td>
                        <td>{inv["件名"]}</td>
                        <td style={{textAlign:"right"}}>{inv["合計（税込）"]}</td>
                        <td><span className={`status-badge ${inv["ステータス"] === "入金済" ? "paid" : "unpaid"}`}>{inv["ステータス"]}</span></td>
                        <td>
                          <a
                            href={`/api/pdf/invoice?invoiceNo=${encodeURIComponent(inv["請求書No"])}&sheetId=${encodeURIComponent(savedSheetId)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="btn btn-ghost"
                            style={{padding:"3px 10px",fontSize:12,whiteSpace:"nowrap"}}
                          >PDF発行</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 経費一覧 */}
            <div className="dash-section">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,gap:12,flexWrap:"wrap"}}>
                <h2 style={{margin:0}}>経費一覧</h2>
                {isFree && <MonthUsageBar used={thisMonthExpenses.length} limit={FREE_LIMIT} label="今月" />}
              </div>
              {expenseOver && (
                <div style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#92400e",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                  <span>今月の経費が{FREE_LIMIT}件を超えています。すべて表示するにはProが必要です。</span>
                  <button onClick={() => setUpgradeFeature("経費の全件表示")} className="btn btn-primary" style={{padding:"3px 12px",fontSize:12,flexShrink:0}}>アップグレード</button>
                </div>
              )}
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr><th>日付</th><th>カテゴリ</th><th>内容</th><th>金額（税込）</th></tr>
                  </thead>
                  <tbody>
                    {visibleExpenses.map((exp, i) => (
                      <tr key={i}>
                        <td>{exp["日付"]}</td>
                        <td>{exp["カテゴリ"]}</td>
                        <td>{exp["内容"]}</td>
                        <td style={{textAlign:"right"}}>{exp["金額（税込）"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 取引先一覧 */}
            <div className="dash-section">
              <h2>取引先一覧</h2>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr><th>ID</th><th>取引先名</th><th>区分</th><th>担当者</th><th>締め日</th></tr>
                  </thead>
                  <tbody>
                    {data.clients.map((c, i) => (
                      <tr key={i}>
                        <td>{c["取引先ID"]}</td>
                        <td>{c["取引先名"]}</td>
                        <td>{c["区分"]}</td>
                        <td>{c["担当者名"]}</td>
                        <td>{c["締め日"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* スタッフ管理（Pro限定） */}
            <div className="dash-section">
              <h2>スタッフ管理</h2>
              <ProGate plan={plan} feature="スタッフ管理" onUpgrade={setUpgradeFeature}>
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>スタッフID</th><th>氏名</th><th>時給</th><th>今月の勤務時間</th><th>今月の給与</th></tr></thead>
                    <tbody>
                      <tr><td>S001</td><td>サンプル 太郎</td><td>¥1,200</td><td>80h</td><td>¥96,000</td></tr>
                      <tr><td>S002</td><td>サンプル 花子</td><td>¥1,100</td><td>60h</td><td>¥66,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </ProGate>
            </div>

            {/* レシートOCR（Pro限定） */}
            <div className="dash-section">
              <h2>レシートOCR <span style={{fontSize:11,color:"#999",fontWeight:400,marginLeft:6}}>近日公開</span></h2>
              <ProGate plan={plan} feature="レシートOCR" onUpgrade={setUpgradeFeature}>
                <div style={{padding:"24px",textAlign:"center",color:"var(--c-muted)",fontSize:14}}>
                  <p>レシートの写真をアップロードするだけで経費を自動記録します。</p>
                  <button className="btn btn-ghost" disabled style={{marginTop:8}}>レシートをアップロード</button>
                </div>
              </ProGate>
            </div>

            {/* 年間レポートPDF（Pro限定） */}
            <div className="dash-section">
              <h2>年間レポートPDF</h2>
              <ProGate plan={plan} feature="年間レポートPDF" onUpgrade={setUpgradeFeature}>
                <div style={{padding:"24px",textAlign:"center",color:"var(--c-muted)",fontSize:14}}>
                  <p>1年間の売上・経費・粗利をPDFでまとめて出力します。確定申告の準備に。</p>
                  <button className="btn btn-ghost" disabled style={{marginTop:8}}>年間レポートを出力</button>
                </div>
              </ProGate>
            </div>

            <div style={{textAlign:"center",marginTop:32}}>
              <button onClick={() => fetchData(savedSheetId)} className="btn btn-ghost">データを更新</button>
            </div>
          </>
        )}
      </div>

      {upgradeFeature && (
        <UpgradeModal
          feature={upgradeFeature}
          onClose={() => setUpgradeFeature(null)}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
        />
      )}
    </div>
  )
}
