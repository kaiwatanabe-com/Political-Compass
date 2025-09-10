# Political Compass — 80-Item Survey

A static political compass website (no build tools) with EN/JA localization and a downloadable result card.
日本語と英語に対応した静的サイト版の政治コンパス（80項目）。結果カードの保存に対応。ビルド不要・GitHub Pagesで公開可能。

## Features / 機能 
• 80 items across Economic (X), Social-Core & National-Security (Y)
  経済（X）・社会コア＋安全保障（Y）をカバー（重複整理済）
• Controversial module merged into Social-Core
  物議項目は社会コアへ統合
• Attention-check items removed
  注意テスト項目は削除
• Localized result card (EN/JA) + localized watermark
  結果カードと透かし文言は言語に同期
• Crisp preview via cached axes (no ghosting)
  オフスクリーン描画で多重描画を解消
• Sticky Likert header under the top bar
  リッカート見出しをトップバー直下に固定
• Floating “Save Result Card” button
  目立つ保存ボタン

## Repo Structure / 構成
index.html    : ページ本体（静的）
styles.css    : スタイル
app.js        : ロジック（描画/集計/i18n/保存）
questions.js  : 質問バンク（重複整理・逆転項目指定）

## Getting Started
Open “index.html” in a browser. No build step required.
ローカルでは “index.html” をブラウザで開くだけです。
Optional local server: python -m http.server 8080  →  http://localhost:8080

## Deploy to GitHub Pages
1) Push this repo to GitHub
2) Settings → Pages
3) Source: Deploy from a branch → main (or docs) → / (root)
4) Save

## Customization / カスタマイズ
Axis wording（軸ラベル）: app.js の buildAxesCache() と、結果カード生成内ミニチャート注釈のラベル文字列を変更
Questions（質問編集）: questions.js を編集。逆転項目は第三要素 true
Watermark（透かし）: app.js 内の watermark 文字列を自分のURLへ

## Scoring / スコアリング
Likert 1–9（逆転は 10 - v）
軸スコアは −100..+100 に正規化: scaled = ((mean - 5) / 4) * 100
Y は Social-Core と Security の平均

## License
MIT
