"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"

const SHEET_COPY_URL = "https://docs.google.com/spreadsheets/d/1AtiPKSBVYRa8tJKTEEykJgM1yDwiPEDXWfZfuW-ahZw/copy"
const MONTHLY_PRICE_ID = "price_1THkDnAZHuZy9Zn0GZQWc7eV"
const YEARLY_PRICE_ID  = "price_1THkFOAZHuZy9Zn0tTC79s8y"

type Alert = { type: string; severity: string; message: string }
type Summary = { totalRevenue: number; totalExpenses: number; grossProfit: number; clientCount: number; invoiceCount: number; staffCount: number; totalPayroll: number }
type DashboardData = {
  plan: "free" | "pro"
  summary: Summary
  alerts: Alert[]
  clients: Record<string, string>[]
  invoices: Record<string, string>[]
  payments: Record<string, string>[]
  expenses: Record<string, string>[]
}

// ---- helpers ----
function isCurrentMonth(dateStr: string) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

// ---- ステップインジケーター ----
function StepIndicator({ current }: { current: number }) {
  const steps = ["テンプレート準備", "スプシ接続", "完了"]
  return (
    <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={i} style={{display:"flex",alignItems:"center",flex: i < steps.length - 1 ? 1 : "none"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{
                width:32,height:32,borderRadius:"50%",
                background: done || active ? "var(--c-accent)" : "#e5e7eb",
                color: done || active ? "#fff" : "#9ca3af",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,fontWeight:700,flexShrink:0,
              }}>
                {done ? "✓" : num}
              </div>
              <span style={{fontSize:10,color: active ? "var(--c-accent)" : "#9ca3af",fontWeight: active ? 700 : 400,whiteSpace:"nowrap"}}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{flex:1,height:2,background: done ? "var(--c-accent)" : "#e5e7eb",margin:"0 6px",marginBottom:16}} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- オンボーディングウィザード ----
function Onboarding({
  step,
  sheetId,
  setSheetId,
  onNext,
  onConnect,
  onOpen,
  onSignOut,
  loading,
  error,
}: {
  step: 1 | 2 | 3
  sheetId: string
  setSheetId: (v: string) => void
  onNext: () => void
  onConnect: () => void
  onOpen: () => void
  onSignOut: () => void
  loading: boolean
  error: string
}) {
  return (
    <div className="dash-login">
      <div className="dash-login-card" style={{maxWidth:460,padding:"36px 32px"}}>
        {/* ロゴ */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
          <img src="/logo.svg" alt="ソロバコ" height="44" />
        </div>

        <StepIndicator current={step} />

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:8,textAlign:"center"}}>テンプレートを準備しよう</h2>
            <p style={{fontSize:13,color:"var(--c-sub)",marginBottom:24,textAlign:"center",lineHeight:1.7}}>
              ソロバコ専用のGoogleスプレッドシートをあなたのアカウントにコピーします。
            </p>
            <a
              href={SHEET_COPY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{width:"100%",justifyContent:"center",marginBottom:12,textDecoration:"none"}}
            >
              テンプレートをコピーする ↗
            </a>
            <button
              onClick={onNext}
              className="btn btn-ghost"
              style={{width:"100%",justifyContent:"center",marginBottom:20}}
            >
              コピーできたら次へ →
            </button>
            <p style={{fontSize:12,color:"var(--c-muted)",textAlign:"center"}}>
              ※ Googleアカウントにスプシのコピーが作成されます
            </p>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:8,textAlign:"center"}}>スプレッドシートを接続</h2>
            <p style={{fontSize:13,color:"var(--c-sub)",marginBottom:20,textAlign:"center",lineHeight:1.7}}>
              コピーしたスプシを開き、ブラウザのURLをここに貼り付けてください。
            </p>
            <div style={{background:"var(--c-accent-light)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:"var(--c-accent-dark)",lineHeight:1.8}}>
              例: <code style={{fontSize:11,wordBreak:"break-all"}}>https://docs.google.com/spreadsheets/d/＜ID＞/edit</code>
            </div>
            <input
              type="text"
              value={sheetId}
              onChange={e => setSheetId(e.target.value)}
              placeholder="スプレッドシートのURLを貼り付け"
              className="dash-input"
              style={{marginBottom:12}}
            />
            {error && <div className="dash-error" style={{marginBottom:12}}>{error}</div>}
            <button
              onClick={onConnect}
              disabled={!sheetId.trim() || loading}
              className="btn btn-primary"
              style={{width:"100%",justifyContent:"center",marginBottom:8,opacity:loading?0.7:1}}
            >
              {loading ? "接続中..." : "接続する"}
            </button>
            <p style={{fontSize:12,color:"var(--c-muted)",textAlign:"center",marginBottom:16}}>
              すでにスプシをお持ちの方もここにURLを入力してください
            </p>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:52,marginBottom:8}}>🎉</div>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:8}}>接続完了！</h2>
              <p style={{fontSize:13,color:"var(--c-sub)",lineHeight:1.7}}>
                スプレッドシートとの接続が完了しました。<br/>
                ダッシュボードで売上・アラートを確認しましょう。
              </p>
            </div>
            <button
              onClick={onOpen}
              className="btn btn-primary"
              style={{width:"100%",justifyContent:"center",marginBottom:8}}
            >
              ダッシュボードを開く →
            </button>
          </>
        )}

        <button
          onClick={onSignOut}
          style={{background:"none",border:"none",color:"var(--c-muted)",cursor:"pointer",fontSize:12,width:"100%",textAlign:"center",paddingTop:8}}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}

// ---- UpgradeModal ----
function UpgradeModal({ feature, onClose, onCheckout, checkoutLoading }: {
  feature: string; onClose: () => void; onCheckout: (isYearly: boolean) => void; checkoutLoading: boolean
}) {
  const [isYearly, setIsYearly] = useState(false)
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,padding:32,maxWidth:420,width:"92%"}} onClick={e => e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:8}}>🔒</div>
          <h2 style={{fontSize:18,marginBottom:4}}>Proプランで{feature}を解放</h2>
          <p style={{color:"#666",fontSize:13,lineHeight:1.6}}>アラート・スタッフ管理・年間レポートなど全機能が使えます。</p>
        </div>
        <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,padding:3,marginBottom:20,gap:3}}>
          <button onClick={() => setIsYearly(false)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:!isYearly?"#fff":"transparent",color:!isYearly?"var(--c-text)":"#888",boxShadow:!isYearly?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>月払い</button>
          <button onClick={() => setIsYearly(true)} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:isYearly?"#fff":"transparent",color:isYearly?"var(--c-text)":"#888",boxShadow:isYearly?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            年払い <span style={{background:"#d1fae5",color:"#065f46",fontSize:10,padding:"1px 6px",borderRadius:99,fontWeight:700}}>2ヶ月おトク</span>
          </button>
        </div>
        <div style={{textAlign:"center",marginBottom:20,padding:"16px 0",borderTop:"1px solid #f3f4f6",borderBottom:"1px solid #f3f4f6"}}>
          {isYearly ? (
            <><div style={{fontSize:32,fontWeight:700}}>¥14,800<span style={{fontSize:14,fontWeight:400,color:"#888"}}>/年</span></div><div style={{fontSize:12,color:"#666",marginTop:4}}>月あたり¥1,233（税別）</div></>
          ) : (
            <><div style={{fontSize:32,fontWeight:700}}>¥1,480<span style={{fontSize:14,fontWeight:400,color:"#888"}}>/月</span></div><div style={{fontSize:12,color:"#666",marginTop:4}}>税込¥1,628 / いつでも解約可能</div></>
          )}
        </div>
        <button onClick={() => onCheckout(isYearly)} disabled={checkoutLoading} className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:10,opacity:checkoutLoading?0.7:1}}>
          {checkoutLoading ? "処理中..." : `今すぐ${isYearly?"年額":"月額"}プランにアップグレード →`}
        </button>
        <button onClick={onClose} className="btn btn-ghost" style={{width:"100%",justifyContent:"center"}}>キャンセル</button>
      </div>
    </div>
  )
}

// ---- ProGate ----
function ProGate({ plan, feature, onUpgrade, children }: { plan: "free"|"pro"; feature: string; onUpgrade: (f: string) => void; children: React.ReactNode }) {
  if (plan === "pro") return <>{children}</>
  return (
    <div style={{position:"relative",borderRadius:8,overflow:"hidden"}}>
      <div style={{filter:"blur(4px)",pointerEvents:"none",userSelect:"none",opacity:0.55}}>{children}</div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.78)"}}>
        <span style={{fontSize:28,marginBottom:8}}>🔒</span>
        <p style={{fontWeight:600,marginBottom:12,fontSize:14}}>{feature}はPro限定機能です</p>
        <button onClick={() => onUpgrade(feature)} className="btn btn-primary" style={{padding:"6px 20px",fontSize:13}}>Proにアップグレード</button>
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

// ================================================================
// Main
// ================================================================
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [sheetId, setSheetId]           = useState("")
  const [savedSheetId, setSavedSheetId] = useState("")
  const [data, setData]                 = useState<DashboardData | null>(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState("")
  const [onboardingStep, setOnboardingStep] = useState<0 | 1 | 2 | 3>(0)
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [syncMessage, setSyncMessage]   = useState("")
  const [portalLoading, setPortalLoading] = useState(false)

  // localStorageからシートID復元
  useEffect(() => {
    const saved = localStorage.getItem("sorobako_sheet_id")
    if (saved) {
      setSheetId(saved)
      setSavedSheetId(saved)
      setOnboardingStep(0) // 2回目以降はウィザードをスキップ
    } else {
      setOnboardingStep(1) // 初回はウィザードから
    }
  }, [])

  // セッションとシートIDが揃ったらデータ取得
  useEffect(() => {
    if (savedSheetId && session) fetchData(savedSheetId)
  }, [savedSheetId, session])

  // ?upgrade=true → データ読込後にアップグレードモーダルを表示
  useEffect(() => {
    if (!data) return
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("upgrade") === "true") {
      setUpgradeFeature("全機能")
      window.history.replaceState({}, "", "/dashboard")
    }
  }, [data])

  // ?upgraded=true → 決済完了後の処理
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
        window.history.replaceState({}, "", "/dashboard")
        if (sid) fetchData(sid)
      })
      .catch(() => setSyncMessage(""))
  }, [])

  // ----------------------------------------------------------------
  const fetchData = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/sheets?id=${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error((await res.json()).error || "データの取得に失敗しました")
      setData(await res.json())
      localStorage.setItem("sorobako_sheet_id", id)
      setSavedSheetId(id)
      return true
    } catch (e: any) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    let id = sheetId.trim()
    const match = id.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) id = match[1]
    if (!id) return
    const ok = await fetchData(id)
    if (ok) setOnboardingStep(3)
  }

  const handleCheckout = async (isYearly: boolean) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: isYearly ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID, sheetId: savedSheetId }),
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

  // ================================================================
  // Render
  // ================================================================

  if (status === "loading") return <div className="dash-loading">読み込み中...</div>

  if (!session) {
    return (
      <div className="dash-login">
        <div className="dash-login-card">
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><img src="/logo.svg" alt="ソロバコ" height="44" /></div>
          <h1 style={{marginBottom:8}}>ダッシュボード</h1>
          <p style={{marginBottom:24}}>Googleアカウントでログインして、<br/>スプレッドシートのデータを表示します。</p>
          <button onClick={() => signIn("google")} className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Googleでログイン</button>
          <a href="/" className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:8,textDecoration:"none"}}>トップに戻る</a>
        </div>
      </div>
    )
  }

  // オンボーディングウィザード（初回 or スプシ未接続）
  if (onboardingStep > 0) {
    return (
      <Onboarding
        step={onboardingStep as 1 | 2 | 3}
        sheetId={sheetId}
        setSheetId={setSheetId}
        onNext={() => setOnboardingStep(2)}
        onConnect={handleConnect}
        onOpen={() => setOnboardingStep(0)}
        onSignOut={() => signOut()}
        loading={loading}
        error={error}
      />
    )
  }

  // ================================================================
  // ダッシュボード本体
  // ================================================================
  const plan    = data?.plan ?? "free"
  const isFree  = plan === "free"
  const FREE_LIMIT = 3

  // 財務インサイト計算
  const totalRevenueFI  = data?.summary.totalRevenue ?? 0
  const grossProfitFI   = data?.summary.grossProfit ?? 0
  const totalPayrollFI  = data?.summary.totalPayroll ?? 0
  const consumptionTax  = Math.floor(totalRevenueFI * 10 / 110)
  const incomeTaxEst    = Math.floor(grossProfitFI * 0.15)
  const netAvailable    = totalRevenueFI - consumptionTax - Math.max(incomeTaxEst, 0)
  const laborRatio      = totalRevenueFI > 0 ? Math.round(totalPayrollFI / totalRevenueFI * 100) : 0
  const laborColor      = laborRatio >= 50 ? "#dc2626" : laborRatio >= 30 ? "#16a34a" : "#555"
  const laborBg         = laborRatio >= 50 ? "#fef2f2" : laborRatio >= 30 ? "#f0fdf4" : "#f9fafb"
  const laborBorder     = laborRatio >= 50 ? "#fecaca" : laborRatio >= 30 ? "#bbf7d0" : "#e5e7eb"

  const allInvoices       = data?.invoices ?? []
  const allExpenses       = data?.expenses ?? []
  const thisMonthInvoices = allInvoices.filter(inv => isCurrentMonth(inv["発行日"]))
  const thisMonthExpenses = allExpenses.filter(exp => isCurrentMonth(exp["日付"] || ""))
  const visibleInvoices   = isFree ? thisMonthInvoices.slice(0, FREE_LIMIT) : allInvoices
  const visibleExpenses   = isFree ? thisMonthExpenses.slice(0, FREE_LIMIT) : allExpenses
  const invoiceOver       = isFree && thisMonthInvoices.length > FREE_LIMIT
  const expenseOver       = isFree && thisMonthExpenses.length > FREE_LIMIT

  return (
    <div className="dash-container">
      <nav className="dash-nav">
        <div className="wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <img src="/favicon.svg" alt="" height="32" /><span style={{fontWeight:500,color:"#1a1a1a"}}>ソロバコ</span>
          </a>
          <div style={{display:"flex",alignItems:"center",gap:12,fontSize:13}}>
            <span style={{background:isFree?"#f3f4f6":"var(--c-accent)",color:isFree?"#555":"#fff",fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:99}}>
              {isFree ? "無料プラン" : "✓ Pro"}
            </span>
            <span style={{color:"var(--c-muted)"}}>{session.user?.email}</span>
            {!isFree && (
              <button onClick={handlePortal} disabled={portalLoading} style={{background:"none",border:"none",color:"var(--c-accent)",cursor:"pointer",fontSize:13}}>
                {portalLoading ? "..." : "プラン管理"}
              </button>
            )}
            <button
              onClick={() => { localStorage.removeItem("sorobako_sheet_id"); setSavedSheetId(""); setData(null); setOnboardingStep(1) }}
              style={{background:"none",border:"none",color:"var(--c-accent)",cursor:"pointer",fontSize:13}}
            >シート変更</button>
            <button onClick={() => signOut()} style={{background:"none",border:"none",color:"var(--c-muted)",cursor:"pointer",fontSize:13}}>ログアウト</button>
          </div>
        </div>
      </nav>

      <div className="wrap" style={{paddingTop:24,paddingBottom:60}}>
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
            {isFree && (
              <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:8,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <span style={{fontSize:13,color:"#92400e"}}>🔓 <strong>無料プラン</strong> — 今月分・月3件まで表示。アラート等のPro機能はロックされています。</span>
                <button onClick={() => setUpgradeFeature("全機能")} className="btn btn-primary" style={{padding:"4px 14px",fontSize:12,flexShrink:0}}>Proにアップグレード</button>
              </div>
            )}

            {/* アラート（Pro限定） */}
            <ProGate plan={plan} feature="アラート" onUpgrade={setUpgradeFeature}>
              <div className="dash-alerts">
                {data.alerts.length > 0 ? (
                  <><h3>⚠️ {data.alerts.length}件のアラート</h3>{data.alerts.map((a, i) => (
                    <div key={i} className={`dash-alert-item ${a.severity}`}>
                      <span className="dash-alert-badge">{a.type === "unpaid" ? "未入金" : "支払い超過"}</span>{a.message}
                    </div>
                  ))}</>
                ) : (
                  <p style={{color:"var(--c-muted)",fontSize:14,margin:0}}>✅ 現在アラートはありません</p>
                )}
              </div>
            </ProGate>

            {/* サマリー */}
            <div className="dash-metrics">
              {[
                { label:`売上${isFree?"（今月）":""}`, value:`¥${data.summary.totalRevenue.toLocaleString()}`, cls:"" },
                { label:`経費・支払い${isFree?"（今月）":""}`, value:`¥${data.summary.totalExpenses.toLocaleString()}`, cls:"expense" },
                { label:`粗利${isFree?"（今月）":""}`, value:`¥${data.summary.grossProfit.toLocaleString()}`, cls:"profit" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="dash-metric-card">
                  <div className="dash-metric-label">{label}</div>
                  <div className={`dash-metric-value ${cls}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* 前月比（Pro限定） */}
            <ProGate plan={plan} feature="前月比・前年比レポート" onUpgrade={setUpgradeFeature}>
              <div className="dash-metrics">
                <div className="dash-metric-card"><div className="dash-metric-label">前月比</div><div className="dash-metric-value" style={{color:"var(--c-accent)"}}>＋12.4%</div></div>
                <div className="dash-metric-card"><div className="dash-metric-label">前年比</div><div className="dash-metric-value" style={{color:"var(--c-accent)"}}>＋34.2%</div></div>
                <div className="dash-metric-card"><div className="dash-metric-label">年間予測売上</div><div className="dash-metric-value">¥2,400,000</div></div>
              </div>
            </ProGate>

            <div className="dash-stats">
              <div className="dash-stat">取引先: <strong>{data.summary.clientCount}社</strong></div>
              <div className="dash-stat">請求書: <strong>{data.summary.invoiceCount}件</strong></div>
              <div className="dash-stat">スタッフ: <strong>{data.summary.staffCount}名</strong></div>
            </div>

            {/* 財務インサイト（Pro限定） */}
            <div className="dash-section">
              <h2>財務インサイト</h2>
              <ProGate plan={plan} feature="財務インサイト" onUpgrade={setUpgradeFeature}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
                  {/* 納税準備金シミュレーション */}
                  <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:12,padding:20}}>
                    <div style={{fontSize:12,color:"#92400e",fontWeight:700,marginBottom:14}}>💰 納税準備金シミュレーション</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:13}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{color:"var(--c-sub)"}}>売上（税込）</span>
                        <span style={{fontWeight:600}}>¥{totalRevenueFI.toLocaleString()}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",color:"#b45309"}}>
                        <span>消費税概算（10%）</span>
                        <span style={{fontWeight:600}}>−¥{consumptionTax.toLocaleString()}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",color:"#b45309"}}>
                        <span>所得税概算（粗利×15%）</span>
                        <span style={{fontWeight:600}}>−¥{Math.max(incomeTaxEst,0).toLocaleString()}</span>
                      </div>
                      <div style={{borderTop:"1px solid #fcd34d",paddingTop:10,marginTop:4}}>
                        <div style={{fontSize:11,color:"var(--c-muted)",marginBottom:4}}>実質手元資金（概算）</div>
                        <div style={{fontSize:26,fontWeight:800,color:"#92400e"}}>¥{netAvailable.toLocaleString()}</div>
                      </div>
                    </div>
                    <p style={{fontSize:11,color:"var(--c-muted)",marginTop:10,lineHeight:1.6}}>※ 概算値です。正確な税額は税理士にご相談ください。</p>
                  </div>
                  {/* 労働分配率 */}
                  <div style={{background:laborBg,border:`1px solid ${laborBorder}`,borderRadius:12,padding:20}}>
                    <div style={{fontSize:12,color:laborColor,fontWeight:700,marginBottom:14}}>👥 労働分配率</div>
                    <div style={{fontSize:36,fontWeight:800,color:laborColor,lineHeight:1}}>
                      {totalPayrollFI === 0 ? "—" : `${laborRatio}`}
                      {totalPayrollFI > 0 && <span style={{fontSize:20}}>%</span>}
                    </div>
                    <div style={{height:8,background:"#e5e7eb",borderRadius:99,margin:"12px 0 8px",overflow:"hidden"}}>
                      <div style={{width:`${Math.min(laborRatio,100)}%`,height:"100%",background:laborColor,borderRadius:99}} />
                    </div>
                    <div style={{fontSize:13,color:laborColor,fontWeight:600,marginBottom:8}}>
                      {totalPayrollFI === 0 ? "給与データがありません" : laborRatio >= 50 ? "⚠️ 人件費が売上の半分を超えています" : laborRatio >= 30 ? "✅ 標準的な水準です（目安: 30〜50%）" : "📊 低い水準です（目安: 30〜50%）"}
                    </div>
                    <p style={{fontSize:11,color:"var(--c-muted)",lineHeight:1.6}}>給与シートの総支給額 ÷ 売上 × 100</p>
                  </div>
                </div>
              </ProGate>
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
                  <thead><tr><th>請求書No</th><th>取引先</th><th>件名</th><th>合計</th><th>ステータス</th><th></th></tr></thead>
                  <tbody>
                    {visibleInvoices.map((inv, i) => (
                      <tr key={i}>
                        <td>{inv["請求書No"]}</td><td>{inv["取引先名"]}</td><td>{inv["件名"]}</td>
                        <td style={{textAlign:"right"}}>{inv["合計（税込）"]}</td>
                        <td><span className={`status-badge ${inv["ステータス"]==="入金済"?"paid":"unpaid"}`}>{inv["ステータス"]}</span></td>
                        <td>
                          <a href={`/api/pdf/invoice?invoiceNo=${encodeURIComponent(inv["請求書No"])}&sheetId=${encodeURIComponent(savedSheetId)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{padding:"3px 10px",fontSize:12,whiteSpace:"nowrap"}}>PDF発行</a>
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
                  <span>今月の経費が{FREE_LIMIT}件を超えています。</span>
                  <button onClick={() => setUpgradeFeature("経費の全件表示")} className="btn btn-primary" style={{padding:"3px 12px",fontSize:12,flexShrink:0}}>アップグレード</button>
                </div>
              )}
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>日付</th><th>カテゴリ</th><th>内容</th><th>金額（税込）</th></tr></thead>
                  <tbody>
                    {visibleExpenses.map((exp, i) => (
                      <tr key={i}><td>{exp["日付"]}</td><td>{exp["カテゴリ"]}</td><td>{exp["内容"]}</td><td style={{textAlign:"right"}}>{exp["金額（税込）"]}</td></tr>
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
                  <thead><tr><th>ID</th><th>取引先名</th><th>区分</th><th>担当者</th><th>締め日</th></tr></thead>
                  <tbody>
                    {data.clients.map((c, i) => (
                      <tr key={i}><td>{c["取引先ID"]}</td><td>{c["取引先名"]}</td><td>{c["区分"]}</td><td>{c["担当者名"]}</td><td>{c["締め日"]}</td></tr>
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
                  <p>1年間の売上・経費・粗利をPDFでまとめて出力します。</p>
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
        <UpgradeModal feature={upgradeFeature} onClose={() => setUpgradeFeature(null)} onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />
      )}
    </div>
  )
}
