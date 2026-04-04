const SHEET_URL = "https://docs.google.com/spreadsheets/d/1AtiPKSBVYRa8tJKTEEykJgM1yDwiPEDXWfZfuW-ahZw/copy"

export default function GuidePage() {
  return (
    <>
      <nav>
        <div className="wrap">
          <div className="logo"><a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}><img src="/favicon.svg" alt="" height="32" /><span style={{fontWeight:500,color:"#1a1a1a"}}>ソロバコ</span></a></div>
          <div style={{display:"flex",alignItems:"center",gap:20,fontSize:14}}>
            <a href="/" style={{color:"var(--c-sub)"}}>トップ</a>
            <a href="/#features" style={{color:"var(--c-sub)"}}>機能</a>
            <a href="/#pricing" style={{color:"var(--c-sub)"}}>料金</a>
            <a href={SHEET_URL} className="cta-sm" target="_blank" rel="noopener noreferrer">無料で始める</a>
          </div>
        </div>
      </nav>

      <section className="guide-hero">
        <div className="wrap">
          <h1>使い方ガイド</h1>
          <p className="lead">スプレッドシートを手に入れたら、<strong>3ステップ</strong>で始められます。</p>
        </div>
      </section>

      <section className="guide-section">
        <div className="wrap">
          <div className="steps">

            <div className="step-card">
              <div className="step-num">1</div>
              <div className="step-content">
                <h2>取引先を登録する</h2>
                <p>「<strong>取引先</strong>」シートを開いて、顧客・仕入先の情報を入力します。</p>
                <div className="tip-box">
                  <div className="tip-label">入力のコツ</div>
                  <ul>
                    <li><strong>取引先ID</strong> → 顧客は C001, C002…、仕入先は S001, S002… がおすすめ</li>
                    <li><strong>区分</strong> → 「顧客」か「仕入先」を入力</li>
                    <li><strong>締め日・支払いサイクル</strong> → 請求書の発行タイミングの目安に</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">2</div>
              <div className="step-content">
                <h2>請求書を記録する</h2>
                <p>「<strong>請求書</strong>」シートに、発行した請求書を1行ずつ記録します。</p>
                <div className="tip-box">
                  <div className="tip-label">自動計算</div>
                  <ul>
                    <li><strong>金額（税抜）</strong>を入力するだけ → 消費税・合計（税込）は自動で計算</li>
                    <li><strong>ステータス</strong> → 「未入金」で作成、入金されたら「入金済」に変更</li>
                  </ul>
                </div>
                <div className="highlight-box">💡 毎月月初に先月分をチェック。「未入金」が残っていたら取引先に確認！</div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">3</div>
              <div className="step-content">
                <h2>経費を記録する</h2>
                <p>「<strong>経費</strong>」シートに日々の経費を記録します。レシートをもらったらすぐ入力がおすすめ。</p>
                <div className="tip-box">
                  <div className="tip-label">カテゴリ例</div>
                  <p>通信費、交通費、消耗品費、接待交際費、外注費、地代家賃、水道光熱費 など</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="guide-section alt">
        <div className="wrap">
          <h2 className="section-title">全シートの説明</h2>
          <div className="sheet-grid">
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"var(--c-accent-light)",color:"var(--c-accent)"}}>① 取引先</div>
              <p>顧客と仕入先の一覧。すべてのデータの基盤になるシートです。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"var(--c-accent-light)",color:"var(--c-accent-dark)"}}>② 請求書</div>
              <p>発行した請求書の記録。消費税・合計は自動計算。ステータスで入金管理。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"var(--c-alert-light)",color:"var(--c-alert)"}}>③ 支払い</div>
              <p>受け取った請求書の記録。支払期限とステータスで支払い漏れを防止。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"#EAF3DE",color:"#3B6D11"}}>④ 経費</div>
              <p>日々の経費記録。確定申告の準備資料としても使えます。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"#FFF0E6",color:"#C05621"}}>⑤ スタッフ</div>
              <p>アルバイト・パートの基本情報。時給もここで管理します。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"#FEF3C7",color:"#92400E"}}>⑥ シフト</div>
              <p>日別の勤務記録。実働時間は開始・終了・休憩から自動計算。</p>
            </div>
            <div className="sheet-card">
              <div className="sheet-badge" style={{background:"#EEEDFE",color:"#534AB7"}}>⑦ 給与</div>
              <p>月次の給与計算。シフトから実働時間を自動集計し、支給額を計算。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="wrap">
          <h2 className="section-title">スタッフ管理の使い方</h2>
          <div className="staff-steps">
            <div className="staff-step">
              <div className="staff-step-label">A</div>
              <div>
                <h3>スタッフを登録</h3>
                <p>「スタッフ」シートにスタッフID・氏名・時給を入力します。</p>
              </div>
            </div>
            <div className="staff-arrow">↓</div>
            <div className="staff-step">
              <div className="staff-step-label">B</div>
              <div>
                <h3>シフトを入力</h3>
                <p>「シフト」シートに日付・スタッフID・開始/終了時刻・休憩（分）を入力。実働時間は自動計算されます。</p>
              </div>
            </div>
            <div className="staff-arrow">↓</div>
            <div className="staff-step">
              <div className="staff-step-label">C</div>
              <div>
                <h3>給与を確認</h3>
                <p>「給与」シートに年月・スタッフIDを入力すると、合計実働時間・総支給額・差引支給額が自動で計算されます。</p>
              </div>
            </div>
          </div>
          <div className="warn-box">⚠️ 社会保険料・所得税の自動計算には対応していません。必要に応じて控除額を手入力してください。</div>
        </div>
      </section>

      <section className="guide-section">
        <div className="wrap">
          <h2 className="section-title">ダッシュボードの使い方</h2>
          <p style={{textAlign:"center",color:"var(--c-sub)",marginBottom:32}}>スプシにデータを入力したら、ダッシュボードで売上・アラートをまとめて確認できます。</p>
          <div className="steps">

            <div className="step-card">
              <div className="step-num">1</div>
              <div className="step-content">
                <h2>Googleアカウントでログイン</h2>
                <p>ダッシュボードにアクセスし、「<strong>Googleでログイン</strong>」をクリック。普段お使いのGoogleアカウントで認証してください。</p>
                <div className="tip-box">
                  <div className="tip-label">ポイント</div>
                  <ul>
                    <li>スプシと<strong>同じGoogleアカウント</strong>でログインしてください</li>
                    <li>初回ログイン時にスプシへのアクセス許可が求められます</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">2</div>
              <div className="step-content">
                <h2>スプレッドシートのURLを接続</h2>
                <p>テンプレートのスプシURLをコピーして、ダッシュボードの入力欄に貼り付け「<strong>接続</strong>」を押します。</p>
                <div className="tip-box">
                  <div className="tip-label">URLのコピー方法</div>
                  <ul>
                    <li>Googleスプシを開いてブラウザのアドレスバーからURLをコピー</li>
                    <li>形式: <code style={{fontSize:12,background:"#f0f0f0",padding:"1px 6px",borderRadius:4}}>https://docs.google.com/spreadsheets/d/＜ID＞/edit</code></li>
                  </ul>
                </div>
                <div className="highlight-box">💡 一度接続すると次回以降は自動で読み込まれます。</div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-num">3</div>
              <div className="step-content">
                <h2>アラートと集計を確認</h2>
                <p>接続が完了すると、スプシのデータをもとに売上・経費・粗利が自動集計され、アラートが表示されます。</p>
                <div className="tip-box">
                  <div className="tip-label">アラートの種類</div>
                  <ul>
                    <li>🔴 <strong>未入金アラート</strong> — 請求日から14日を超えて未入金の請求書</li>
                    <li>🟡 <strong>支払い期限アラート</strong> — 支払期限を過ぎた未払いの支払い記録</li>
                  </ul>
                </div>
                <div className="warn-box" style={{marginTop:16}}>⚠️ アラートが出たら、すぐに取引先への確認・催促を！放置が一番のリスクです。</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="guide-section alt">
        <div className="wrap">
          <h2 className="section-title">よくある質問</h2>
          <div className="guide-faq">
            <div className="faq-item"><div className="faq-q">サンプルデータは消していい？</div><div className="faq-a">はい。サンプルデータの行を選択して削除してください。ヘッダー行（1行目）は消さないでください。</div></div>
            <div className="faq-item"><div className="faq-q">行が足りなくなったら？</div><div className="faq-a">一番下に行を追加するだけでOKです。数式がある列は、上のセルをコピーして貼り付けてください。</div></div>
            <div className="faq-item"><div className="faq-q">スマホからでも使える？</div><div className="faq-a">はい。Googleスプレッドシートアプリから編集できます。</div></div>
            <div className="faq-item"><div className="faq-q">確定申告にそのまま使える？</div><div className="faq-a">会計ソフト（freee、弥生など）にデータを渡すための整理ツールです。そのまま申告書にはなりません。</div></div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <h2>さっそく始めましょう</h2>
        <p>スプレッドシートのテンプレートを手に入れて、<br/>取引先の管理を始めてみませんか？</p>
        <a href={SHEET_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">スプレッドシートを無料で手に入れる</a>
      </section>

      <footer>
        <div className="wrap">
          <p style={{marginBottom:8}}>
            <a href="/">トップ</a> / <a href="/guide/kaigyou">開業届ガイド</a> / <a href="/terms">利用規約</a> / <a href="/privacy">プライバシーポリシー</a>
          </p>
          <p>&copy; 2026 ソロバコ</p>
        </div>
      </footer>
    </>
  )
}
