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
  summary: Summary
  alerts: Alert[]
  clients: Record<string, string>[]
  invoices: Record<string, string>[]
  payments: Record<string, string>[]
  expenses: Record<string, string>[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [sheetId, setSheetId] = useState("")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedSheetId, setSavedSheetId] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("sorobako_sheet_id")
    if (saved) {
      setSheetId(saved)
      setSavedSheetId(saved)
    }
  }, [])

  useEffect(() => {
    if (savedSheetId && session) {
      fetchData(savedSheetId)
    }
  }, [savedSheetId, session])

  const fetchData = async (id: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/sheets?id=${encodeURIComponent(id)}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "データの取得に失敗しました")
      }
      const json = await res.json()
      setData(json)
      localStorage.setItem("sorobako_sheet_id", id)
      setSavedSheetId(id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // 未ログイン
  if (status === "loading") {
    return <div className="dash-loading">読み込み中...</div>
  }

  if (!session) {
    return (
      <div className="dash-login">
        <div className="dash-login-card">
          <div className="logo"><div className="logo-mark">S</div>ソロバコ</div>
          <h1>ダッシュボード</h1>
          <p>Googleアカウントでログインして、<br/>スプレッドシートのデータを表示します。</p>
          <button onClick={() => signIn("google")} className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>
            Googleでログイン
          </button>
          <a href="/" className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}}>トップに戻る</a>
        </div>
      </div>
    )
  }

  // ログイン済み・シートID未設定
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
          >
            接続する
          </button>
          {error && <div className="dash-error">{error}</div>}
          <button onClick={() => signOut()} className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}}>
            ログアウト
          </button>
        </div>
      </div>
    )
  }

  // ダッシュボード本体
  return (
    <div className="dash-container">
      <nav className="dash-nav">
        <div className="wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="/" className="logo" style={{textDecoration:"none",color:"var(--c-text)"}}>
            <div className="logo-mark">S</div>ソロバコ
          </a>
          <div style={{display:"flex",alignItems:"center",gap:12,fontSize:13}}>
            <span style={{color:"var(--c-muted)"}}>{session.user?.email}</span>
            <button onClick={() => { localStorage.removeItem("sorobako_sheet_id"); setSavedSheetId(""); setData(null) }} style={{background:"none",border:"none",color:"var(--c-accent)",cursor:"pointer",fontSize:13}}>
              シート変更
            </button>
            <button onClick={() => signOut()} style={{background:"none",border:"none",color:"var(--c-muted)",cursor:"pointer",fontSize:13}}>
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      <div className="wrap" style={{paddingTop:24,paddingBottom:60}}>
        {loading && <div className="dash-loading">データを読み込み中...</div>}

        {error && <div className="dash-error">{error}<button onClick={() => fetchData(savedSheetId)} className="btn btn-ghost" style={{marginLeft:12,padding:"4px 12px",fontSize:12}}>再試行</button></div>}

        {data && (
          <>
            {/* アラート */}
            {data.alerts.length > 0 && (
              <div className="dash-alerts">
                <h3>⚠️ {data.alerts.length}件のアラート</h3>
                {data.alerts.map((alert, i) => (
                  <div key={i} className={`dash-alert-item ${alert.severity}`}>
                    <span className="dash-alert-badge">{alert.type === "unpaid" ? "未入金" : "支払い超過"}</span>
                    {alert.message}
                  </div>
                ))}
              </div>
            )}

            {/* サマリーカード */}
            <div className="dash-metrics">
              <div className="dash-metric-card">
                <div className="dash-metric-label">売上</div>
                <div className="dash-metric-value">¥{data.summary.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="dash-metric-card">
                <div className="dash-metric-label">経費・支払い</div>
                <div className="dash-metric-value expense">¥{data.summary.totalExpenses.toLocaleString()}</div>
              </div>
              <div className="dash-metric-card">
                <div className="dash-metric-label">粗利</div>
                <div className="dash-metric-value profit">¥{data.summary.grossProfit.toLocaleString()}</div>
              </div>
            </div>

            {/* 統計 */}
            <div className="dash-stats">
              <div className="dash-stat">取引先: <strong>{data.summary.clientCount}社</strong></div>
              <div className="dash-stat">請求書: <strong>{data.summary.invoiceCount}件</strong></div>
              <div className="dash-stat">スタッフ: <strong>{data.summary.staffCount}名</strong></div>
            </div>

            {/* 請求書一覧 */}
            <div className="dash-section">
              <h2>請求書一覧</h2>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>請求書No</th>
                      <th>取引先</th>
                      <th>件名</th>
                      <th>合計</th>
                      <th>ステータス</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((inv, i) => (
                      <tr key={i}>
                        <td>{inv["請求書No"]}</td>
                        <td>{inv["取引先名"]}</td>
                        <td>{inv["件名"]}</td>
                        <td style={{textAlign:"right"}}>{inv["合計（税込）"]}</td>
                        <td><span className={`status-badge ${inv["ステータス"] === "入金済" ? "paid" : "unpaid"}`}>{inv["ステータス"]}</span></td>
                        <td>
                          <a
                            href={`/api/pdf/invoice?invoiceNo=${encodeURIComponent(inv["請求書No"])}&sheetId=${encodeURIComponent(savedSheetId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost"
                            style={{padding:"3px 10px",fontSize:12,whiteSpace:"nowrap"}}
                          >
                            PDF発行
                          </a>
                        </td>
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
                    <tr>
                      <th>ID</th>
                      <th>取引先名</th>
                      <th>区分</th>
                      <th>担当者</th>
                      <th>締め日</th>
                    </tr>
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

            {/* 更新ボタン */}
            <div style={{textAlign:"center",marginTop:32}}>
              <button onClick={() => fetchData(savedSheetId)} className="btn btn-ghost">
                データを更新
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
