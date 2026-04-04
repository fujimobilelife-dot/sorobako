import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "開業届・青色申告の出し方ガイド | ソロバコ",
  description: "個人事業主の開業届の書き方・提出方法から青色申告の申請まで初めてでもわかるステップ形式で解説。",
  alternates: { canonical: "https://sorobako.app/guide/kaigyou" },
}

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1AtiPKSBVYRa8tJKTEEykJgM1yDwiPEDXWfZfuW-ahZw/copy"

export default function KaigyouGuidePage() {
  return (
    <>
      <nav>
        <div className="wrap">
          <div className="logo">
            <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
              <img src="/favicon.svg" alt="" height="32" />
              <span style={{fontWeight:500,color:"#1a1a1a"}}>ソロバコ</span>
            </a>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20,fontSize:14}}>
            <a href="/" style={{color:"var(--c-sub)"}}>トップ</a>
            <a href="/guide" style={{color:"var(--c-sub)"}}>使い方ガイド</a>
            <a href="/#pricing" style={{color:"var(--c-sub)"}}>料金</a>
            <a href="/dashboard" className="cta-sm">無料で始める</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="guide-hero">
        <div className="wrap">
          <h1>開業届・青色申告の出し方ガイド</h1>
          <p className="lead">初めてでも大丈夫。<strong>3つのステップ</strong>で開業の手続きを完了させましょう。</p>
        </div>
      </section>

      {/* ===== 概要バナー ===== */}
      <section className="guide-section" style={{paddingTop:40,paddingBottom:40,background:"var(--c-accent-light)"}}>
        <div className="wrap">
          <div style={{maxWidth:700,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
            <div style={{background:"#fff",borderRadius:10,padding:"16px 20px",border:"1px solid var(--c-border)",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>📋</div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--c-text)",marginBottom:2}}>開業届の提出期限</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--c-accent)"}}>事業開始から1ヶ月以内</div>
            </div>
            <div style={{background:"#fff",borderRadius:10,padding:"16px 20px",border:"1px solid var(--c-border)",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>📝</div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--c-text)",marginBottom:2}}>青色申告申請の期限</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--c-accent)"}}>開業から2ヶ月以内</div>
            </div>
            <div style={{background:"#fff",borderRadius:10,padding:"16px 20px",border:"1px solid var(--c-border)",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>💰</div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--c-text)",marginBottom:2}}>青色申告の節税メリット</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--c-accent)"}}>最大65万円控除</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEP 1: 開業届 ===== */}
      <section className="guide-section" id="kaigyou">
        <div className="wrap">
          <h2 className="section-title">Step 1｜開業届を提出する</h2>

          <div className="steps">

            <div className="step-card">
              <div className="step-num" style={{background:"var(--c-accent)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>開業届とは</h2>
                <p>
                  正式名称は<strong>「個人事業の開業・廃業等届出書」</strong>。
                  新たに事業を始めた際に税務署へ提出する書類です。
                  提出することで社会的な「事業者」として認められ、屋号での銀行口座開設や各種控除の申請が可能になります。
                </p>
                <div className="tip-box">
                  <div className="tip-label">基本情報</div>
                  <ul>
                    <li><strong>提出先</strong> → 住所地（または事業所）を管轄する税務署</li>
                    <li><strong>提出期限</strong> → 事業開始日から<strong>1ヶ月以内</strong>（過ぎても罰則なし）</li>
                    <li><strong>提出方法</strong> → 税務署窓口 / 郵送 / e-Tax（電子申告）</li>
                    <li><strong>費用</strong> → 無料</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num" style={{background:"var(--c-accent)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>必要なものを準備する</h2>
                <p>事前に以下を揃えておくとスムーズです。</p>
                <div className="tip-box">
                  <div className="tip-label">必要なもの</div>
                  <ul>
                    <li><strong>マイナンバー</strong>（個人番号）の確認書類</li>
                    <li><strong>本人確認書類</strong>（運転免許証・パスポート等）</li>
                    <li><strong>印鑑</strong>（認印でOK。e-Taxなら不要）</li>
                    <li>開業届の様式（国税庁ウェブサイトまたは税務署窓口で入手）</li>
                  </ul>
                </div>
                <div className="highlight-box">💡 e-Taxを使うとマイナンバーカードがあれば自宅から提出完了。控えのPDFもその場で保存できます。</div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num" style={{background:"var(--c-accent)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>書き方のポイント</h2>
                <p>書き方で迷いやすい3つの項目を解説します。</p>
                <div className="tip-box">
                  <div className="tip-label">屋号（任意）</div>
                  <p>個人の名前ではなく事業名として使いたい名称を記入します。例: 「デザインスタジオ田中」「山田コンサルティング事務所」など。空欄のままでも構いません。後から変更も可能です。</p>
                </div>
                <div className="tip-box" style={{marginTop:8}}>
                  <div className="tip-label">事業の概要</div>
                  <p>職種・業種を具体的に記入します。例: 「Webデザイン・制作業」「フリーランスエンジニア（システム開発）」「ライター・編集業」など。</p>
                </div>
                <div className="tip-box" style={{marginTop:8}}>
                  <div className="tip-label">開業日</div>
                  <p>最初に売上が発生した日や、仕事を始めた日を記入します。過去にさかのぼって記入してもOKです（直近1〜2年以内が目安）。</p>
                </div>
                <div className="warn-box" style={{marginTop:12}}>⚠️ 提出時に税務署印を押してもらった控えは大切に保管してください。各種申請で必要になることがあります。</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STEP 2: 青色申告 ===== */}
      <section className="guide-section alt" id="aoiro">
        <div className="wrap">
          <h2 className="section-title">Step 2｜青色申告を申請する</h2>

          <div className="steps">

            <div className="step-card">
              <div className="step-num" style={{background:"#16a34a"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>白色申告との違い</h2>
                <p>確定申告には<strong>白色申告</strong>と<strong>青色申告</strong>があります。手間はかかりますが、青色申告には大きな節税メリットがあります。</p>
                <div style={{overflowX:"auto",marginTop:12}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                    <thead>
                      <tr style={{background:"var(--c-bg)"}}>
                        <th style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"left",fontWeight:700}}></th>
                        <th style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",fontWeight:700}}>白色申告</th>
                        <th style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",fontWeight:700,background:"#f0fdf4",color:"#16a34a"}}>青色申告</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",fontWeight:600}}>特別控除</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",color:"var(--c-muted)"}}>なし</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",background:"#f0fdf4",fontWeight:700,color:"#16a34a"}}>最大65万円控除</td>
                      </tr>
                      <tr>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",fontWeight:600}}>赤字の繰越</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",color:"var(--c-muted)"}}>不可</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",background:"#f0fdf4",fontWeight:700,color:"#16a34a"}}>3年間繰り越し可能</td>
                      </tr>
                      <tr>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",fontWeight:600}}>帳簿の種類</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center"}}>簡易帳簿でOK</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",background:"#f0fdf4"}}>複式簿記が必要（65万円控除の場合）</td>
                      </tr>
                      <tr>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",fontWeight:600}}>事前申請</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",color:"var(--c-muted)"}}>不要</td>
                        <td style={{padding:"10px 14px",border:"1px solid var(--c-border)",textAlign:"center",background:"#f0fdf4"}}>税務署への申請が必要</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="highlight-box" style={{marginTop:12}}>💡 年収300万円の事業者が65万円控除を受けると、所得税・住民税あわせて<strong>約10〜13万円</strong>の節税になります（税率による）。</div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num" style={{background:"#16a34a"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>申請のタイミングと方法</h2>
                <p>正式名称は<strong>「所得税の青色申告承認申請書」</strong>。開業届と同時に提出するのが最も効率的です。</p>
                <div className="tip-box">
                  <div className="tip-label">提出期限</div>
                  <ul>
                    <li>開業した年から青色申告を使いたい場合: <strong>開業日から2ヶ月以内</strong></li>
                    <li>1月1日〜1月15日に開業した場合: <strong>その年の3月15日まで</strong></li>
                    <li>翌年からでよい場合: <strong>前年の3月15日まで</strong></li>
                  </ul>
                </div>
                <div className="tip-box" style={{marginTop:8}}>
                  <div className="tip-label">提出方法</div>
                  <ul>
                    <li>税務署の窓口（開業届と一緒に提出するのが最も便利）</li>
                    <li>郵送（収受日付印付きの控えが必要なら返信用封筒を同封）</li>
                    <li>e-Tax（マイナンバーカードがあれば自宅からOK）</li>
                  </ul>
                </div>
                <div className="warn-box" style={{marginTop:12}}>⚠️ 申請を忘れると<strong>その年は白色申告しか使えません</strong>。開業届と同時に申請することを強くおすすめします。</div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num" style={{background:"#16a34a"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div className="step-content">
                <h2>65万円控除を受ける条件</h2>
                <p>青色申告特別控除（65万円）を受けるためには、以下の条件をすべて満たす必要があります。</p>
                <div className="tip-box">
                  <div className="tip-label">必要条件</div>
                  <ul>
                    <li><strong>複式簿記</strong>による帳簿付け（借方・貸方の記録）</li>
                    <li><strong>貸借対照表・損益計算書</strong>を確定申告書に添付</li>
                    <li><strong>e-Tax</strong>で申告 または <strong>電子帳簿保存</strong>を採用（2020年分以降）</li>
                    <li>申告期限内（3月15日まで）に申告</li>
                  </ul>
                </div>
                <div className="tip-box" style={{marginTop:8}}>
                  <div className="tip-label">10万円控除（簡易版）の場合</div>
                  <p>複式簿記が難しい方は<strong>簡易簿記</strong>でも10万円控除を受けられます。まずは10万円控除から始めて、慣れたら65万円控除に移行するのもOKです。</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STEP 3: ソロバコ連携 ===== */}
      <section className="guide-section" id="sorobako">
        <div className="wrap">
          <h2 className="section-title">Step 3｜ソロバコで日々の記録を始める</h2>
          <p style={{textAlign:"center",color:"var(--c-sub)",marginBottom:40,fontSize:15,lineHeight:1.9}}>
            開業届・青色申告の申請が完了したら、次は日々の経営を記録していきましょう。<br/>
            ソロバコのスプレッドシートで記録を続けることで、確定申告時にデータが自動で揃います。
          </p>
          <div className="staff-steps">

            <div className="staff-step">
              <div className="staff-step-label">A</div>
              <div>
                <h3>取引先・経費をスプシに記録</h3>
                <p>請求書を発行したら「請求書」シートへ、経費を使ったら「経費」シートへ。毎日少しずつ記録するだけで帳簿が完成します。</p>
              </div>
            </div>
            <div className="staff-arrow">↓</div>
            <div className="staff-step">
              <div className="staff-step-label">B</div>
              <div>
                <h3>ダッシュボードで売上・収支を確認</h3>
                <p>月次の売上・経費・粗利が自動集計されます。未入金アラートで請求漏れ・入金忘れも防げます。</p>
              </div>
            </div>
            <div className="staff-arrow">↓</div>
            <div className="staff-step">
              <div className="staff-step-label">C</div>
              <div>
                <h3>確定申告時にデータをエクスポート</h3>
                <p>年間の売上・経費データがスプシに揃っているので、freee・弥生などの会計ソフトへの入力がスムーズになります。</p>
              </div>
            </div>

          </div>
          <div className="highlight-box" style={{maxWidth:600,margin:"24px auto 0",textAlign:"center"}}>
            💡 ソロバコは会計ソフトではありませんが、日々のデータ整理ツールとして使うことで確定申告の準備がラクになります。
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <h2>さっそく記録を始めましょう</h2>
        <p>スプレッドシートのテンプレートを手に入れて、<br/>取引先・経費の管理をスタートしてみませんか？</p>
        <a href="/dashboard" className="btn btn-primary">ダッシュボードを無料で使う</a>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:16}}>Googleアカウントでログインするだけ。登録不要・秒で完了。</p>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-inner">
            <a href="/" className="footer-logo" style={{textDecoration:"none"}}>
              <img src="/favicon.svg" alt="" height="28" />
              <span>ソロバコ</span>
            </a>
            <div className="footer-links">
              <a href="/guide">使い方ガイド</a>
              <a href="/terms">利用規約</a>
              <a href="/privacy">プライバシーポリシー</a>
              <a href="/dashboard">ダッシュボード</a>
            </div>
          </div>
          <p className="footer-copy">&copy; 2026 ソロバコ</p>
        </div>
      </footer>
    </>
  )
}
