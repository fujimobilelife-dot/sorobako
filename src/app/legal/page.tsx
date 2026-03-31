export default function LegalPage() {
  return (
    <>
      <nav>
        <div className="wrap">
          <div className="logo"><a href="/" style={{display:"flex",alignItems:"center",gap:8,color:"var(--c-text)",textDecoration:"none"}}><div className="logo-mark">S</div>ソロバコ</a></div>
        </div>
      </nav>
      <section className="legal-page">
        <div className="wrap">
          <h1>特定商取引法に基づく表記</h1>
          <p className="legal-date">最終更新日: 2026年3月31日</p>

          <div className="legal-body">
            <table className="legal-table">
              <tbody>
                <tr>
                  <th>販売事業者名</th>
                  <td>FIX-Marketing（「ソロバコ」運営）</td>
                </tr>
                <tr>
                  <th>代表者</th>
                  <td>佐藤　純</td>
                </tr>
                <tr>
                  <th>所在地</th>
                  <td>請求があった場合に遅滞なく開示いたします</td>
                </tr>
                <tr>
                  <th>電話番号</th>
                  <td>請求があった場合に遅滞なく開示いたします</td>
                </tr>
                <tr>
                  <th>メールアドレス</th>
                  <td>info@sorobako.app</td>
                </tr>
                <tr>
                  <th>販売URL</th>
                  <td>https://sorobako.app</td>
                </tr>
                <tr>
                  <th>販売価格</th>
                  <td>Proプラン: 月額1,480円（税込1,628円）/ 年額14,800円（税込16,280円）</td>
                </tr>
                <tr>
                  <th>商品代金以外の必要料金</th>
                  <td>なし（インターネット接続料金は利用者負担）</td>
                </tr>
                <tr>
                  <th>支払方法</th>
                  <td>クレジットカード（Stripe経由）</td>
                </tr>
                <tr>
                  <th>支払時期</th>
                  <td>月額プラン: 毎月自動更新時 / 年額プラン: 申込時に一括</td>
                </tr>
                <tr>
                  <th>商品の引渡時期</th>
                  <td>決済完了後、即時にサービスをご利用いただけます</td>
                </tr>
                <tr>
                  <th>返品・キャンセル</th>
                  <td>デジタルサービスの性質上、返金には応じかねます。解約はいつでも可能で、解約後は次回更新日までサービスをご利用いただけます。</td>
                </tr>
                <tr>
                  <th>動作環境</th>
                  <td>Google Chrome、Safari、Firefox、Edge の最新版。Googleアカウントが必要です。</td>
                </tr>
              </tbody>
            </table>

            <div className="legal-note">
              <p>※ 個人事業主の場合、特定商取引法に基づき、住所・電話番号は「請求があった場合に遅滞なく開示」とすることが認められています。</p>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="wrap">
          <p><a href="/">トップに戻る</a></p>
          <p>&copy; 2026 ソロバコ</p>
        </div>
      </footer>
    </>
  )
}
