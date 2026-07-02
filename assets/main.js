import * as THREE from '../node_modules/three/build/three.module.js';

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.innerHTML = '<span></span>';
document.body.prepend(progress);
const progressBar = progress.querySelector('span');

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
}

document.querySelectorAll('.site-nav a').forEach((link) => {
  if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
    link.setAttribute('aria-current', 'page');
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('h1').forEach((headline) => {
  const label = headline.textContent.trim();
  const words = label.split(/\s+/);
  headline.setAttribute('aria-label', label);
  headline.innerHTML = words.map((word, index) => (
    `<span class="word" aria-hidden="true" style="--word-index:${index}"><span>${word}</span></span>`
  )).join(' ');
});

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const amount = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('cursor-enabled');
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.append(cursor);

  const cursorPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursorTarget = { x: cursorPosition.x, y: cursorPosition.y };

  window.addEventListener('pointermove', (event) => {
    cursorTarget.x = event.clientX;
    cursorTarget.y = event.clientY;
    cursor.classList.add('is-active');
  }, { passive: true });

  window.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));

  document.querySelectorAll('a, button, input, select, textarea, .service-row').forEach((item) => {
    item.addEventListener('pointerenter', () => cursor.classList.add('is-link'));
    item.addEventListener('pointerleave', () => cursor.classList.remove('is-link'));
  });

  const moveCursor = () => {
    cursorPosition.x += (cursorTarget.x - cursorPosition.x) * .18;
    cursorPosition.y += (cursorTarget.y - cursorPosition.y) * .18;
    cursor.style.left = `${cursorPosition.x}px`;
    cursor.style.top = `${cursorPosition.y}px`;
    requestAnimationFrame(moveCursor);
  };

  moveCursor();
}

document.querySelectorAll('.service-row').forEach((row) => {
  row.addEventListener('pointermove', (event) => {
    const rect = row.getBoundingClientRect();
    row.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    row.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, { passive: true });
});

const revealItems = document.querySelectorAll([
  '.statement',
  '.service-row',
  '.clients-band',
  '.proof-grid article',
  '.journal-strip',
  '.page-hero',
  '.tile-grid article',
  '.values div',
  '.specialization-list a',
  '.contact-form'
].join(','));

revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
});

if (!prefersReducedMotion && revealItems.length) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const invalid = [...form.elements].filter((field) => field.required && !field.value.trim());
    const email = form.elements.email;

    if (invalid.length || !email.validity.valid) {
      status.textContent = 'Please complete the required fields with a valid email.';
      form.classList.add('has-error');
      (invalid[0] || email).focus();
      return;
    }

    form.reset();
    form.classList.remove('has-error');
    status.textContent = 'Thanks. Your inquiry is ready for follow-up.';
  });
}

const canvas = document.querySelector('#strategy-field');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.25, 7.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);
  const pointer = { x: 0, y: 0 };

  const globeGeometry = new THREE.IcosahedronGeometry(2.25, 3);
  const globeMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4a546,
    wireframe: true,
    transparent: true,
    opacity: 0.34
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  globe.rotation.x = 0.28;
  group.add(globe);

  const coreGeometry = new THREE.SphereGeometry(2.18, 48, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x071923,
    transparent: true,
    opacity: 0.48
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.rotation.x = 0.28;
  group.add(core);

  const haloGeometry = new THREE.TorusGeometry(2.42, 0.012, 12, 160);
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xf4d889,
    transparent: true,
    opacity: 0.5
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.rotation.set(1.1, 0.14, 0.55);
  group.add(halo);

  const nodesGroup = new THREE.Group();
  const linesGroup = new THREE.Group();
  const nodePositions = [];
  const nodeCount = 15;
  const radius = 2.32;

  for (let index = 0; index < nodeCount; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const position = new THREE.Vector3(x, y, z);
    nodePositions.push(position);

    const dotGeometry = new THREE.SphereGeometry(index % 4 === 0 ? 0.07 : 0.045, 14, 14);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: index % 3 === 0 ? 0xf4d889 : 0xfff8ea,
      transparent: true,
      opacity: 0.92
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.copy(position);
    dot.userData.phase = index * 0.7;
    nodesGroup.add(dot);
  }

  const curveMaterial = new THREE.LineBasicMaterial({
    color: 0xd4a546,
    transparent: true,
    opacity: 0.5
  });
  const connections = [[0, 4], [1, 6], [2, 8], [3, 11], [5, 13], [7, 14], [9, 12], [10, 4]];
  connections.forEach(([a, b]) => {
    const start = nodePositions[a];
    const end = nodePositions[b];
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(3.08);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(34));
    linesGroup.add(new THREE.Line(geometry, curveMaterial));
  });

  group.add(nodesGroup);
  group.add(linesGroup);

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    group.position.x = width < 850 ? 0.75 : 2.45;
    group.position.y = width < 850 ? -0.52 : 0.1;
    group.scale.setScalar(width < 850 ? 0.62 : 1);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    pointer.x = (event.clientX / window.innerWidth - .5) * 2;
    pointer.y = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });
  resize();

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const rotationSpeed = prefersReducedMotion ? 0 : 0.0024;
    globe.rotation.y += rotationSpeed;
    core.rotation.y += rotationSpeed * 0.72;
    nodesGroup.rotation.y += rotationSpeed;
    linesGroup.rotation.y += rotationSpeed;
    halo.rotation.z = elapsed * 0.11;
    group.rotation.y = -0.18 + pointer.x * 0.09;
    group.rotation.x = pointer.y * 0.045;
    nodesGroup.children.forEach((node) => {
      const pulse = Math.sin(elapsed * 1.8 + node.userData.phase) * 0.2 + 0.8;
      node.scale.setScalar(pulse);
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
