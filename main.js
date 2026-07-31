const projects = {
  0: { tag: 'object', title: 'Throat Sprayer', text: 'Rugged concept for TaticDesign Milano.', link: 'https://www.instagram.com/p/Cmg_0dHtkSv/?img_index=6' },
  1: { tag: 'research', title: 'Coffee → Mushrooms', text: 'Coffee waste recycled into mushroom substrates. BA thesis.', link: 'https://repozitorij.uni-lj.si/IzpisGradiva.php?id=140616' },
  2: { tag: 'architecture', title: 'PANJ Glamping', text: 'Beekeeping-inspired glamping with parametric privacy wall.' },
  3: { tag: 'system', title: 'Planty Bottle', text: 'Returnable glass bottle for plant-based milk.', link: 'https://glassberriesawards.com/the-glassberries/' },
  4: { tag: 'research', title: 'Mycelium Panels', text: 'Insulation from mycelium and raw wool. Berlin.', link: 'https://zur-nachahmung-empfohlen.de/workshop-rohwolle/' },
  5: { tag: 'platform', title: 'Kaslc', text: 'Farmers selling direct to customers.', link: 'https://multidisciplinaren.si/posts/2022-projekt-digitalizacija-kmetij/PREDSTAVITVE/2023_kaslc.pdf' },
  9: { tag: 'packaging', title: 'Drožjar', text: 'Sourdough starter kit packaging.' },
  12: { tag: 'graphic', title: 'TOZD Bar', text: 'Identity for Ljubljana bar.', link: 'https://www.instagram.com/tozdbar/' },
  13: { tag: 'graphic', title: 'Isa Kombucha', text: '90s merch for kombucha brand.' },
  14: { tag: 'graphic', title: 'Lelee Band', text: 'Posters and promo photos.', link: 'https://leleeband.com/photos/press' },
  15: { tag: 'film', title: 'Zbornica VFX', text: 'Digital screens for The Staff Room.', link: 'https://www.imdb.com/news/ni63702656/' }
};

/* Sparse — corners for text, images in middle bands with gaps */
const SPREAD = [
  [3, 2],   // 0 name — top-left
  [19, 2],  // 1 note — top-right
  [3, 9],   // 2 list — bottom-left
  [19, 9],  // 3 contact — bottom-right
  [3, 5],   // 4 portrait — mid-left
  [19, 5],  // 5 scribble — mid-right
  [8, 11],  // 6 marquee — bottom center
  [7, 2],   // 7–17 images — three bands across center
  [11, 2],
  [15, 2],
  [7, 5],
  [11, 5],
  [15, 5],
  [7, 8],
  [11, 8],
  [15, 8],
  [17, 8],
];

const SPREAD_ALT = [
  [2, 2], [18, 2], [2, 8], [18, 8], [2, 5], [18, 5], [7, 11],
  [5, 2], [9, 2], [13, 2], [17, 2], [5, 5], [9, 5], [13, 5],
  [5, 8], [9, 8], [13, 8], [17, 8]
];

const field = document.getElementById('field');
const stage = document.getElementById('stage');
const coordsEl = document.getElementById('coords');
const clockEl = document.getElementById('clock');
const shuffleBtn = document.getElementById('shuffle');
const panel = document.getElementById('panel');
const panelClose = document.getElementById('panel-close');

const COLS = 22;
const ROWS = 12;
let panX = 0;
let panY = 0;
let scale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let velX = 0;
let velY = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let layoutIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  resizeGrid();
  placeBlocks(SPREAD);
  fitToView();
  initPan();
  initPanel();
  initClock();
  initShuffle();
  startInertia();
  window.addEventListener('resize', () => {
    resizeGrid();
    fitToView();
  });
});

function resizeGrid() {
  const hud = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hud-h')) || 36;
  const pad = 20;
  const cols = window.innerWidth < 768 ? 14 : COLS;
  const rows = window.innerWidth < 768 ? 18 : ROWS;

  const cellW = (window.innerWidth - pad) / cols;
  const cellH = (window.innerHeight - hud - pad) / rows;
  const cell = Math.floor(Math.min(cellW, cellH));

  document.documentElement.style.setProperty('--cell', `${cell}px`);
  document.documentElement.style.setProperty('--cols', cols);
  document.documentElement.style.setProperty('--rows', rows);
}

function placeBlocks(positions) {
  field.querySelectorAll('.block').forEach((block, i) => {
    const [col, row] = positions[i];
    block.style.gridColumn = `${col} / span ${block.dataset.w}`;
    block.style.gridRow = `${row} / span ${block.dataset.h}`;
  });
}

function fitToView() {
  panX = 0;
  panY = 0;
  scale = 1;

  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const fw = field.offsetWidth;
  const fh = field.offsetHeight;

  if (fw > vw || fh > vh) {
    scale = Math.min(vw / fw, vh / fh);
  }

  clampPan();
  applyTransform();
}

function clampPan() {
  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const fw = field.offsetWidth * scale;
  const fh = field.offsetHeight * scale;

  const maxX = Math.max(0, (fw - vw) / 2) + 16;
  const maxY = Math.max(0, (fh - vh) / 2) + 16;

  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
}

function applyTransform() {
  clampPan();
  field.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  coordsEl.textContent = `${panX.toFixed(0).padStart(3, '0')} / ${panY.toFixed(0).padStart(3, '0')}`;
}

function initPan() {
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.block-img') || e.target.closest('.block-portrait') ||
        e.target.closest('.panel') || e.target.closest('.hud-shuffle') || e.target.closest('a')) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    velX = 0;
    velY = 0;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    velX = e.clientX - lastPointerX;
    velY = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    applyTransform();
  });

  stage.addEventListener('pointerup', () => { isDragging = false; });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    const prev = scale;
    scale = Math.min(1.1, Math.max(0.9, scale + (e.deltaY > 0 ? -0.03 : 0.03)));
    panX *= scale / prev;
    panY *= scale / prev;
    applyTransform();
  }, { passive: false });
}

function startInertia() {
  function tick() {
    if (!isDragging && (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1)) {
      panX += velX;
      panY += velY;
      velX *= 0.85;
      velY *= 0.85;
      applyTransform();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

function initPanel() {
  document.querySelectorAll('.block-img[data-project]').forEach(block => {
    block.addEventListener('click', e => {
      e.stopPropagation();
      const p = projects[parseInt(block.dataset.project, 10)];
      if (!p) return;
      document.getElementById('panel-tag').textContent = p.tag;
      document.getElementById('panel-title').textContent = p.title;
      document.getElementById('panel-text').textContent = p.text;
      const link = document.getElementById('panel-link');
      link.hidden = !p.link;
      if (p.link) link.href = p.link;
      panel.classList.add('open');
    });
  });
  panelClose.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.classList.remove('open'); });
}

function initClock() {
  const tick = () => {
    clockEl.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}

function initShuffle() {
  shuffleBtn.addEventListener('click', () => {
    layoutIndex = 1 - layoutIndex;
    field.classList.add('shuffling');
    placeBlocks(layoutIndex ? SPREAD_ALT : SPREAD);
    panX = 0;
    panY = 0;
    fitToView();
    setTimeout(() => field.classList.remove('shuffling'), 600);
  });
}
