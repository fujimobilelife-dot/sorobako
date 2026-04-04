const SHEET_URL = "https://docs.google.com/spreadsheets/d/1AtiPKSBVYRa8tJKTEEykJgM1yDwiPEDXWfZfuW-ahZw/copy"

export default function Home() {
  return (
    <>
      <nav>
        <div className="wrap">
          <div className="logo">
            <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
              <img src="/favicon.svg" alt="" height="32" />
              <span style={{fontWeight:700,color:"#1a1a1a"}}>ソロバコ</span>
            </a>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20,fontSize:14}}>
            <a href="#features" style={{color:"var(--c-sub)"}}>機能</a>
            <a href="#pricing" style={{color:"var(--c-sub)"}}>料金</a>
            <a href="#faq" style={{color:"var(--c-sub)"}}>FAQ</a>
            <a href="/dashboard" className="cta-sm">ログイン / 無料で始める</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">個人事業主・フリーランスのための経営管理ツール</div>
          <h1>請求・入金・支払いの管理から<br/><em>解放される。</em></h1>
          <p className="lead">取引先管理から請求書発行、入金チェックまで。<br/>Googleスプレッドシートだけで完結する、個人事業主のためのバックオフィスツール。</p>
          <div className="cta-group">
            <a href="/dashboard" className="btn btn-primary">ダッシュボードを無料で使う</a>
            <a href="#features" className="btn btn-ghost">機能を見る</a>
          </div>
          <p className="note">Googleアカウントがあれば秒で始められます / アカウント登録不要</p>

          <div className="mockup-wrap">
            <div className="mockup-bar">
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
            </div>
            <div className="mockup-body">
              <div className="dash-header">
                <div className="dash-title">ダッシュボード</div>
                <div className="dash-period">2026年3月</div>
              </div>
              <div className="alert-banner">
                <div className="alert-icon">!</div>
                <span><strong>2件のアラート:</strong> A社への¥150,000が未入金（15日経過） / B社からの¥480,000の支払期限を超過</span>
              </div>
              <div className="metrics">
                <div className="metric-card">
                  <div className="metric-label">今月の売上</div>
                  <div className="metric-value">¥420,000</div>
                  <div className="metric-change up">前月比 +12% / 前年同月比 +28%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">今月の経費</div>
                  <div className="metric-value">¥135,000</div>
                  <div className="metric-change down">前月比 +5%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">今月の粗利</div>
                  <div className="metric-value" style={{color:"var(--c-accent)"}}>¥285,000</div>
                  <div className="metric-change up">前月比 +22%</div>
                </div>
              </div>
              <div className="ranking">
                <div className="ranking-title">取引先別 売上ランキング（年間累計）</div>
                <div className="ranking-row">
                  <div className="ranking-num">1</div>
                  <div className="ranking-name">株式会社テクノワークス</div>
                  <div className="ranking-amount">¥1,200,000</div>
                  <div className="ranking-bar"><div className="ranking-bar-fill" style={{width:"100%"}}></div></div>
                </div>
                <div className="ranking-row">
                  <div className="ranking-num">2</div>
                  <div className="ranking-name">デザインラボ合同会社</div>
                  <div className="ranking-amount">¥480,000</div>
                  <div className="ranking-bar"><div className="ranking-bar-fill" style={{width:"40%"}}></div></div>
                </div>
                <div className="ranking-row">
                  <div className="ranking-num">3</div>
                  <div className="ranking-name">山田コンサルティング</div>
                  <div className="ranking-amount">¥360,000</div>
                  <div className="ranking-bar"><div className="ranking-bar-fill" style={{width:"30%"}}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 商流可視化 ===== */}
      <section className="biz-flow fade-in">
        <div className="wrap">
          <span className="section-eyebrow">COVERAGE</span>
          <h2>お金が動く全行程を、もれなくカバー</h2>
          <p className="section-sub" style={{marginBottom:0}}>ソロバコは「請求」から「支払い・給与」まで、キャッシュが動く中核領域をカバーします。<br/>会計ソフトとの棲み分けも明確。二重管理は不要です。</p>
          <div className="flow-diagram">
            <div className="flow-track">
              <div className="flow-step">契約</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step">見積</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step">納品</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step is-sorobako">請求</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step is-sorobako">入金確認</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step is-sorobako">支払い・給与</div>
              <span className="flow-arrow">›</span>
              <div className="flow-step is-accounting">会計入力</div>
            </div>
            <div className="flow-legend">
              <div className="flow-legend-item sorobako">ソロバコがカバーする領域</div>
              <div className="flow-legend-item accounting">freeeなどの会計ソフトの領域</div>
            </div>
          </div>
          <p className="flow-note">ソロバコで整理したデータをfreee等に取り込めば、確定申告もスムーズです。</p>
        </div>
      </section>

      {/* ===== ターゲット ===== */}
      <section className="target fade-in" id="target">
        <div className="wrap">
          <h2>ひとりで経営するあなたの味方です</h2>
          <p className="target-intro">大企業には総務部があり、業務管理システムがあります。<br/><strong>でも、ひとりで事業をやるあなたには？</strong><br/>ソロバコは、経営者であるあなたの「見えない右腕」になります。</p>
          <div className="target-grid">
            <div className="target-card">
              <div className="target-icon" style={{background:"var(--c-accent-light)"}}>👤</div>
              <h3>ひとり社長・マイクロ法人</h3>
              <p>社員を雇わず自分で全部回す経営者。取引先管理も請求も支払いも、ひとりでこなすあなたに。</p>
            </div>
            <div className="target-card">
              <div className="target-icon" style={{background:"var(--c-warm)"}}>💻</div>
              <h3>フリーランス・個人事業主</h3>
              <p>エンジニア、デザイナー、ライター、コンサルタント。本業に集中したいのに事務作業に追われるあなたに。</p>
            </div>
            <div className="target-card">
              <div className="target-icon" style={{background:"#E6F1FB"}}>🚀</div>
              <h3>副業で開業したばかりの方</h3>
              <p>開業届を出したけど、何から始めればいいかわからない。経営の第一歩を踏み出すあなたに。</p>
            </div>
          </div>
          <div className="target-message">
            <p>大企業には総務部がある。<br/><strong>あなたには、ソロバコがある。</strong></p>
          </div>
        </div>
      </section>

      {/* ===== 機能 ===== */}
      <section className="features fade-in" id="features">
        <div className="wrap">
          <span className="section-eyebrow">FEATURES</span>
          <h2 className="section-h2">ソロバコでできること</h2>
          <p className="section-sub">会計ソフトではありません。取引先管理 + 請求書作成 + 支払い管理 + スタッフ管理を、ひとつにまとめたツールです。</p>
          <div className="feat-grid">

            <div className="feat-card">
              <div className="feat-icon" style={{background:"var(--c-accent-light)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"var(--c-accent-light)",color:"var(--c-accent-dark)"}}>取引先管理</div>
              <h3>取引先ごとの売上・支払いを一覧</h3>
              <p>どの取引先にいくら売って、いくら貰っているかがひと目でわかる。前月比・前年比・前年度比も自動計算。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"var(--c-alert-light)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-alert)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v4"/><circle cx="12" cy="16" r="1" fill="var(--c-alert)"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"var(--c-alert-light)",color:"var(--c-alert)"}}>お金を守る</div>
              <h3>3つのアラート</h3>
              <p>請求忘れ・未入金・支払い忘れを事前察知。お金の取りこぼしと信用問題を防ぎます。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"var(--c-warm)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A6040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"var(--c-warm)",color:"#7A6040"}}>書類作成</div>
              <h3>請求書をワンクリック発行</h3>
              <p>見積書・納品書・領収書もOK。発行と同時にスプレッドシートの売上台帳に自動記録。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"#E6F1FB"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"#E6F1FB",color:"#185FA5"}}>支払い管理</div>
              <h3>届いた請求書を記録</h3>
              <p>PDFや写真をドロップ → 自動読み取り → スプレッドシートに記録。手入力ほぼゼロ。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"#FFF0E6"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C05621" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"#FFF0E6",color:"#C05621"}}>スタッフ管理</div>
              <h3>シフト表・給与計算・給与明細</h3>
              <p>アルバイトやパートのシフト管理、時給×勤務時間の自動計算、給与明細PDFの発行まで。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"#EEEDFE"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                  <line x1="2" y1="20" x2="22" y2="20"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"#EEEDFE",color:"#534AB7"}}>レポート</div>
              <h3>月次・年間の収支レポート</h3>
              <p>売上合計・経費合計・粗利を自動集計。確定申告の準備資料としてそのまま渡せます。</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon" style={{background:"#EAF3DE"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="feat-badge" style={{background:"#EAF3DE",color:"#3B6D11"}}>無料</div>
              <h3>開業届ガイド</h3>
              <p>質問に答えるだけで開業届・青色申告承認申請書のPDFが完成。開業したての方はこちらから。</p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== ペイン ===== */}
      <section className="pain fade-in" id="pain">
        <div className="wrap">
          <h2>その「うっかり」、もったいなくないですか？</h2>
          <p className="section-sub">ひとりで事業をやっていると、気づかないうちにお金を取りこぼしています。</p>
          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">📄</div>
              <div className="pain-loss">年間20〜50万のロス</div>
              <h3>請求書を出し忘れた</h3>
              <p>納品したのに請求書を出し忘れて、翌月にまとめて発行。月10万円の請求漏れが年2〜5回起きれば、それだけで20〜50万円のロスです。</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">💰</div>
              <div className="pain-loss">1件あたり10〜30万のロス</div>
              <h3>入金されてないことに気づかない</h3>
              <p>請求書は出したけど、入金確認を怠っていた。3ヶ月後に「あれ、振り込まれてない！」——時間が経つほど回収が難しくなります。</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">⏰</div>
              <div className="pain-loss">失うもの: 信用と取引先</div>
              <h3>支払い期限を過ぎてしまった</h3>
              <p>届いた請求書がメールの中に埋もれて、支払期限を過ぎてた。1回の遅延が信用問題になり、取引先を失うこともあります。</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">👻</div>
              <div className="pain-loss">把握できないと最も危険</div>
              <h3>そもそも損失に気づいていない</h3>
              <p>取引先ごとの売上も、未入金の合計も、正確に把握できていない。「なんとなく回っている」——それが一番もったいない状態です。</p>
            </div>
          </div>
          <div className="pain-summary">
            <p>気づかないまま毎年<strong>50万円以上</strong>をロスしている方は少なくありません。<br/>ソロバコなら<strong>月1,480円</strong>で、このすべてを把握・管理できます。</p>
          </div>
        </div>
      </section>

      {/* ===== データ自権 ===== */}
      <section className="data-safe fade-in" id="data">
        <div className="wrap">
          <div className="safe-box">
            <h2>あなたのデータは、あなたのGoogleドライブにだけ。</h2>
            <p>ソロバコのサーバーには、取引先・請求書・経費などの事業データは一切保存されません。</p>
            <p>他社SaaSと異なり、データはGoogleスプレッドシートに直接書き込まれます。</p>
            <div className="data-safe-grid">
              <div className="data-safe-point">
                <div className="data-safe-icon">🔒</div>
                <div className="data-safe-point-text">解約してもデータは永久にあなたのもの</div>
              </div>
              <div className="data-safe-point">
                <div className="data-safe-icon">🚫</div>
                <div className="data-safe-point-text">第三者に共有されることは一切なし</div>
              </div>
              <div className="data-safe-point">
                <div className="data-safe-icon">✏️</div>
                <div className="data-safe-point-text">スプシだから自分でカスタマイズ自由</div>
              </div>
            </div>
            <div className="safe-flow">
              <div className="safe-node you">あなたのスプシ</div>
              <div className="safe-arrow">→</div>
              <div className="safe-node">ブラウザで処理</div>
              <div className="safe-arrow">→</div>
              <div className="safe-node you">PDF出力</div>
            </div>
            <p style={{fontSize:13,color:"var(--c-muted)",marginTop:12}}>万が一ソロバコを解約しても、データはスプレッドシートに残り続けます。</p>
          </div>
        </div>
      </section>

      {/* ===== 料金 ===== */}
      <section className="pricing fade-in" id="pricing">
        <div className="wrap">
          <span className="section-eyebrow">PRICING</span>
          <h2 className="section-h2">料金</h2>
          <p className="section-sub">まずは無料で。本気で使うなら月1,480円。</p>
          <div className="price-grid">
            <div className="price-card">
              <div className="price-name">無料</div>
              <div className="price-amount">¥0<span> / 月</span></div>
              <div className="price-note">アカウント登録不要</div>
              <ul className="price-features">
                <li>開業届 / 青色申告ガイド</li>
                <li>請求書・見積書 月3件</li>
                <li>経費記録 月3件</li>
                <li>ダッシュボード（直近1ヶ月）</li>
                <li>スプシテンプレート</li>
                <li className="disabled">前月比 / 前年比 / 前年度比</li>
                <li className="disabled">請求忘れ / 未入金 / 支払い忘れアラート</li>
                <li className="disabled">請求書OCR読み取り</li>
                <li className="disabled">スタッフ管理・シフト・給与計算</li>
                <li className="disabled">年間収支レポートPDF</li>
              </ul>
              <a href="/dashboard" className="btn btn-ghost" style={{width:"100%",justifyContent:"center"}}>無料で始める</a>
            </div>
            <div className="price-card featured">
              <div className="price-badge">おすすめ</div>
              <div className="price-name">Pro</div>
              <div className="price-amount">¥1,480<span> / 月</span></div>
              <div className="price-note">
                税込¥1,628 / 年払い¥14,800
                <span className="year-save-badge">2ヶ月おトク</span>
              </div>
              <ul className="price-features">
                <li>開業届 / 青色申告ガイド</li>
                <li>請求書・見積書・納品書・領収書 <strong>無制限</strong></li>
                <li>経費記録 <strong>無制限</strong></li>
                <li>ダッシュボード（<strong>全期間</strong>）</li>
                <li>スプシテンプレート</li>
                <li><strong>前月比 / 前年比 / 前年度比</strong></li>
                <li><strong>請求忘れ / 未入金 / 支払い忘れアラート</strong></li>
                <li><strong>請求書OCR読み取り</strong></li>
                <li><strong>スタッフ管理・シフト・給与計算・給与明細PDF</strong></li>
                <li><strong>年間収支レポートPDF</strong></li>
              </ul>
              <a href="/dashboard?upgrade=true" className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Proを始める</a>
            </div>
          </div>
          <div className="price-compare">
            <p className="compare-title">freeeと比べてみてください</p>
            <div className="compare-grid">
              <div className="compare-item">
                <div className="compare-label">freee会計 + 人事労務</div>
                <div className="compare-price">月3,000円〜</div>
              </div>
              <div className="compare-vs">→</div>
              <div className="compare-item highlight">
                <div className="compare-label">ソロバコ Pro</div>
                <div className="compare-price">月1,480円</div>
                <div className="compare-save">半額以下でバックオフィスをカバー</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq fade-in" id="faq">
        <div className="wrap">
          <h2>よくある質問</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>会計ソフトですか？</summary>
              <div className="faq-a">いいえ。ソロバコは取引先管理・請求書作成・支払い管理・スタッフ管理のためのツールです。仕訳処理や確定申告書の作成はできません。freeeや弥生の代わりではなく、「freeeに渡す前のデータ整理」としてお使いいただけます。</div>
            </details>
            <details className="faq-item">
              <summary>データはどこに保存されますか？</summary>
              <div className="faq-a">すべてあなたのGoogleスプレッドシートに保存されます。ソロバコのサーバーに顧客データは一切保存しません。解約後もデータはスプレッドシートに残ります。</div>
            </details>
            <details className="faq-item">
              <summary>Googleアカウントは必要ですか？</summary>
              <div className="faq-a">スプレッドシートのテンプレートをコピーするためにGoogleアカウントが必要です（ほとんどの方がお持ちだと思います）。テンプレートだけなら無料で、ソロバコへの登録は不要です。Proプラン（月1,480円）をご利用の場合は、Googleログインでのお支払い手続きが必要です。</div>
            </details>
            <details className="faq-item">
              <summary>スマートフォンでも使えますか？</summary>
              <div className="faq-a">はい。レスポンシブ対応のWebアプリなので、PC・タブレット・スマートフォンすべてのブラウザからご利用いただけます。アプリのインストールは不要です。</div>
            </details>
            <details className="faq-item">
              <summary>スタッフ管理はどこまでできますか？</summary>
              <div className="faq-a">スタッフの基本情報登録、シフト表作成、時給×勤務時間の自動計算、給与明細PDFの発行ができます。社会保険や年末調整には対応していません。アルバイト・パート数名規模のチームに最適です。</div>
            </details>
            <details className="faq-item">
              <summary>ダッシュボードの「粗利」は正確ですか？</summary>
              <div className="faq-a">会計上の正確な利益や事業収支ではありません。売上合計から経費合計を引いた「ざっくりの収支」です。中間搾取や減価償却は含まれません。正確な確定申告には会計ソフトや税理士をご利用ください。</div>
            </details>
            <details className="faq-item">
              <summary>インボイス制度に対応していますか？</summary>
              <div className="faq-a">はい。請求書にインボイス登録番号を記載できます。適格請求書の要件（税率ごとの消費税額記載）にも対応したテンプレートをご用意しています。</div>
            </details>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section" id="cta">
        <h2>本業に、もっと集中しよう。</h2>
        <p>バックオフィスの手間を減らして、<br/>あなたの時間と利益を守りましょう。</p>
        <a href="/dashboard" className="btn btn-primary">ダッシュボードを無料で使う</a>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:16}}>Googleアカウントでログインするだけ。登録不要・秒で完了。</p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="wrap">
          <div className="footer-inner">
            <a href="/" className="footer-logo" style={{textDecoration:"none"}}>
              <img src="/favicon.svg" alt="" height="28" />
              <span>ソロバコ</span>
            </a>
            <div className="footer-links">
              <a href="/terms">利用規約</a>
              <a href="/privacy">プライバシーポリシー</a>
              <a href="/legal">特定商取引法に基づく表記</a>
              <a href="/guide">使い方ガイド</a>
            </div>
          </div>
          <p className="footer-copy">&copy; 2026 ソロバコ</p>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
(function(){
  var els=document.querySelectorAll('.fade-in');
  if(!els.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}
    });
  },{threshold:0.08});
  els.forEach(function(el){io.observe(el);});
})();
`}} />
    </>
  )
}
