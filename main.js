const projects = [
  {
    title: 'Throat Sprayer — Concept for TaticDesign Milano',
    tag: 'Industrial Design',
    image: 'images/IO_sprej.png',
    description: 'The focus of this project was to develop the design (ideation), form (development) and design detailing skills (control) while working with realistic project requirements. We were working on a real project of TaticDesign studio and finding alternative design options for specific user cases. The user case in this scenario was army and military use of the throat spray. Together with Urh Furlanič (BA Industrial design) we came to this rugged design.',
    link: 'https://www.instagram.com/p/Cmg_0dHtkSv/?img_index=6'
  },
  {
    title: 'Coffee Waste Management in Catering',
    tag: 'Industrial Design',
    image: 'images/IO_gobe.png',
    description: 'I encountered the problem of an unregulated waste separation system in catering. There, I noticed great potential for recycling coffee waste. Through my project, I started researching the current management of coffee waste. I set myself various options for reusing coffee waste, and delved into the use of coffee waste as a basis for growing nutritious and medicinal mushrooms. Through my project I want to show a new alternative path for coffee waste in the form of a product journey, which acts as a guide for providing a second life cycle to coffee waste.',
    link: 'https://repozitorij.uni-lj.si/IzpisGradiva.php?id=140616'
  },
  {
    title: 'PANJ Glamping House',
    tag: 'Industrial Design',
    image: 'images/IO_hisa.png',
    description: 'A glamping experience inspired by Slovenian beekeeping will enable guests to fully relax and connect with nature. The Panj glamping unit is surrounded by a parametric wall, which allows complete privacy, but at the same time a view of the morning sun when the guest so desires by manipulating the facade. The entire glamping area is surrounded by lush greenery and flowering plants that attract bees.'
  },
  {
    title: 'Planty — Returnable System',
    tag: 'Industrial Design',
    image: 'images/IO_flaska.png',
    description: 'The idea for the project was to create a modern twist on a traditional milk bottle design that caters to the rising demand for plant-based milk alternatives. The commitment to sustainability goes beyond just the design. Bottle is supported by a convenient returnable service, allowing users to return empty bottles to their local coffee shop in exchange for a fresh cup of coffee.',
    link: 'https://glassberriesawards.com/the-glassberries/'
  },
  {
    title: 'Mycelium Panels — Design Research',
    tag: 'Design Research',
    image: 'images/IO_panel.png',
    description: 'Development of sustainable isolation and acoustic panels, self grown out of mycelium and raw wool. Project continued in creating a workshop, researching other insulation materials against noise, cold and dirt. Workshop with Folke Köbberling, Natalija Miodragović, Stella Maxeiner and Andrija Mihailović, while working as a student assistant at Matters of Activity, Berlin.',
    link: 'https://zur-nachahmung-empfohlen.de/workshop-rohwolle/'
  },
  {
    title: 'Kaslc',
    tag: 'Industrial Design',
    image: 'images/IO_kaslc.png',
    description: 'Entering the market and selling their produce is a big challenge for farmers. We propose the Kaslc solution, which comes from the already well-functioning solution of the milking machine, and together with the service we offer, we provide farmers with an easy way to sell to end customers. Project is a work in progress for a master\'s thesis in collaboration with Esma Hajderpasić.',
    link: 'https://multidisciplinaren.si/posts/2022-projekt-digitalizacija-kmetij/PREDSTAVITVE/2023_kaslc.pdf'
  },
  {
    title: 'Mobile Gallery — Sliced Up',
    tag: 'Industrial Design',
    image: 'images/IO_razstava.png',
    description: 'The conceptual design of the mobile gallery is based on container construction. I am looking for a solution in dividing the containers into smaller modules, which can be spread over the entire designated space depending on the size and need. The modules are designed to periodically change the layout, which would be adapted from exhibition to exhibition.'
  },
  {
    title: 'Modular Delivery Box System',
    tag: 'Industrial Design',
    image: 'images/IO_skatle.png',
    description: 'The boxes are made from recycled pulp, the grooving and twisting of the box add more load-bearing capacity and stability to the pulp, and each reinforcement adds a new function. Boxes are intended for orderly and simple delivery of unprepared food and other raw materials.'
  },
  {
    title: 'Atrium House',
    tag: 'Architecture',
    image: 'images/IO_atrijskahisa_poskus.png',
    description: 'During my studies, I focused on architecture and interior design. I spent time working on floor plans and design plans for interior spaces, gaining hands-on experience in bringing creative ideas to life.'
  },
  {
    title: 'Sourdough Starter-Kit',
    tag: 'Packaging',
    image: 'images/IO_pakiranje.png',
    description: 'Drožjar is an old Slovenian term for a master who makes yeast. With the help of packaging, we want to communicate that the use of our product and baking bread is something effortless. All you need is water and flour.'
  },
  {
    title: 'Glass & Ceramics',
    tag: 'Material Study',
    image: 'images/IO_steklo.png',
    description: 'An exciting turning point occurred when I was presented with the opportunity to explore the realms of glass and ceramics. This experience expanded my horizons, introducing me to novel materials and showcasing their potential applications in the design process.'
  },
  {
    title: 'Vineyard Chair',
    tag: 'Industrial Design',
    image: 'images/IO_stou.png',
    description: 'While participating in the grape harvest, I noticed the strenuous nature of working in the vineyard. Using a single piece of curved oak veneer, I crafted a comfortable chair tailored to provide relief during work. The chair is adapted to fit standard agricultural crates and is suitable for use even in steep terrain.'
  },
  {
    title: 'TOZD Bar',
    tag: 'Graphic Design',
    image: 'images/GD_tozd.png',
    description: 'The project involved creating a unified graphic design for a new bar interior in Ljubljana, Slovenia. The concept aimed to seamlessly blend interior elements, objects, and graphics with the raw walls of the establishment. The holistic approach extended to logos, publications, social media, menus, garments, signs, coasters, matches, and stickers.',
    link: 'https://www.instagram.com/tozdbar/'
  },
  {
    title: 'Isa Kombucha',
    tag: 'Graphic Design',
    image: 'images/GD_isa.png',
    description: 'The project involved designing merchandise for a local kombucha brand, Isa Kombucha. I aimed to infuse the pieces with a vibrant 90s graphic t-shirt feel, employing a pop of color, and balancing it with the classic Times New Roman font.'
  },
  {
    title: 'Lelee Band',
    tag: 'Graphic Design',
    image: 'images/GD_lelee.png',
    description: 'In collaboration with photographer Andraž Fijavž Bačovnik, we produced a series of studio photos for band promotion. These photographs were subsequently utilized to craft compelling and expressive posters for the band\'s promotional materials.',
    link: 'https://leleeband.com/photos/press'
  },
  {
    title: 'The Staff Room',
    tag: 'Video & Audio',
    image: 'images/VA_staff.png',
    description: 'In the field of film, I worked in visual effects and graphics, which led me to the European hit, the film The Staff Room (Zbornica). For the film, I animated and illustrated the digital screens that appear throughout the film. The film has won the Karlovy Vary Crystal Globe and the Pula Film Festival award.',
    link: 'https://www.imdb.com/news/ni63702656/'
  },
  {
    title: 'XX — Short Film',
    tag: 'Video & Audio',
    image: 'images/VA_xx.png',
    description: 'Over the course of my studies, I have cultivated a passionate interest in screen printing. Together with Vasja Lebarič, we embarked on an innovative project involving the application of screen printing techniques onto 35mm analog film strips, resulting in the creation of a short experimental analog film.',
    link: 'https://bsf.si/sl/film/xx/'
  },
  {
    title: 'Coffee Shop Ad',
    tag: 'Video & Audio',
    image: 'images/VA_ad.png',
    description: 'In my bachelor\'s thesis, I created a short advertisement film on coffee shops and coffee waste. Taking on the roles of director, producer, and editor, the project served both academic requirements and promoted a local coffee shop. Filmed with assistance of Luc Vrhovnik d.o.p.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTabs();
  initFilters();
  initModal();
  initReveal();
  initCursorGlow();
});

function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('nav-links');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  menuOpen?.addEventListener('click', () => navLinks.classList.add('open'));
  menuClose?.addEventListener('click', () => navLinks.classList.remove('open'));

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);

        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        }
      });
    });
  });
}

function initModal() {
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const cards = document.querySelectorAll('.project-card');

  const modalImg = document.getElementById('modal-img');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  function openModal(index) {
    const project = projects[index];
    if (!project) return;

    modalImg.src = project.image;
    modalImg.alt = project.title;
    modalTag.textContent = project.tag;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.description;

    if (project.link) {
      modalLink.href = project.link;
      modalLink.hidden = false;
    } else {
      modalLink.hidden = true;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(parseInt(card.dataset.index, 10));
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let raf;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }, { passive: true });
}

