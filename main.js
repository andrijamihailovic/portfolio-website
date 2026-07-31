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
let rafId = null;

document.addEventListener('DOMContentLoaded', () => {
  placeBlocks([
    [1, 1], [5, 1], [8, 1], [10, 1], [1, 4], [4, 4], [7, 3],
    [1, 7], [3, 6], [6, 6], [9, 5], [11, 4], [2, 9], [5, 8],
    [8, 8], [10, 7], [1, 11], [4, 11], [7, 10], [10, 10], [6, 11]
  ]);
  centerField();
  initPan();
  initPanel();
  initClock();
  initCursor();
  initParallax();
  initShuffle();
  startInertia();
});

function placeBlocks(positions) {
  const blocks = field.querySelectorAll('.block');
  blocks.forEach((block, i) => {
    const [col, row] = positions[i] || [1 + (i % 6), 1 + Math.floor(i / 6)];
    block.style.gridColumn = `${col} / span ${block.dataset.w}`;
    block.style.gridRow = `${row} / span ${block.dataset.h}`;
  });
}

function centerField() {
  updateTransform();
}

function updateTransform() {
  field.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
  coordsEl.textContent = `${panX.toFixed(0).padStart(3, '0')} / ${panY.toFixed(0).padStart(3, '0')}`;
}

function initPan() {
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.block-img') || e.target.closest('.panel') || e.target.closest('.hud-shuffle')) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    velX = 0;
    velY = 0;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const nx = e.clientX - startX;
    const ny = e.clientY - startY;
    velX = nx - panX;
    velY = ny - panY;
    panX = nx;
    panY = ny;
    updateTransform();
  });

  stage.addEventListener('pointerup', () => {
    isDragging = false;
  });

  stage.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.04 : 0.04;
    scale = Math.min(1.4, Math.max(0.6, scale + delta));
    updateTransform();
  }, { passive: false });
}

function startInertia() {
  function tick() {
    if (!isDragging) {
      panX += velX * 0.92;
      panY += velY * 0.92;
      velX *= 0.92;
      velY *= 0.92;
      if (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1) {
        updateTransform();
      }
    }
    rafId = requestAnimationFrame(tick);
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

function initParallax() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll('.block').forEach((block, i) => {
      const depth = (i % 5 + 1) * 0.8;
      const motion = block.classList.contains('block-float') ||
                     block.classList.contains('block-drift') ||
                     block.classList.contains('block-drift-reverse') ||
                     block.classList.contains('block-wobble') ||
                     block.classList.contains('block-tilt');

      if (motion) {
        block.style.setProperty('--mx', `${cx * depth}px`);
        block.style.setProperty('--my', `${cy * depth}px`);
      }
    });
  });
}

function initShuffle() {
  shuffleBtn.addEventListener('click', () => {
    const blocks = [...field.querySelectorAll('.block:not(.block-marquee):not(.block-name)')];
    field.classList.add('shuffling');

    blocks.forEach(block => {
      const maxCol = 12 - parseInt(block.dataset.w, 10);
      const col = Math.floor(Math.random() * Math.max(1, maxCol)) + 1;
      const row = Math.floor(Math.random() * 8) + 1;
      block.style.gridColumn = `${col} / span ${block.dataset.w}`;
      block.style.gridRow = `${row} / span ${block.dataset.h}`;

      const motions = ['block-float', 'block-drift', 'block-drift-reverse', 'block-wobble', 'block-tilt'];
      motions.forEach(c => block.classList.remove(c));
      block.classList.add(motions[Math.floor(Math.random() * motions.length)]);
    });

    panX += (Math.random() - 0.5) * 80;
    panY += (Math.random() - 0.5) * 80;
    updateTransform();

    setTimeout(() => field.classList.remove('shuffling'), 700);
  });
}
