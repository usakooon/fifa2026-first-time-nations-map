# Uzbekistan’s First World Cup Journey: From Tashkent to the World Cup Stage

## 作品概要

FIFA World Cup 2026に初出場するウズベキスタン代表を対象にした、3Dストーリーテリングマップの静的サイトプロトタイプです。ウズベキスタンの出発点であるタシュケント、北米でのベースキャンプ、3つの試合会場、移動手段、移動負担をMapLibre GL JSの3D地図上でシーンごとに表現します。

## 使用技術

- HTML
- CSS
- JavaScript
- MapLibre GL JS
- Turf.js
- OpenFreeMap / OpenStreetMapベースの地図タイル

ビルドツール、Node.js、npm、Vite、Reactは使用していません。GitHub Pagesでそのまま公開できる構成です。

## 対象データ

- Uzbekistan / Tashkent: `[69.2401, 41.2995]`
- Base Camp: Atlanta United Training Centre, Atlanta / Marietta `[-84.523, 33.942]`
- Match 1: Mexico City Stadium, Mexico City `[-99.1505, 19.3029]`
- Match 2: Houston Stadium, Houston `[-95.4107, 29.6847]`
- Match 3: Atlanta Stadium, Atlanta `[-84.4008, 33.7554]`

## シーン構成

1. Title — North America overview
2. Uzbekistan introduction — Tashkent
3. From Tashkent to Atlanta — long-distance flight route
4. Base camp — Atlanta United Training Centre
5. Three match venues overview — base camp and venues
6. Match 1 venue — Mexico City Stadium vs Colombia
7. Match 2 venue — Houston Stadium vs Portugal
8. Match 3 venue — Atlanta Stadium vs DR Congo
9. Travel comparison — long-distance flight, domestic flight, same-city movement
10. Ending — complete journey overview

## GitHub Pages公開URL

- URL: `https://<your-github-username>.github.io/fifa2026-first-time-nations-map/`

## データ出典

- FIFA World Cup 2026 match and team information: project brief / official tournament reference to be confirmed
- Geographic coordinates: project brief
- Background map: OpenFreeMap / OpenStreetMap contributors
