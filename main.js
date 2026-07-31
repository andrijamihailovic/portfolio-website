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

const field = document.getElementById('field');
const stage = document.getElementById('stage');
const coordsEl = document.getElementById('coords');
const clockEl = document.getElementById('clock');
const shuffleBtn = document.getElementById('shuffle');
const panel = document.getElementById('panel');
const panelClose = document.getElementById('panel-close');
const pencilBtn = document.getElementById('pencil-tool');
const drawCanvas = document.getElementById('draw-canvas');
const cornerName = document.getElementById('corner-name');

const COLS = 20;
const ROWS = 12;
const MOBILE = () => window.innerWidth <= 768;

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
  resizeGrid();
  layoutBlocks();
  if (!MOBILE()) fitToView();
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
    resizeGrid();
    layoutBlocks();
    resizeDrawCanvas();
    if (!MOBILE()) fitToView();
  });
});

function getCell() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell')) || 52;
}

function resizeGrid() {
  const hud = 36;
  const pad = 16;
  const mobile = MOBILE();

  if (mobile) {
    document.documentElement.style.setProperty('--cell', '42px');
    document.documentElement.style.setProperty('--cols', 8);
    document.documentElement.style.setProperty('--rows', 1);
    return;
  }

  const cellW = (window.innerWidth - pad) / COLS;
  const cellH = (window.innerHeight - hud - pad) / ROWS;
  const cell = Math.floor(Math.min(cellW, cellH));

  document.documentElement.style.setProperty('--cell', `${cell}px`);
  document.documentElement.style.setProperty('--cols', COLS);
  document.documentElement.style.setProperty('--rows', ROWS);
}

function layoutBlocks() {
  const cell = getCell();
  const mobile = MOBILE();
  const blocks = [...field.querySelectorAll('.block')];

  if (mobile) {
    const gap = 10;
    let y = 0;
    const colWidths = [0.55, 0.4, 0.48, 0.52, 0.45, 0.5, 0.42, 0.48, 0.55, 0.46, 0.5];

    blocks.forEach((block, i) => {
      const wRatio = colWidths[i % colWidths.length];
      const aspect = block.classList.contains('block-img') ? 1.1 : 0.85;
      const w = Math.min(window.innerWidth - 24, window.innerWidth * wRatio);
      const h = block.classList.contains('block-marquee') ? 32 : w / aspect;
      const offsetX = (i % 3 - 1) * 14;

      block.style.left = `${12 + offsetX}px`;
      block.style.top = `${y}px`;
      block.style.width = `${w}px`;
      block.style.height = `${h}px`;
      block.style.zIndex = 5 + (i % 8);
      block.style.transform = `rotate(${(i % 5 - 2) * 0.8}deg)`;

      y += h + gap - (i % 4) * 8;
    });

    field.style.height = `${y + 40}px`;
    return;
  }

  blocks.forEach(block => {
    const col = +block.dataset.col;
    const row = +block.dataset.row;
    const w = +block.dataset.w;
    const h = +block.dataset.h;
    const ox = +(block.dataset.ox || 0);
    const oy = +(block.dataset.oy || 0);
    const rot = +(block.dataset.rot || 0);
    const z = +(block.dataset.z || 1);

    block.style.left = `${(col - 1) * cell + ox}px`;
    block.style.top = `${(row - 1) * cell + oy}px`;
    block.style.width = `${w * cell}px`;
    block.style.height = `${h * cell}px`;
    block.style.zIndex = z;
    block.style.transform = `rotate(${rot}deg)`;
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
  if (fw > vw || fh > vh) scale = Math.min(vw / fw, vh / fh) * 0.98;
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
  coordsEl.textContent = `${panX.toFixed(0).padStart(3, '0')} / ${panY.toFixed(0).padStart(3, '0')}`;
}

function initPan() {
  stage.addEventListener('pointerdown', e => {
    if (drawMode) return;
    if (e.target.closest('.block-img') || e.target.closest('.block-portrait') ||
        e.target.closest('.panel') || e.target.closest('.hud-shuffle') ||
        e.target.closest('.pencil-tool') || e.target.closest('.corner-name') ||
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

  stage.addEventListener('wheel', e => {
    if (drawMode || MOBILE()) return;
    e.preventDefault();
    const prev = scale;
    scale = Math.min(1.12, Math.max(0.88, scale + (e.deltaY > 0 ? -0.03 : 0.03)));
    panX *= scale / prev;
    panY *= scale / prev;
    applyTransform();
  }, { passive: false });
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

function openPanel(projectId) {
  const p = projects[projectId];
  if (!p) return;
  document.getElementById('panel-tag').textContent = p.tag;
  document.getElementById('panel-title').textContent = p.title;
  document.getElementById('panel-text').textContent = p.text;
  const link = document.getElementById('panel-link');
  link.hidden = !p.link;
  if (p.link) link.href = p.link;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function initPanel() {
  document.querySelectorAll('.block-img[data-project]').forEach(block => {
    block.addEventListener('click', e => {
      if (drawMode) return;
      e.stopPropagation();
      e.preventDefault();
      openPanel(parseInt(block.dataset.project, 10));
    });
  });

  panelClose.addEventListener('click', closePanel);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!MOBILE()) {
      panX = 0;
      panY = 0;
      fitToView();
    }
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
      layoutBlocks();
      return;
    }

    field.classList.add('shuffling');

    field.querySelectorAll('.block-img, .block-portrait').forEach(block => {
      const w = +block.dataset.w;
      const h = +block.dataset.h;
      block.dataset.col = 4 + Math.floor(Math.random() * (COLS - w - 4));
      block.dataset.row = 2 + Math.floor(Math.random() * (ROWS - h - 2));
      block.dataset.ox = Math.floor(Math.random() * 24 - 12);
      block.dataset.oy = Math.floor(Math.random() * 24 - 12);
      block.dataset.rot = ((Math.random() - 0.5) * 5).toFixed(1);
      block.dataset.z = 5 + Math.floor(Math.random() * 12);
    });

    layoutBlocks();
    setTimeout(() => field.classList.remove('shuffling'), 600);
  });
}

function initDraw() {
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

  pencilBtn.addEventListener('click', () => toggleDraw(!drawMode));

  document.addEventListener('pointermove', e => {
    if (!drawMode) return;
    pencilEl.style.left = `${e.clientX}px`;
    pencilEl.style.top = `${e.clientY}px`;
  });

  drawCanvas.addEventListener('pointerdown', e => {
    if (!drawMode) return;
    drawing = true;
    const { x, y } = canvasPoint(e);
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
    drawCanvas.setPointerCapture(e.pointerId);
  });

  drawCanvas.addEventListener('pointermove', e => {
    if (!drawing || !drawMode) return;
    const { x, y } = canvasPoint(e);
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
    pencilEl.style.left = `${e.clientX}px`;
    pencilEl.style.top = `${e.clientY}px`;
  });

  drawCanvas.addEventListener('pointerup', () => { drawing = false; });
}

function canvasPoint(e) {
  const rect = drawCanvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function resizeDrawCanvas() {
  const rect = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  drawCanvas.width = rect.width * dpr;
  drawCanvas.height = rect.height * dpr;
  drawCanvas.style.width = `${rect.width}px`;
  drawCanvas.style.height = `${rect.height}px`;
  if (drawCtx) {
    drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.strokeStyle = '#0a0a0a';
    drawCtx.lineWidth = 2;
  }
}

function toggleDraw(on) {
  drawMode = on;
  document.body.classList.toggle('draw-mode', on);
  pencilBtn.classList.toggle('active', on);
  if (on) closePanel();
}
