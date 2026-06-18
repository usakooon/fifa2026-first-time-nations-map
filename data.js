/* Global data for the FIFA 2026 first-time nations story map. */
const STORY_DATA = {
  mapStyle: 'https://tiles.openfreemap.org/styles/dark',
  transportStyles: {
    flight: { color: '#45b7ff', width: 3, dasharray: [1.2, 1.2], icon: '✈️' },
    car: { color: '#ffb454', width: 4, dasharray: [1, 0], icon: '🚗' },
    car_same_city: { color: '#fff1a8', width: 7, dasharray: [1, 0], icon: '🚗' }
  },
  nations: [
    {
      id: 'uzbekistan', country: 'Uzbekistan', flag: '🇺🇿', color: '#26d6a3',
      baseCamp: { name: 'Atlanta United Training Centre', city: 'Atlanta / Marietta', coordinates: [-84.523, 33.942], description: 'MLSクラブの本格的なトレーニング施設。複数のフルサイズピッチ、ジム、ロッカールームを備え、練習・回復・ミーティングを高水準で行いやすい。', benefit: 'Atlantaで試合も行うため、現地環境に慣れやすい。' },
      matches: [
        { number: 1, date: 'June 17', opponent: 'Colombia', venue: 'Mexico City Stadium', city: 'Mexico City', coordinates: [-99.1505, 19.3029], transport: 'flight' },
        { number: 2, date: 'June 23', opponent: 'Portugal', venue: 'Houston Stadium', city: 'Houston', coordinates: [-95.4107, 29.6847], transport: 'flight' },
        { number: 3, date: 'June 27', opponent: 'DR Congo', venue: 'Atlanta Stadium', city: 'Atlanta', coordinates: [-84.4008, 33.7554], transport: 'car_same_city' }
      ]
    },
    {
      id: 'jordan', country: 'Jordan', flag: '🇯🇴', color: '#ff6f91',
      baseCamp: { name: 'University of Portland', city: 'Portland', coordinates: [-122.727, 45.573], description: '米国大学サッカーの実績ある施設で、代表チームやプロチームの利用実績もある。', benefit: '試合開催都市から少し離れた落ち着いた環境で、日々の練習ルーティンを作りやすい。' },
      matches: [
        { number: 1, date: 'June 16', opponent: 'Austria', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara', coordinates: [-121.9698, 37.4030], transport: 'flight' },
        { number: 2, date: 'June 22', opponent: 'Algeria', venue: 'San Francisco Bay Area Stadium', city: 'Santa Clara', coordinates: [-121.9698, 37.4030], transport: 'flight' },
        { number: 3, date: 'June 27', opponent: 'Argentina', venue: 'Dallas Stadium', city: 'Arlington / Dallas area', coordinates: [-97.0945, 32.7473], transport: 'flight' }
      ]
    },
    {
      id: 'cape-verde', country: 'Cape Verde', flag: '🇨🇻', color: '#ffd166',
      baseCamp: { name: 'Waters Sportsplex', city: 'Tampa', coordinates: [-82.565, 28.025], description: 'Tampa Bay Rowdiesの練習拠点で、天然芝ピッチやFIFA承認の人工芝ピッチを備える。', benefit: 'Atlanta、Miami、Houstonでの試合に向けて、南部の暑さや湿度に慣れやすい。' },
      matches: [
        { number: 1, date: 'June 15', opponent: 'Spain', venue: 'Atlanta Stadium', city: 'Atlanta', coordinates: [-84.4008, 33.7554], transport: 'flight' },
        { number: 2, date: 'June 21', opponent: 'Uruguay', venue: 'Miami Stadium', city: 'Miami Gardens', coordinates: [-80.2389, 25.9580], transport: 'car' },
        { number: 3, date: 'June 26', opponent: 'Saudi Arabia', venue: 'Houston Stadium', city: 'Houston', coordinates: [-95.4107, 29.6847], transport: 'flight' }
      ]
    },
    {
      id: 'curacao', country: 'Curaçao', flag: '🇨🇼', color: '#7bdff2',
      baseCamp: { name: 'Florida Atlantic University', city: 'Boca Raton', coordinates: [-80.101, 26.373], description: '南フロリダの大学キャンパス内にある施設で、スタジアムやサッカー施設を利用できる。', benefit: 'カリブ海地域に近く、気候や文化的な親和性が高いため、初出場国としてリラックスしやすい。' },
      matches: [
        { number: 1, date: 'June 14', opponent: 'Germany', venue: 'Houston Stadium', city: 'Houston', coordinates: [-95.4107, 29.6847], transport: 'flight' },
        { number: 2, date: 'June 20', opponent: 'Ecuador', venue: 'Kansas City Stadium', city: 'Kansas City', coordinates: [-94.4839, 39.0489], transport: 'flight' },
        { number: 3, date: 'June 25', opponent: 'Côte d’Ivoire', venue: 'Philadelphia Stadium', city: 'Philadelphia', coordinates: [-75.1675, 39.9008], transport: 'flight' }
      ]
    }
  ],
  scenes: [
    { id: 'title', title: '初出場国の旅路', subtitle: '🇺🇿 🇯🇴 🇨🇻 🇨🇼', text: 'Four first-time nations begin their World Cup journey.', camera: { center: [-99, 38], zoom: 2.6, pitch: 50, bearing: -18 }, mode: 'all' },
    { id: 'overview', title: 'Base Camps Overview', text: '4つのベースキャンプが、北米を横断するストーリーの出発点です。', camera: { center: [-100, 36], zoom: 3.0, pitch: 52, bearing: 15 }, mode: 'bases' },
    { id: 'uz-base', nation: 'uzbekistan', title: 'Uzbekistan Base Camp', camera: { center: [-84.53, 33.94], zoom: 14.1, pitch: 61, bearing: -30 }, mode: 'base' },
    { id: 'uz-routes', nation: 'uzbekistan', title: 'Uzbekistan Match Routes', camera: { center: [-91, 27], zoom: 4.2, pitch: 53, bearing: 22 }, mode: 'routes' },
    { id: 'jo-base', nation: 'jordan', title: 'Jordan Base Camp', camera: { center: [-122.727, 45.573], zoom: 13.5, pitch: 60, bearing: 36 }, mode: 'base' },
    { id: 'jo-routes', nation: 'jordan', title: 'Jordan Match Routes', camera: { center: [-110, 38], zoom: 4.0, pitch: 52, bearing: -24 }, mode: 'routes' },
    { id: 'cv-base', nation: 'cape-verde', title: 'Cape Verde Base Camp', camera: { center: [-82.565, 28.025], zoom: 13.7, pitch: 60, bearing: -42 }, mode: 'base' },
    { id: 'cv-routes', nation: 'cape-verde', title: 'Cape Verde Match Routes', camera: { center: [-86, 29], zoom: 5.0, pitch: 54, bearing: 20 }, mode: 'routes' },
    { id: 'cu-base', nation: 'curacao', title: 'Curaçao Base Camp', camera: { center: [-80.101, 26.373], zoom: 13.6, pitch: 60, bearing: 26 }, mode: 'base' },
    { id: 'cu-routes', nation: 'curacao', title: 'Curaçao Match Routes', camera: { center: [-87, 34], zoom: 4.3, pitch: 53, bearing: -18 }, mode: 'routes' },
    { id: 'comparison', title: 'Movement Comparison', text: 'For first-time nations, the World Cup is also a geographic challenge.', camera: { center: [-96, 36], zoom: 3.1, pitch: 50, bearing: 28 }, mode: 'allRoutes' },
    { id: 'ending', title: 'From Base Camps to Stadiums', text: 'From base camps to stadiums, each journey tells a story of preparation, distance, and ambition.', camera: { center: [-97, 36], zoom: 3.0, pitch: 55, bearing: -12 }, mode: 'all' }
  ]
};
