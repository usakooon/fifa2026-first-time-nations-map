const pointLookup = new Map();
const routeDefinitions = [];
let map;
let currentSceneIndex = 0;
let isPlaying = false;
let isPaused = false;
let sceneTimer = null;
let animationFrameId = null;
let activePopups = [];
let movingMarker = null;
let routeFeatureCollection;

const sceneDuration = 6200;

function initData() {
  const { origin, baseCamp, venues } = journeyData;
  [origin, baseCamp, ...venues].forEach((point) => pointLookup.set(point.id, point));
  routeDefinitions.push(
    makeRoute('tashkent-base', origin.coordinates, baseCamp.coordinates, 'flight', 'Tashkent → Atlanta'),
    makeRoute('base-mexico', baseCamp.coordinates, venues[0].coordinates, 'flight', 'Atlanta → Mexico City'),
    makeRoute('base-houston', baseCamp.coordinates, venues[1].coordinates, 'flight', 'Atlanta → Houston'),
    makeRoute('base-atlanta', baseCamp.coordinates, venues[2].coordinates, 'car_same_city', 'Atlanta / Marietta → Atlanta Stadium')
  );
  routeFeatureCollection = { type: 'FeatureCollection', features: routeDefinitions.map((route) => route.feature) };
}

function makeRoute(id, start, end, transport, label) {
  const line = transport === 'flight' ? makeCurvedLine(start, end) : turf.lineString([start, end]);
  line.properties = { id, transport, label };
  return { id, start, end, transport, label, feature: line };
}

function makeCurvedLine(start, end) {
  const distance = turf.distance(turf.point(start), turf.point(end));
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + Math.min(distance / 240, 18)];
  const curve = turf.bezierSpline(turf.lineString([start, midpoint, end]), { sharpness: 0.72, resolution: 9000 });
  return curve;
}

function createPointFeatures(ids) {
  return {
    type: 'FeatureCollection',
    features: ids.map((id) => {
      const point = pointLookup.get(id);
      return { type: 'Feature', geometry: { type: 'Point', coordinates: point.coordinates }, properties: { ...point } };
    })
  };
}

function bootMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: scenes[0].center,
    zoom: scenes[0].zoom,
    pitch: scenes[0].pitch,
    bearing: scenes[0].bearing,
    antialias: true
  });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.on('load', () => {
    addSourcesAndLayers();
    bindControls();
    buildProgressDots();
    goToScene(0, { instant: true, preservePlayback: true });
  });
}

function addSourcesAndLayers() {
  map.addSource('points', { type: 'geojson', data: createPointFeatures([]) });
  map.addSource('routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addSource('buildings', { type: 'vector', url: 'https://tiles.openfreemap.org/planet' });

  map.addLayer({ id: 'route-flight', type: 'line', source: 'routes', filter: ['==', ['get', 'transport'], 'flight'], paint: { 'line-color': '#0ea5e9', 'line-width': ['case', ['==', ['get', 'compare'], true], 5, 4], 'line-dasharray': [1.2, 1.1], 'line-opacity': 0.9 } });
  map.addLayer({ id: 'route-car', type: 'line', source: 'routes', filter: ['==', ['get', 'transport'], 'car_same_city'], paint: { 'line-color': '#f97316', 'line-width': 8, 'line-opacity': 0.92 } });
  map.addLayer({ id: 'point-glow', type: 'circle', source: 'points', paint: { 'circle-radius': 18, 'circle-color': '#38bdf8', 'circle-opacity': 0.25 } });
  map.addLayer({ id: 'point-dot', type: 'circle', source: 'points', paint: { 'circle-radius': 7, 'circle-color': '#ffffff', 'circle-stroke-width': 3, 'circle-stroke-color': '#0284c7' } });
  map.addLayer({ id: 'point-label', type: 'symbol', source: 'points', layout: { 'text-field': ['coalesce', ['get', 'venue'], ['get', 'baseCamp'], ['get', 'country']], 'text-offset': [0, 1.45], 'text-size': 13, 'text-anchor': 'top' }, paint: { 'text-color': '#0f172a', 'text-halo-color': '#ffffff', 'text-halo-width': 1.4 } });

  try {
    map.addLayer({ id: '3d-buildings', source: 'buildings', 'source-layer': 'building', type: 'fill-extrusion', minzoom: 13, paint: { 'fill-extrusion-color': '#94a3b8', 'fill-extrusion-height': ['coalesce', ['get', 'height'], 18], 'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0], 'fill-extrusion-opacity': 0.45 } });
  } catch (error) {
    console.warn('3D buildings layer unavailable for this style.', error);
  }
}

function bindControls() {
  document.getElementById('prev-button').addEventListener('click', previousScene);
  document.getElementById('next-button').addEventListener('click', nextScene);
  document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
  document.getElementById('restart-button').addEventListener('click', restartStory);
}

function goToScene(index, options = {}) {
  const clamped = Math.max(0, Math.min(index, scenes.length - 1));
  currentSceneIndex = clamped;
  const scene = scenes[clamped];
  const shouldContinue = options.preservePlayback && isPlaying;

  clearTimers();
  clearAnimations();
  clearPopups();
  updatePanel(scene);
  updateMapData(scene);

  map[options.instant ? 'jumpTo' : 'flyTo']({ center: scene.center, zoom: scene.zoom, pitch: scene.pitch, bearing: scene.bearing, duration: options.instant ? 0 : 2600, essential: true });
  map.once(options.instant ? 'idle' : 'moveend', () => showScenePopups(scene));
  if (scene.animateRoute) animateRouteIcon(scene.animateRoute);

  if (shouldContinue && clamped < scenes.length - 1) scheduleNextScene();
  if (clamped === scenes.length - 1) { isPlaying = false; isPaused = false; }
  updateControls();
  updateProgressDots();
}

function updateMapData(scene) {
  map.getSource('points').setData(createPointFeatures(scene.showPoints || []));
  const routes = routeDefinitions.filter((route) => (scene.showRoutes || []).includes(route.id)).map((route) => ({ ...route.feature, properties: { ...route.feature.properties, compare: !!scene.compare } }));
  map.getSource('routes').setData({ type: 'FeatureCollection', features: routes });
}

function updatePanel(scene) {
  document.getElementById('scene-title').textContent = scene.title;
  document.getElementById('scene-location').textContent = scene.location;
  document.getElementById('scene-description').textContent = scene.description;
  const details = document.getElementById('scene-details');
  details.innerHTML = '';
  Object.entries(scene.details || {}).forEach(([key, value]) => {
    details.insertAdjacentHTML('beforeend', `<dt>${key}</dt><dd>${value}</dd>`);
  });
}

function showScenePopups(scene) {
  (scene.showPoints || []).forEach((id) => {
    const point = pointLookup.get(id);
    const label = point.venue || point.baseCamp || point.location || point.country;
    const icon = point.icon === 'house' ? '🏠' : point.icon === 'stadium' ? '🏟️' : point.flag;
    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 22 })
      .setLngLat(point.coordinates)
      .setHTML(`<strong>${icon} ${label}</strong><br><span>${point.city || point.location || point.description || ''}</span>`)
      .addTo(map);
    activePopups.push(popup);
  });
}

function animateRouteIcon(routeId) {
  const route = routeDefinitions.find((item) => item.id === routeId);
  if (!route) return;
  const el = document.createElement('div');
  el.className = 'route-icon';
  el.textContent = route.transport === 'flight' ? '✈️' : '🚗';
  movingMarker = new maplibregl.Marker({ element: el }).setLngLat(route.start).addTo(map);
  const coords = route.feature.geometry.coordinates;
  const startTime = performance.now();
  const duration = route.transport === 'flight' ? 4200 : 2800;
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const coord = coords[Math.floor(progress * (coords.length - 1))];
    movingMarker.setLngLat(coord);
    if (progress < 1) animationFrameId = requestAnimationFrame(step);
  };
  animationFrameId = requestAnimationFrame(step);
}

function nextScene() { goToScene(currentSceneIndex + 1, { preservePlayback: true }); }
function previousScene() { goToScene(currentSceneIndex - 1, { preservePlayback: true }); }

function togglePlayPause() {
  if (isPlaying) { isPlaying = false; isPaused = true; clearTimers(); }
  else { isPlaying = true; isPaused = false; scheduleNextScene(); }
  updateControls();
}

function restartStory() {
  isPlaying = false;
  isPaused = false;
  goToScene(0, { instant: false, preservePlayback: false });
}

function scheduleNextScene() {
  clearTimers();
  sceneTimer = window.setTimeout(() => {
    if (currentSceneIndex < scenes.length - 1) nextScene();
    else { isPlaying = false; isPaused = false; updateControls(); }
  }, sceneDuration);
}

function updateControls() {
  document.getElementById('scene-counter').textContent = `Scene ${currentSceneIndex + 1} / ${scenes.length}`;
  const playPause = document.getElementById('play-pause-button');
  playPause.textContent = isPlaying ? 'Pause' : 'Play';
  playPause.setAttribute('aria-label', isPlaying ? 'Pause story' : 'Play story');
  playPause.title = isPlaying ? 'Pause story' : 'Play story';
  document.getElementById('prev-button').disabled = currentSceneIndex === 0;
  document.getElementById('next-button').disabled = currentSceneIndex === scenes.length - 1;
}

function buildProgressDots() {
  const dots = document.getElementById('progress-dots');
  dots.innerHTML = '';
  scenes.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'progress-dot';
    dot.type = 'button';
    dot.title = `Go to scene ${index + 1}`;
    dot.setAttribute('aria-label', `Go to scene ${index + 1}`);
    dot.addEventListener('click', () => goToScene(index, { preservePlayback: true }));
    dots.appendChild(dot);
  });
}

function updateProgressDots() {
  document.querySelectorAll('.progress-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSceneIndex);
  });
}

function clearTimers() { if (sceneTimer) { window.clearTimeout(sceneTimer); sceneTimer = null; } }
function clearAnimations() {
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
  if (movingMarker) { movingMarker.remove(); movingMarker = null; }
}
function clearPopups() { activePopups.forEach((popup) => popup.remove()); activePopups = []; }

initData();
bootMap();
