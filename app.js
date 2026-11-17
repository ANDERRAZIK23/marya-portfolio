'use strict';

const projects = {
  risque: {
    title: 'Suivi de l’appétence au risque',
    organization: 'Attijariwafa Bank',
    period: 'PFE · Févr. – juil. 2026',
    description: 'Conception d’un tableau de bord décisionnel de suivi de l’appétence au risque au sein du département Data SIG.',
    features: [
      { title: 'Préparation des données', detail: 'Analyse et préparation des données issues de différentes sources.' },
      { title: 'Traitements ETL', detail: 'Développement des traitements d’extraction, de transformation et de chargement avec IBM DataStage.' },
      { title: 'Qualité des données', detail: 'Validation et contrôle de la qualité des données avec SQL et IBM DB2.' },
      { title: 'Modélisation', detail: 'Contribution à la modélisation des couches ODS, Data Warehouse et Data Mart.' },
      { title: 'Reporting et pilotage', detail: 'Création de rapports, de tableaux de bord et de KPI avec SAP BusinessObjects WebI et UDT.' }
    ],
    tags: ['IBM DataStage', 'SQL', 'IBM DB2', 'SAP BusinessObjects']
  },
  conges: {
    title: 'Gestion des congés',
    organization: 'Agence Urbaine de Casablanca',
    period: 'Juil. – août 2025',
    description: 'Développement d’une application web de gestion des congés pendant un stage à l’Agence Urbaine de Casablanca.',
    features: [
      { title: 'Application web', detail: 'Développement de l’interface avec Vue.js et du serveur avec Express.js.' },
      { title: 'Base de données', detail: 'Gestion d’une base de données MongoDB et réalisation des opérations CRUD.' }
    ],
    tags: ['Vue.js', 'Express.js', 'MongoDB']
  },
  commerce: {
    title: 'Application e-commerce',
    organization: 'CBI',
    period: 'Juil. 2024',
    description: 'Développement d’une application e-commerce pendant un stage chez CBI.',
    features: [
      { title: 'Application web', detail: 'Développement de l’application avec Django.' },
      { title: 'Interface', detail: 'Réalisation de l’interface en HTML, CSS et JavaScript avec Bootstrap.' }
    ],
    tags: ['Django', 'HTML / CSS', 'JavaScript', 'Bootstrap']
  }
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
  navigation.classList.toggle('is-open', !expanded);
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
window.matchMedia('(min-width: 561px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-categories]');
const filterStatus = document.querySelector('#filter-status');

filters.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visibleCount = 0;
    cards.forEach(card => {
      const visible = filter === 'all' || card.dataset.categories.split(' ').includes(filter);
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
        card.classList.remove('reveal-pending');
        card.classList.add('is-revealed');
      }
    });
    filterStatus.textContent = `${visibleCount} projet${visibleCount > 1 ? 's' : ''} affiché${visibleCount > 1 ? 's' : ''}`;
  });
});

const dialog = document.querySelector('#project-dialog');
const dialogContent = dialog.querySelector('.dialog-inner');
const dialogTitle = document.querySelector('#dialog-title');
const dialogOrganization = document.querySelector('#dialog-organization');
const dialogPeriod = document.querySelector('#dialog-period');
const dialogDescription = document.querySelector('#dialog-description');
const dialogFeatures = document.querySelector('#dialog-features');
const dialogTags = document.querySelector('#dialog-tags');
let dialogTrigger = null;

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    dialogTrigger = button;
    dialogTitle.textContent = project.title;
    dialogOrganization.textContent = project.organization;
    dialogPeriod.textContent = project.period;
    dialogDescription.textContent = project.description;
    dialogFeatures.replaceChildren(...project.features.map(({title, detail}) => {
      const item = document.createElement('li');
      const heading = document.createElement('h4');
      const description = document.createElement('p');
      heading.textContent = title;
      description.textContent = detail;
      item.append(heading, description);
      return item;
    }));
    dialogTags.replaceChildren(...project.tags.map(tag => {
      const item = document.createElement('li');
      item.textContent = tag;
      return item;
    }));
    dialog.showModal();
    dialogContent.scrollTop = 0;
    document.body.classList.add('dialog-open');
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (
    event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom
  )) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (dialogTrigger) dialogTrigger.focus();
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

// Motion is optional, and system accessibility preferences take priority.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
const resetPointerEffects = new Set();
let animationsPaused = false;
let stageTransition = null;

function motionIsReduced() {
  return animationsPaused || motionPreference.matches;
}

function updateMotion() {
  const reduced = motionIsReduced();
  if (reduced) {
    resetPointerEffects.forEach(reset => reset());
    stageTransition?.cancel();
  }
  document.body.dataset.motion = reduced ? 'reduced' : 'full';
  document.documentElement.dataset.motion = document.body.dataset.motion;
  motionToggle.setAttribute('aria-pressed', String(reduced));
  motionToggle.disabled = motionPreference.matches;
  motionToggle.querySelector('.motion-label').textContent = motionPreference.matches
    ? 'Animations réduites'
    : animationsPaused ? 'Reprendre les animations' : 'Pause animations';
  motionToggle.querySelector('.motion-indicator').textContent = reduced ? '▷' : 'Ⅱ';
}

motionToggle.addEventListener('click', () => {
  animationsPaused = !animationsPaused;
  updateMotion();
});
motionPreference.addEventListener('change', updateMotion);
updateMotion();

const stageModes = {
  reporting: {
    domain: 'BUSINESS INTELLIGENCE',
    title: 'Indicateurs', emphasis: 'métier',
    nodes: [['REPORTING', 'SAP WebI'], ['VISUALISATION', 'Power BI'], ['SUIVI', 'KPI']],
    caption: 'Concevoir des rapports et des tableaux de bord pour suivre les indicateurs métier.'
  },
  etl: {
    domain: 'DATA ENGINEERING',
    title: 'Préparer', emphasis: 'les données',
    nodes: [['TRANSFORMATION', 'DataStage'], ['STOCKAGE', 'IBM DB2'], ['MODÉLISATION', 'Data Mart']],
    caption: 'Extraire, transformer et charger les données qui alimentent le reporting.'
  },
  analyse: {
    domain: 'DATA ANALYTICS',
    title: 'Explorer', emphasis: 'les données',
    nodes: [['REQUÊTES', 'SQL'], ['ANALYSE', 'Pandas'], ['CALCUL', 'NumPy']],
    caption: 'Explorer les jeux de données et vérifier leur qualité.'
  }
};
const architecture = document.querySelector('.architecture');
const stageOptions = document.querySelectorAll('.stage-option');
const stageNodeIds = ['one', 'two', 'three'];

stageOptions.forEach(button => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const mode = stageModes[button.dataset.mode];
    architecture.dataset.mode = button.dataset.mode;
    stageOptions.forEach(option => {
      const active = option === button;
      option.setAttribute('aria-pressed', String(active));
      option.classList.toggle('is-active', active);
    });
    document.querySelector('#stage-domain').textContent = mode.domain;
    document.querySelector('#stage-title').textContent = mode.title;
    document.querySelector('#stage-emphasis').textContent = mode.emphasis;
    document.querySelector('#stage-caption').textContent = mode.caption;
    stageNodeIds.forEach((id, index) => {
      document.querySelector(`#stage-node-${id}-label`).textContent = mode.nodes[index][0];
      document.querySelector(`#stage-node-${id}`).textContent = mode.nodes[index][1];
    });
    stageTransition?.cancel();
    if (!motionIsReduced()) {
      stageTransition = architecture.querySelector('.core-name').animate(
        [{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }],
        { duration: 300, easing: 'ease-out' }
      );
    }
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('reveal-pending');
    entry.target.classList.add('is-revealed');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section-heading, .project-card, .expertise-item, .journey-intro, .timeline-item, .education-grid, .credentials, .contact-panel').forEach(element => {
  element.classList.add('reveal-pending');
  revealObserver.observe(element);
});

// Keyboard navigation must never land inside an invisible reveal.
document.addEventListener('focusin', event => {
  const pending = event.target.closest('.reveal-pending');
  if (!pending) return;
  pending.classList.remove('reveal-pending');
  pending.classList.add('is-revealed');
  revealObserver.unobserve(pending);
});

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project-card, [data-tilt]').forEach(element => {
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const tiltRange = element.hasAttribute('data-tilt') ? 12 : 5;

  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'].forEach(property => {
      element.style.removeProperty(property);
    });
  }

  resetPointerEffects.add(resetPointer);
  element.addEventListener('pointermove', event => {
    if (motionIsReduced() || !finePointer.matches || event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (motionIsReduced() || !finePointer.matches) return;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height));
      element.style.setProperty('--tilt-x', `${(0.5 - y) * tiltRange}deg`);
      element.style.setProperty('--tilt-y', `${(x - 0.5) * tiltRange}deg`);
      element.style.setProperty('--pointer-x', `${x * 100}%`);
      element.style.setProperty('--pointer-y', `${y * 100}%`);
    });
  });
  element.addEventListener('pointerleave', resetPointer);
  element.addEventListener('pointercancel', resetPointer);
});

finePointer.addEventListener('change', () => resetPointerEffects.forEach(reset => reset()));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) resetPointerEffects.forEach(reset => reset());
});

const siteHeader = document.querySelector('.site-header');
const navSections = [...navigation.querySelectorAll('a')].map(link => ({
  link, section: document.querySelector(link.getAttribute('href'))
}));
let scrollFrame = 0;

function updateScrollState() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollableHeight)) : 0;
  document.documentElement.style.setProperty('--reading-progress', String(progress));
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
  const active = navSections.filter(({ section }) => section.getBoundingClientRect().top <= window.innerHeight * 0.4).at(-1);
  navSections.forEach(({ link }) => {
    if (active?.link === link) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function scheduleScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScrollState();
  });
}

window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate);
updateScrollState();
