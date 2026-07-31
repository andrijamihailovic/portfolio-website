const projects = {
  0: { tag: 'object', title: 'Throat Sprayer', text: 'Rugged concept for TaticDesign Milano — military use case, developed with Urh Furlanič.', link: 'https://www.instagram.com/p/Cmg_0dHtkSv/?img_index=6' },
  1: { tag: 'research', title: 'Coffee → Mushrooms', text: 'Coffee waste in catering, recycled into substrates for growing medicinal mushrooms. BA thesis.', link: 'https://repozitorij.uni-lj.si/IzpisGradiva.php?id=140616' },
  2: { tag: 'architecture', title: 'PANJ Glamping', text: 'Beekeeping-inspired glamping unit with parametric privacy wall and morning sun control.' },
  3: { tag: 'system', title: 'Planty Bottle', text: 'Returnable glass bottle system for plant-based milk. Circular economy for coffee shops.', link: 'https://glassberriesawards.com/the-glassberries/' },
  4: { tag: 'research', title: 'Mycelium Panels', text: 'Self-grown insulation from mycelium and raw wool. Matters of Activity, Berlin.', link: 'https://zur-nachahmung-empfohlen.de/workshop-rohwolle/' },
  5: { tag: 'platform', title: 'Kaslc', text: 'Farmers selling direct to customers — inspired by the milking machine. MA thesis WIP.', link: 'https://multidisciplinaren.si/posts/2022-projekt-digitalizacija-kmetij/PREDSTAVITVE/2023_kaslc.pdf' },
  9: { tag: 'packaging', title: 'Drožjar', text: 'Sourdough starter kit — water + flour, that\'s it. Glazed wet-cardboard print.' },
  12: { tag: 'graphic', title: 'TOZD Bar', text: 'Holistic identity for a Ljubljana bar — inox, plexiglass, menus, garments, stickers.', link: 'https://www.instagram.com/tozdbar/' },
  13: { tag: 'graphic', title: 'Isa Kombucha', text: '90s t-shirt energy merchandise for a local kombucha brand.' },
  14: { tag: 'graphic', title: 'Lelee Band', text: 'Studio photos and posters with Andraž Fijavž Bačovnik.', link: 'https://leleeband.com/photos/press' },
  15: { tag: 'film', title: 'Zbornica VFX', text: 'Animated digital screens throughout The Staff Room. Karlovy Vary Crystal Globe.', link: 'https://www.imdb.com/news/ni63702656/' }
};

const LAYOUTS = [
  [
    [1, 1], [13, 1], [5, 1], [14, 2], [1, 4], [8, 1], [3, 9], [11, 1],
    [12, 2], [11, 5], [4, 6], [9, 2], [5, 4], [1, 7], [14, 5], [6, 6],
    [12, 7], [14, 8]
  ],
  [
    [1, 1], [12, 1], [6, 1], [14, 1], [1, 4], [9, 1], [2, 9], [11, 1],
    [7, 3], [13, 4], [3, 6], [10, 3], [5, 3], [1, 7], [14, 6], [5, 6],
    [11, 8], [13, 7]
  ]
];

const field = document.getElementById('field');
const stage = document.getElementById('stage');
const coordsEl = document.getElementById('coords');
const clockEl = document.getElementById('clock');
const cursorCross = document.getElementById('cursor-cross');
const shuffleBtn = document.getElementById('shuffle');
const panel = document.getElementById('panel');
const panelClose = document.getElementById('panel-close');

let panX = 0;
let panY = 0;
let scale = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let velX = 0;
let velY = 0;
let layoutIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  placeBlocks(LAYOUTS[0]);
  fitToView();
  initPan();
  initPanel();
  initClock();
  initCursor();
  initShuffle();
  startInertia();
  window.addEventListener('resize', () => {
    fitToView();
  });
});

function placeBlocks(positions) {
  const blocks = field.querySelectorAll('.block');
  blocks.forEach((block, i) => {
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
    scale = Math.min(vw / fw, vh / fh) * 0.98;
  }

  clampPan();
  updateTransform();
}

function clampPan() {
  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const fw = field.offsetWidth * scale;
  const fh = field.offsetHeight * scale;

  const overflowX = Math.max(0, fw - vw);
  const overflowY = Math.max(0, fh - vh);

  const maxX = overflowX > 0 ? overflowX / 2 + 12 : 28;
  const maxY = overflowY > 0 ? overflowY / 2 + 12 : 28;

  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));

  if (Math.abs(panX) > maxX) velX = 0;
  if (Math.abs(panY) > maxY) velY = 0;
}

function updateTransform() {
  clampPan();
  field.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
  coordsEl.textContent = `${panX.toFixed(0).padStart(3, '0')} / ${panY.toFixed(0).padStart(3, '0')}`;
}

let lastPointerX = 0;
let lastPointerY = 0;

function initPan() {
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.block-img') || e.target.closest('.panel') || e.target.closest('.hud-shuffle') || e.target.closest('a')) return;
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
    updateTransform();
  });

  stage.addEventListener('pointerup', () => {
    isDragging = false;
  });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const prevScale = scale;
    scale = Math.min(1.08, Math.max(0.85, scale + delta));

    const ratio = scale / prevScale;
    panX *= ratio;
    panY *= ratio;

    updateTransform();
  }, { passive: false });
}

function startInertia() {
  function tick() {
    if (!isDragging && (Math.abs(velX) > 0.15 || Math.abs(velY) > 0.15)) {
      panX += velX;
      panY += velY;
      velX *= 0.88;
      velY *= 0.88;
      updateTransform();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

function initPanel() {
  document.querySelectorAll('.block-img[data-project]').forEach(block => {
    block.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(block.dataset.project, 10);
      const p = projects[idx];
      if (!p) return;

      document.getElementById('panel-tag').textContent = p.tag;
      document.getElementById('panel-title').textContent = p.title;
      document.getElementById('panel-text').textContent = p.text;

      const link = document.getElementById('panel-link');
      if (p.link) {
        link.href = p.link;
        link.hidden = false;
      } else {
        link.hidden = true;
      }

      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    });
  });

  panelClose.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });
}

function closePanel() {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function initClock() {
  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.addEventListener('mousemove', e => {
    cursorCross.style.left = e.clientX + 'px';
    cursorCross.style.top = e.clientY + 'px';
  });
}

function initShuffle() {
  shuffleBtn.addEventListener('click', () => {
    layoutIndex = (layoutIndex + 1) % LAYOUTS.length;
    field.classList.add('shuffling');
    placeBlocks(LAYOUTS[layoutIndex]);
    panX = 0;
    panY = 0;
    fitToView();
    setTimeout(() => field.classList.remove('shuffling'), 700);
  });
}
