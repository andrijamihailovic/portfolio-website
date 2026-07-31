const projects = {
  0: {
    tag: 'object',
    title: 'Throat Sprayer — TaticDesign Milano',
    text: 'The focus was ideation, form development and design detailing for realistic project requirements. Alternative rugged design for army and military use of throat spray, developed with Urh Furlanič.',
    link: 'https://www.instagram.com/p/Cmg_0dHtkSv/?img_index=6'
  },
  1: {
    tag: 'research',
    title: 'Coffee Waste Management',
    text: 'Research into unregulated waste separation in catering and recycling coffee waste into substrates for growing nutritious and medicinal mushrooms. BA thesis project.',
    link: 'https://repozitorij.uni-lj.si/IzpisGradiva.php?id=140616'
  },
  2: {
    tag: 'architecture',
    title: 'PANJ Glamping House',
    text: 'A glamping experience inspired by Slovenian beekeeping. Parametric wall allows privacy with controlled morning sun views. Surrounded by greenery that attracts bees.'
  },
  3: {
    tag: 'system',
    title: 'Planty — Returnable System',
    text: 'Modern twist on traditional milk bottle design for plant-based milk. Returnable service at local coffee shops — circular economy, pure taste in glass.',
    link: 'https://glassberriesawards.com/the-glassberries/'
  },
  4: {
    tag: 'research',
    title: 'Mycelium Panels',
    text: 'Sustainable insulation and acoustic panels grown from mycelium and raw wool. Workshop at Matters of Activity, Berlin with Folke Köbberling and team.',
    link: 'https://zur-nachahmung-empfohlen.de/workshop-rohwolle/'
  },
  5: {
    tag: 'platform',
    title: 'Kaslc',
    text: 'Solution for farmers to sell produce directly to end customers — inspired by the milking machine. MA thesis WIP with Esma Hajderpasić.',
    link: 'https://multidisciplinaren.si/posts/2022-projekt-digitalizacija-kmetij/PREDSTAVITVE/2023_kaslc.pdf'
  },
  9: {
    tag: 'packaging',
    title: 'Sourdough Starter-Kit — Drožjar',
    text: 'Packaging that communicates effortless sourdough baking. Glazed print symbolizes water; inner opening mimics a fresh bag of flour.'
  },
  12: {
    tag: 'graphic',
    title: 'TOZD Bar',
    text: 'Unified graphic design for a new bar in Ljubljana — inox, plexiglass, menus, garments, coasters, stickers across all touchpoints.',
    link: 'https://www.instagram.com/tozdbar/'
  },
  13: {
    tag: 'graphic',
    title: 'Isa Kombucha',
    text: 'Merchandise with vibrant 90s graphic t-shirt feel for a local kombucha brand. Pop color balanced with Times New Roman.'
  },
  14: {
    tag: 'graphic',
    title: 'Lelee Band',
    text: 'Studio photos and expressive posters with photographer Andraž Fijavž Bačovnik for band promotion.',
    link: 'https://leleeband.com/photos/press'
  },
  15: {
    tag: 'film',
    title: 'The Staff Room — Zbornica',
    text: 'Visual effects and animated digital screens throughout the European hit film. Karlovy Vary Crystal Globe and Pula Film Festival award winner.',
    link: 'https://www.imdb.com/news/ni63702656/'
  }
};

/* Mobile collage: align + width ratio per block for natural scatter */
const MOBILE_LAYOUT = [
  { align: 'center', w: 0.78, aspect: 0.9 },
  { align: 'right', w: 0.52, aspect: 1.0 },
  { align: 'left', w: 0.58, aspect: 0.95 },
  { align: 'center', w: 0.65, aspect: 0.88 },
  { align: 'left', w: 0.48, aspect: 1.15 },
  { align: 'right', w: 0.72, aspect: 0.85 },
  { align: 'center', w: 0.88, aspect: 0.2, marquee: true },
  { align: 'right', w: 0.56, aspect: 1.05 },
  { align: 'center', w: 0.82, aspect: 0.75 },
  { align: 'left', w: 0.54, aspect: 1.1 },
  { align: 'right', w: 0.68, aspect: 0.92 },
  { align: 'center', w: 0.5, aspect: 1.0 },
  { align: 'left', w: 0.74, aspect: 0.8 },
  { align: 'right', w: 0.6, aspect: 1.05 },
  { align: 'center', w: 0.86, aspect: 0.7 },
  { align: 'left', w: 0.52, aspect: 1.0 },
  { align: 'right', w: 0.7, aspect: 0.88 },
  { align: 'center', w: 0.58, aspect: 1.12 }
];

const field = document.getElementById('field');
const stage = document.getElementById('stage');
const clockEl = document.getElementById('clock');
const shuffleBtn = document.getElementById('shuffle');
const panel = document.getElementById('panel');
const panelClose = document.getElementById('panel-close');
const panelProject = document.getElementById('panel-project');
const panelAbout = document.getElementById('panel-about');
const panelImage = document.getElementById('panel-image');
const panelImageImg = document.getElementById('panel-image-img');
const panelImageCaption = document.getElementById('panel-image-caption');
const panelImageClose = document.getElementById('panel-image-close');
const pencilBtn = document.getElementById('pencil-tool');
const eraserBtn = document.getElementById('eraser-tool');
const drawCanvas = document.getElementById('draw-canvas');
const cornerName = document.getElementById('corner-name');
const gridLayer = document.getElementById('grid-layer');
const marginLine = document.querySelector('.margin-line');

const COLS = 20;
const ROWS = 12;
const GRID_RATIO = 1.45;
const PROJECT_BOOST = 1.35;
const MAX_OVERLAP = 0.24;
const ROW_BANDS = [
  { min: 1, max: 4 },
  { min: 4, max: 8 },
  { min: 8, max: ROWS + 1 }
];
const MOBILE = () => window.innerWidth <= 768;

function randomCol(w) {
  return 2 + Math.floor(Math.random() * Math.max(1, COLS - w - 2));
}

function randomRow(h, band = null) {
  const lo = band ? band.min : 1;
  const hi = band ? Math.min(band.max, ROWS - h + 1) : ROWS - h + 1;
  return lo + Math.floor(Math.random() * Math.max(1, hi - lo));
}

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
let drawMode = false;
let drawing = false;
let drawCtx = null;
let pencilEl = null;

document.addEventListener('DOMContentLoaded', () => {
  init();
  initPan();
  initPanel();
  initClock();
  initShuffle();
  initDraw();
  initCornerName();
  startInertia();

  field.querySelectorAll('.block-img').forEach((b, i) => {
    if (i % 2 === 0) b.classList.add('floaty');
  });

  window.addEventListener('resize', () => {
    if (MOBILE() && drawMode) toggleDraw(false);
    init(true, true);
  });
});

function randomizeMarquee(cellW, cellH) {
  const marquee = field.querySelector('.block-marquee');
  if (!marquee || MOBILE()) return;
  const bottomBand = { min: 9, max: ROWS + 1 };
  randomPlacement(marquee, cellW, cellH, [], bottomBand);
}

function init(preserveDrawing = false, skipMarquee = false) {
  resizeGrid();
  if (!MOBILE() && !skipMarquee) {
    randomizeMarquee(getCellW(), getCellH());
  }
  layoutBlocks();
  resizeDrawCanvas(preserveDrawing);
  if (!MOBILE()) {
    fitToView();
    avoidCornerOverlap();
    applyTransform();
  } else {
    syncViewportGrid();
  }
}

function layoutBlocksMobileShuffled() {
  let y = 0;
  const gap = 18;
  const blocks = [...field.querySelectorAll('.block')];

  blocks.forEach((block, i) => {
    const orderIdx = parseInt(block.dataset.mobileOrder ?? i, 10);
    const cfg = MOBILE_LAYOUT[orderIdx % MOBILE_LAYOUT.length];
    const width = Math.round((window.innerWidth - 32) * cfg.w * (block.classList.contains('block-img') ? PROJECT_BOOST : 1));
    const height = cfg.marquee ? 28 : Math.round(width / cfg.aspect);
    const left = mobileLeft(width, cfg.align);
    const rot = ((orderIdx * 7 + 3) % 11 - 5) * 0.35;

    block.style.left = `${left}px`;
    block.style.top = `${y}px`;
    block.style.width = `${width}px`;
    block.style.height = `${height}px`;
    block.style.zIndex = 5 + (i % 10);
    block.style.transform = `rotate(${rot}deg)`;

    y += height + gap - (i % 3) * 6;
  });

  field.style.height = `${y + 60}px`;
}

function getCellW() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-w')) || 64;
}

function getCellH() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-h')) || 44;
}

function resizeGrid() {
  const hud = 36;
  const pad = 16;

  if (MOBILE()) {
    document.documentElement.style.setProperty('--cell-w', '58px');
    document.documentElement.style.setProperty('--cell-h', '40px');
    document.documentElement.style.setProperty('--cols', '8');
    document.documentElement.style.setProperty('--rows', '1');
    return;
  }

  let cellH = Math.floor((window.innerHeight - hud - pad) / ROWS);
  let cellW = Math.floor(cellH * GRID_RATIO);
  const maxW = Math.floor((window.innerWidth - pad) / COLS);

  if (cellW > maxW) {
    cellW = maxW;
    cellH = Math.floor(cellW / GRID_RATIO);
  }

  document.documentElement.style.setProperty('--cell-w', `${cellW}px`);
  document.documentElement.style.setProperty('--cell-h', `${cellH}px`);
  document.documentElement.style.setProperty('--cols', String(COLS));
  document.documentElement.style.setProperty('--rows', String(ROWS));
}

function syncViewportGrid() {
  if (!gridLayer) return;

  if (MOBILE()) {
    const cellW = getCellW();
    const cellH = getCellH();
    document.documentElement.style.setProperty('--grid-x', '0px');
    document.documentElement.style.setProperty('--grid-y', '0px');
    document.documentElement.style.setProperty('--grid-cell-w', `${cellW}px`);
    document.documentElement.style.setProperty('--grid-cell-h', `${cellH}px`);
    if (marginLine) marginLine.style.left = `${cellW * 2 + 6}px`;
    return;
  }

  const hud = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hud-h')) || 36;
  const cellW = getCellW() * scale;
  const cellH = getCellH() * scale;
  const rect = field.getBoundingClientRect();

  document.documentElement.style.setProperty('--grid-x', `${rect.left}px`);
  document.documentElement.style.setProperty('--grid-y', `${rect.top - hud}px`);
  document.documentElement.style.setProperty('--grid-cell-w', `${cellW}px`);
  document.documentElement.style.setProperty('--grid-cell-h', `${cellH}px`);

  if (marginLine) {
    marginLine.style.left = `${rect.left + cellW * 2 + 6}px`;
  }
}

function mobileLeft(width, align) {
  const margin = 16;
  const maxW = window.innerWidth - margin * 2;

  if (align === 'center') return margin + (maxW - width) / 2;
  if (align === 'right') return window.innerWidth - margin - width;
  return margin;
}

function layoutBlocks() {
  const cellW = getCellW();
  const cellH = getCellH();
  const blocks = [...field.querySelectorAll('.block')];

  if (MOBILE()) {
    layoutBlocksMobileShuffled();
    return;
  }

  field.style.height = '';
  field.style.width = '';

  blocks.forEach(block => {
    const col = +block.dataset.col;
    const row = +block.dataset.row;
    const w = +block.dataset.w;
    const h = +block.dataset.h;
    const ox = +(block.dataset.ox || 0);
    const oy = +(block.dataset.oy || 0);
    const rot = +(block.dataset.rot || 0);
    const z = +(block.dataset.z || 1);
    const boost = block.classList.contains('block-img') ? PROJECT_BOOST : 1;

    const baseW = w * cellW;
    const baseH = h * cellH;
    const bw = baseW * boost;
    const bh = baseH * boost;
    const bx = (col - 1) * cellW + ox - (bw - baseW) / 2;
    const by = (row - 1) * cellH + oy - (bh - baseH) / 2;

    block.style.left = `${bx}px`;
    block.style.top = `${by}px`;
    block.style.width = `${bw}px`;
    block.style.height = `${bh}px`;
    block.style.zIndex = z;
    block.style.transform = `rotate(${rot}deg)`;
  });
}

function blockRect(block, cellW, cellH) {
  const col = +block.dataset.col;
  const row = +block.dataset.row;
  const w = +block.dataset.w;
  const h = +block.dataset.h;
  const ox = +(block.dataset.ox || 0);
  const oy = +(block.dataset.oy || 0);
  const boost = block.classList.contains('block-img') ? PROJECT_BOOST : 1;
  const baseW = w * cellW;
  const baseH = h * cellH;
  const bw = baseW * boost;
  const bh = baseH * boost;
  const bx = (col - 1) * cellW + ox - (bw - baseW) / 2;
  const by = (row - 1) * cellH + oy - (bh - baseH) / 2;
  return { left: bx, top: by, width: bw, height: bh, right: bx + bw, bottom: by + bh, area: bw * bh };
}

function overlapArea(a, b) {
  const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return w * h;
}

function projectOverlapOk(rect, placed) {
  for (const other of placed) {
    const overlap = overlapArea(rect, other);
    const limit = Math.min(rect.area, other.area) * MAX_OVERLAP;
    if (overlap > limit) return false;
  }
  return true;
}

function cornerKeepOutRect() {
  if (!cornerName) return null;
  const r = cornerName.getBoundingClientRect();
  const pad = 20;
  return { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, area: 1 };
}

function blockViewportRect(block, cellW, cellH) {
  const local = blockRect(block, cellW, cellH);
  const fr = field.getBoundingClientRect();
  const fw = field.offsetWidth || 1;
  const fh = field.offsetHeight || 1;
  const sx = fr.width / fw;
  const sy = fr.height / fh;
  return {
    left: fr.left + local.left * sx,
    top: fr.top + local.top * sy,
    right: fr.left + local.right * sx,
    bottom: fr.top + local.bottom * sy,
    area: local.area * sx * sy
  };
}

function hitsCornerName(block, cellW, cellH) {
  const keep = cornerKeepOutRect();
  if (!keep) return false;
  return overlapArea(blockViewportRect(block, cellW, cellH), keep) > 0;
}

function avoidCornerOverlap() {
  if (MOBILE()) return;
  const cellW = getCellW();
  const cellH = getCellH();
  let moved = false;

  field.querySelectorAll('.block').forEach(block => {
    for (let i = 0; i < 24 && hitsCornerName(block, cellW, cellH); i++) {
      if (+block.dataset.col < COLS - +block.dataset.w) {
        block.dataset.col = String(+block.dataset.col + 1);
      } else if (+block.dataset.row < ROWS - +block.dataset.h) {
        block.dataset.row = String(+block.dataset.row + 1);
      }
      moved = true;
    }
  });

  if (moved) layoutBlocks();
}

function randomPlacement(block, cellW, cellH, placedProjects, band = null, maxAttempts = 100) {
  const w = +block.dataset.w;
  const h = +block.dataset.h;
  const isProject = block.classList.contains('block-img');

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    block.dataset.col = String(randomCol(w));
    block.dataset.row = String(randomRow(h, band));
    block.dataset.ox = String(Math.floor(Math.random() * 20 - 10));
    block.dataset.oy = String(Math.floor(Math.random() * 20 - 10));
    block.dataset.rot = ((Math.random() - 0.5) * 4).toFixed(1);
    block.dataset.z = String(5 + Math.floor(Math.random() * 12));

    if (hitsCornerName(block, cellW, cellH)) continue;

    if (isProject) {
      const rect = blockRect(block, cellW, cellH);
      if (!projectOverlapOk(rect, placedProjects)) continue;
    }

    return true;
  }

  if (isProject) {
    block.dataset.ox = '0';
    block.dataset.oy = '0';
  }
  return true;
}

function fitToView() {
  panX = 0;
  panY = 0;
  scale = 1;

  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const fw = field.offsetWidth;
  const fh = field.offsetHeight;

  if (!fw || !fh) {
    requestAnimationFrame(fitToView);
    return;
  }

  if (fw > vw || fh > vh) {
    scale = Math.min(vw / fw, vh / fh) * 0.98;
  }

  clampPan();
  applyTransform();
}

function clampPan() {
  if (MOBILE()) return;
  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const fw = field.offsetWidth * scale;
  const fh = field.offsetHeight * scale;
  const maxX = Math.max(0, (fw - vw) / 2) + 20;
  const maxY = Math.max(0, (fh - vh) / 2) + 20;
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
}

function applyTransform() {
  clampPan();
  field.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  syncViewportGrid();
}

function initPan() {
  stage.addEventListener('pointerdown', e => {
    if (drawMode) return;
    if (e.target.closest('.block-img') || e.target.closest('.block-portrait') ||
        e.target.closest('.panel') || e.target.closest('.hud-shuffle') ||
        e.target.closest('.draw-tools') || e.target.closest('.corner-name') ||
        e.target.closest('a')) return;
    if (MOBILE()) return;

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
    if (drawMode || !isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    velX = e.clientX - lastPointerX;
    velY = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    applyTransform();
  });

  stage.addEventListener('pointerup', () => { isDragging = false; });
}

function startInertia() {
  function tick() {
    if (!MOBILE() && !isDragging && !drawMode && (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1)) {
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

function openAboutPanel() {
  panelProject.hidden = true;
  panelAbout.hidden = false;
  panel.classList.add('open');
  panel.classList.add('panel--about');
  panel.setAttribute('aria-hidden', 'false');
  closeImagePanel();
}

function openProjectPanel(projectId, imgSrc, caption) {
  const p = projects[projectId];
  if (!p) return;
  panelAbout.hidden = true;
  panelProject.hidden = false;
  panel.classList.remove('panel--about');
  document.getElementById('panel-tag').textContent = p.tag;
  document.getElementById('panel-title').textContent = p.title;
  document.getElementById('panel-text').textContent = p.text;
  const link = document.getElementById('panel-link');
  link.hidden = !p.link;
  if (p.link) link.href = p.link;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');

  if (panelImage && panelImageImg && imgSrc) {
    panelImageImg.src = imgSrc;
    panelImageImg.alt = p.title;
    if (panelImageCaption) panelImageCaption.textContent = caption || p.title;
    panelImage.classList.add('open');
    panelImage.setAttribute('aria-hidden', 'false');
  }
}

function closeImagePanel() {
  if (!panelImage) return;
  panelImage.classList.remove('open');
  panelImage.setAttribute('aria-hidden', 'true');
}

function closePanel() {
  panel.classList.remove('open');
  panel.classList.remove('panel--about');
  panel.setAttribute('aria-hidden', 'true');
  closeImagePanel();
}

function initPanel() {
  document.querySelectorAll('.block-img[data-project]').forEach(block => {
    block.addEventListener('click', e => {
      if (drawMode) return;
      e.stopPropagation();
      e.preventDefault();
      const img = block.querySelector('img');
      const caption = block.querySelector('.caption')?.textContent?.trim();
      openProjectPanel(
        parseInt(block.dataset.project, 10),
        img?.src,
        caption
      );
    });
  });

  panelClose.addEventListener('click', closePanel);
  if (panelImageClose) panelImageClose.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePanel();
      if (drawMode) toggleDraw(false);
    }
  });
}

function initCornerName() {
  cornerName.addEventListener('click', e => {
    e.preventDefault();
    if (drawMode) toggleDraw(false);
    openAboutPanel();
  });
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
    if (MOBILE()) {
      const blocks = [...field.querySelectorAll('.block')];
      const order = blocks.map((_, i) => i).sort(() => Math.random() - 0.5);
      blocks.forEach((block, i) => {
        block.dataset.mobileOrder = order[i];
      });
      layoutBlocksMobileShuffled();
      return;
    }

    field.classList.add('shuffling');
    const cellW = getCellW();
    const cellH = getCellH();
    const placedProjects = [];

    const infoBlocks = [...field.querySelectorAll('.block-note, .block-list, .block-portrait, .block-contact, .block-marquee')]
      .sort(() => Math.random() - 0.5);
    const projectBlocks = [...field.querySelectorAll('.block-img')].sort(() => Math.random() - 0.5);
    const bands = [...ROW_BANDS].sort(() => Math.random() - 0.5);
    const bottomBand = { min: 9, max: ROWS + 1 };

    infoBlocks.forEach(block => {
      const band = block.classList.contains('block-marquee') ? bottomBand : null;
      randomPlacement(block, cellW, cellH, placedProjects, band);
    });

    projectBlocks.forEach((block, i) => {
      randomPlacement(block, cellW, cellH, placedProjects, bands[i % bands.length]);
      placedProjects.push(blockRect(block, cellW, cellH));
    });

    layoutBlocks();
    fitToView();
    avoidCornerOverlap();
    applyTransform();
    setTimeout(() => field.classList.remove('shuffling'), 600);
  });
}

function initDraw() {
  if (MOBILE() || !drawCanvas || !pencilBtn || !eraserBtn) return;

  pencilEl = document.createElement('div');
  pencilEl.className = 'pencil-cursor';
  pencilEl.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 21l3.75-1 11-11-2.75-2.75-11 11L3 21z" fill="none" stroke="#0a0a0a" stroke-width="1.5"/><path d="M14 4l2.75 2.75" fill="none" stroke="#0a0a0a" stroke-width="1.5"/></svg>';
  document.body.appendChild(pencilEl);

  drawCtx = drawCanvas.getContext('2d');
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.strokeStyle = '#0a0a0a';
  drawCtx.lineWidth = 2;
  resizeDrawCanvas();

  pencilBtn.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    toggleDraw(!drawMode);
  });
  eraserBtn.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    clearDrawings();
  });
}

function drawTarget(e) {
  return e.target.closest('.draw-tools') ||
    e.target.closest('.corner-name') ||
    e.target.closest('.hud') ||
    e.target.closest('.panel');
}

function onDrawStart(e) {
  if (!drawMode || !drawCtx || drawTarget(e)) return;
  e.preventDefault();
  drawing = true;
  const { x, y } = canvasPoint(e);
  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
}

function onDrawMove(e) {
  if (!drawMode || !drawCtx) return;
  if (pencilEl) {
    pencilEl.style.left = `${e.clientX}px`;
    pencilEl.style.top = `${e.clientY}px`;
  }
  if (!drawing) return;
  e.preventDefault();
  const { x, y } = canvasPoint(e);
  drawCtx.lineTo(x, y);
  drawCtx.stroke();
}

function onDrawEnd() {
  drawing = false;
}

function setDrawListeners(on) {
  const opts = { capture: true };
  if (on) {
    document.addEventListener('pointerdown', onDrawStart, opts);
    document.addEventListener('pointermove', onDrawMove, opts);
    document.addEventListener('pointerup', onDrawEnd, opts);
    document.addEventListener('pointercancel', onDrawEnd, opts);
  } else {
    document.removeEventListener('pointerdown', onDrawStart, opts);
    document.removeEventListener('pointermove', onDrawMove, opts);
    document.removeEventListener('pointerup', onDrawEnd, opts);
    document.removeEventListener('pointercancel', onDrawEnd, opts);
  }
}

function clearDrawings() {
  if (!drawCtx || !drawCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.strokeStyle = '#0a0a0a';
  drawCtx.lineWidth = 2;
}

function canvasPoint(e) {
  const rect = drawCanvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function resizeDrawCanvas(preserve = false) {
  if (!drawCanvas) return;

  let snapshot = null;
  if (preserve && drawCtx && drawCanvas.width > 0 && drawCanvas.height > 0) {
    snapshot = drawCanvas.toDataURL();
  }

  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hud-h')) || 36);

  drawCanvas.width = w * dpr;
  drawCanvas.height = h * dpr;
  drawCanvas.style.width = `${w}px`;
  drawCanvas.style.height = `${h}px`;

  if (drawCtx) {
    drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.strokeStyle = '#0a0a0a';
    drawCtx.lineWidth = 2;

    if (snapshot) {
      const img = new Image();
      img.onload = () => drawCtx.drawImage(img, 0, 0, w, h);
      img.src = snapshot;
    }
  }
}

function toggleDraw(on) {
  drawMode = on;
  document.body.classList.toggle('draw-mode', on);
  if (pencilBtn) pencilBtn.classList.toggle('active', on);
  setDrawListeners(on);
  if (on) {
    closePanel();
    isDragging = false;
    drawing = false;
  }
}
