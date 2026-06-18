# 初出場国の旅路：FIFA 2026 ベースキャンプから試合会場へ

## 作品概要

FIFA World Cup 2026に初出場する4か国（ウズベキスタン、ヨルダン、カーボベルデ、キュラソー）をテーマにした、3Dストーリーテリングマップです。各国のベースキャンプから試合会場へ向かう旅路を、斜め視点の3D地図、曲線ルート、移動アイコン、シーン説明パネルで表現します。

## 使用技術

- HTML
- CSS
- JavaScript
- MapLibre GL JS
- OpenFreeMap / OpenStreetMap ベースの地図スタイル
- Terrarium elevation tiles（3D地形）

## データ出典

- 課題指定データ（ベースキャンプ、試合日程、会場、座標）
- 背景地図: OpenFreeMap / OpenStreetMap contributors
- 標高タイル: AWS Public Dataset Terrain Tiles

## 公開URL

- GitHub Pages URL: `https://<your-github-username>.github.io/fifa2026-first-time-nations-map/`

## ファイル構成

- `index.html` — MapLibre GL JS、CSS、データ、アプリ本体を読み込む静的ページ
- `style.css` — 全画面地図、ストーリーパネル、操作ボタン、マーカーのスタイル
- `data.js` — 国、ベースキャンプ、試合、ルート、シーンのデータ
- `main.js` — 3D地図、ルート描画、アイコンアニメーション、シーン操作の実装

## GitHub Pagesで公開する手順

1. このリポジトリをGitHubへpushします。
2. GitHubのリポジトリ画面で **Settings** を開きます。
3. **Pages** を選択します。
4. **Build and deployment** の **Source** を `Deploy from a branch` にします。
5. Branchを `main`（または公開したいブランチ） / `/ (root)` に設定して保存します。
6. 表示されたGitHub Pages URLにアクセスします。
