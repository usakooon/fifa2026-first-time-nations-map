/* MapLibre storytelling app without build tools or server-side code. */
const data = STORY_DATA;
const routeFeatures = [];
let map;
let currentSceneIndex = 0;
let isPlaying = false;
let isPaused = false;
let sceneTimer = null;
let animationFrame = null;
let activePopups = [];
let vehicleMarker = null;
let sceneToken = 0;

// Initialize the 3D map with an oblique camera.
map = new maplibregl.Map({
  container: 'map',
  style: data.mapStyle,
  center: data.scenes[0].camera.center,
  zoom: data.scenes[0].camera.zoom,
  pitch: data.scenes[0].camera.pitch,
  bearing: data.scenes[0].camera.bearing,
  attributionControl: true
});
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

map.on('load', () => {
  addTerrainAndBuildings();
  buildRoutes();
  addRouteLayers();
  addMarkers();
  goToScene(0, { animate: false });
});

// Add terrain when supported and create extruded buildings from vector tiles when available.
function addTerrainAndBuildings() {
  if (!map.getSource('terrain')) {
    map.addSource('terrain', { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'], encoding: 'terrarium', tileSize: 256, maxzoom: 13 });
    map.setTerrain({ source: 'terrain', exaggeration: 1.15 });
  }
  // Some OpenFreeMap styles expose an OpenMapTiles building source; skip gracefully if not present.
  if (map.getSource('openmaptiles')) {
    map.addLayer({ id: '3d-buildings', source: 'openmaptiles', 'source-layer': 'building', type: 'fill-extrusion', minzoom: 12, paint: { 'fill-extrusion-color': '#718096', 'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 18], 'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0], 'fill-extrusion-opacity': 0.55 } });
  }
}

// Create all route GeoJSON features once from the data file.
function buildRoutes() {
  data.nations.forEach(nation => nation.matches.forEach(match => {
    routeFeatures.push({ type: 'Feature', properties: { nationId: nation.id, color: nation.color, transport: match.transport, matchNumber: match.number }, geometry: { type: 'LineString', coordinates: makeRoute(nation.baseCamp.coordinates, match.coordinates, match.transport) } });
  }));
}

// Draw curved flights and simple ground routes.
function makeRoute(start, end, transport) {
  if (transport !== 'flight') {
    const mid = [(start[0] + end[0]) / 2 + 0.06, (start[1] + end[1]) / 2 + 0.05];
    return [start, mid, end];
  }
  const coords = [];
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const curve = Math.min(8, Math.max(1.5, Math.hypot(dx, dy) * 0.16));
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    coords.push([start[0] + dx * t, start[1] + dy * t + Math.sin(Math.PI * t) * curve]);
  }
  return coords;
}

// Route layers are filtered dynamically by scene.
function addRouteLayers() {
  map.addSource('routes', { type: 'geojson', data: { type: 'FeatureCollection', features: routeFeatures } });
  ['flight', 'car', 'car_same_city'].forEach(type => {
    const style = data.transportStyles[type];
    map.addLayer({ id: `route-${type}`, type: 'line', source: 'routes', filter: ['all', ['==', ['get', 'transport'], type], ['==', ['get', 'nationId'], 'none']], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': type === 'flight' ? style.color : ['get', 'color'], 'line-width': style.width, 'line-opacity': 0.92, 'line-dasharray': style.dasharray } });
  });
}

// Add base-camp and stadium DOM markers with readable labels.
function addMarkers() {
  data.nations.forEach(nation => {
    createMarker(nation.baseCamp.coordinates, `<span class="icon">🏠 ${nation.flag}</span><strong>${nation.country}</strong><br>${nation.baseCamp.name}<br>${nation.baseCamp.city}`, 'base');
    nation.matches.forEach(match => createMarker(match.coordinates, `<span class="icon">🏟️</span><strong>Match ${match.number}</strong>${match.date}<br>${match.venue}<br>${match.city}`, 'match'));
  });
}
function createMarker(coordinates, html, type) {
  const el = document.createElement('div');
  el.className = `marker ${type}`;
  el.innerHTML = html;
  new maplibregl.Marker({ element: el }).setLngLat(coordinates).addTo(map);
}

// Central scene transition function used by all buttons.
function goToScene(index, options = {}) {
  currentSceneIndex = Math.max(0, Math.min(data.scenes.length - 1, index));
  sceneToken += 1;
  clearAnimations();
  clearPopups();
  const scene = data.scenes[currentSceneIndex];
  updatePanel(scene);
  updateRouteFilters(scene);
  const camera = { ...scene.camera, duration: options.animate === false ? 0 : 5600, essential: true };
  map.flyTo(camera);
  window.setTimeout(() => showScenePopup(scene), options.animate === false ? 50 : 1700);
  if (scene.mode === 'routes' && !isPaused) window.setTimeout(() => runNationAnimations(scene.nation, sceneToken), options.animate === false ? 350 : 2600);
  if (isPlaying && !isPaused) sceneTimer = window.setTimeout(nextScene, scene.mode === 'routes' ? 17000 : 7800);
}

// Keep route visibility focused on the current narrative scene.
function updateRouteFilters(scene) {
  ['flight', 'car', 'car_same_city'].forEach(type => {
    if (!map.getLayer(`route-${type}`)) return;
    let filter = ['==', ['get', 'nationId'], 'none'];
    if (scene.mode === 'routes') filter = ['all', ['==', ['get', 'transport'], type], ['==', ['get', 'nationId'], scene.nation]];
    if (scene.mode === 'allRoutes' || scene.mode === 'all') filter = ['==', ['get', 'transport'], type];
    map.setFilter(`route-${type}`, filter);
    map.setPaintProperty(`route-${type}`, 'line-opacity', scene.mode === 'allRoutes' ? 0.42 : 0.92);
  });
}

// Update the story panel with scene-specific text, base camp notes, and match cards.
function updatePanel(scene) {
  const nation = data.nations.find(n => n.id === scene.nation);
  const matches = nation ? nation.matches.map(m => `<div class="info-card" style="--accent:${nation.color}"><strong>🏟️ Match ${m.number} · ${m.date}</strong>Opponent: ${m.opponent}<br>Venue: ${m.venue}<br>City: ${m.city}</div>`).join('') : '';
  const base = nation ? `<div class="info-card" style="--accent:${nation.color}"><strong>🏠 ${nation.flag} ${nation.country}</strong>Base Camp: ${nation.baseCamp.name}<br>City: ${nation.baseCamp.city}<p>${nation.baseCamp.description}</p><p><b>Benefit:</b> ${nation.baseCamp.benefit}</p></div>` : '';
  document.getElementById('story-panel').innerHTML = `<p class="eyebrow">Scene ${currentSceneIndex + 1} / ${data.scenes.length}</p><h1>${scene.title}</h1>${scene.subtitle ? `<h2>${scene.subtitle}</h2>` : ''}<p>${scene.text || 'Base campから試合会場へ、カメラとアイコンが移動の流れを追います。'}</p><div class="scene-meta">${base}</div><div class="match-list">${matches}</div>`;
}

// Show automatic popup for the active base or first active match.
function showScenePopup(scene) {
  if (sceneToken === 0) return;
  const nation = data.nations.find(n => n.id === scene.nation) || data.nations[0];
  let coordinates = data.scenes[0].camera.center;
  let html = `<div class="popup-title">${scene.title}</div>${scene.text || 'First-time nations on the move.'}`;
  if (scene.mode === 'base' && nation) { coordinates = nation.baseCamp.coordinates; html = `<div class="popup-title">🏠 ${nation.flag} ${nation.country}</div>Base Camp: ${nation.baseCamp.name}<br>City: ${nation.baseCamp.city}`; }
  if (scene.mode === 'routes' && nation) { const m = nation.matches[0]; coordinates = m.coordinates; html = matchPopup(m); }
  activePopups.push(new maplibregl.Popup({ closeButton: false, offset: 24 }).setLngLat(coordinates).setHTML(html).addTo(map));
}
function matchPopup(m) { return `<div class="popup-title">🏟️ Match ${m.number}</div>Date: ${m.date}<br>Opponent: ${m.opponent}<br>Venue: ${m.venue}<br>City: ${m.city}`; }

// Animate vehicles one route at a time and gently track the moving direction.
function runNationAnimations(nationId, token) {
  const nation = data.nations.find(n => n.id === nationId);
  if (!nation || token !== sceneToken) return;
  let i = 0;
  const runNext = () => {
    if (i >= nation.matches.length || token !== sceneToken || isPaused) return;
    animateRoute(nation, nation.matches[i], token, () => { i += 1; window.setTimeout(runNext, 600); });
  };
  runNext();
}
function animateRoute(nation, match, token, done) {
  clearAnimations(false);
  activePopups.push(new maplibregl.Popup({ closeButton: false, offset: 24 }).setLngLat(match.coordinates).setHTML(matchPopup(match)).addTo(map));
  const route = makeRoute(nation.baseCamp.coordinates, match.coordinates, match.transport);
  const el = document.createElement('div');
  el.className = 'vehicle-marker';
  el.textContent = data.transportStyles[match.transport].icon;
  vehicleMarker = new maplibregl.Marker({ element: el }).setLngLat(route[0]).addTo(map);
  const duration = match.transport === 'flight' ? 4700 : 3600;
  const start = performance.now();
  const step = now => {
    if (token !== sceneToken || isPaused || !vehicleMarker) return;
    const t = Math.min(1, (now - start) / duration);
    const pos = interpolateRoute(route, t);
    const next = interpolateRoute(route, Math.min(1, t + 0.02));
    vehicleMarker.setLngLat(pos);
    el.style.transform = `rotate(${bearing(pos, next)}deg)`;
    if (Math.round(t * 100) % 17 === 0) map.easeTo({ center: pos, duration: 650, pitch: 55, bearing: bearing(pos, next) - 20, zoom: match.transport === 'flight' ? map.getZoom() : Math.max(map.getZoom(), 9) });
    if (t < 1) animationFrame = requestAnimationFrame(step); else done?.();
  };
  animationFrame = requestAnimationFrame(step);
}
function interpolateRoute(route, t) { const idx = Math.min(route.length - 2, Math.floor(t * (route.length - 1))); const local = t * (route.length - 1) - idx; const a = route[idx], b = route[idx + 1]; return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local]; }
function bearing(a, b) { return Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; }

function nextScene() { clearTimeout(sceneTimer); if (currentSceneIndex < data.scenes.length - 1) goToScene(currentSceneIndex + 1); else isPlaying = false; }
function previousScene() { clearTimeout(sceneTimer); goToScene(currentSceneIndex - 1); }
function playStory() { if (isPlaying && !isPaused) return; isPlaying = true; isPaused = false; if (currentSceneIndex >= data.scenes.length - 1) currentSceneIndex = 0; goToScene(currentSceneIndex); }
function pauseStory() { isPaused = true; isPlaying = false; clearTimeout(sceneTimer); clearAnimations(false); map.stop(); }
function stopStory() { isPlaying = false; isPaused = false; currentSceneIndex = 0; clearTimeout(sceneTimer); clearAnimations(); clearPopups(); map.stop(); goToScene(0, { animate: true }); }
function clearAnimations(removeVehicle = true) { if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = null; if (removeVehicle && vehicleMarker) { vehicleMarker.remove(); vehicleMarker = null; } }
function clearPopups() { activePopups.forEach(p => p.remove()); activePopups = []; }

document.getElementById('prevBtn').addEventListener('click', previousScene);
document.getElementById('nextBtn').addEventListener('click', nextScene);
document.getElementById('playBtn').addEventListener('click', playStory);
document.getElementById('pauseBtn').addEventListener('click', pauseStory);
document.getElementById('stopBtn').addEventListener('click', stopStory);
document.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); (isPlaying && !isPaused) ? pauseStory() : playStory(); } });
