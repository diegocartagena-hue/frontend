// Menú móvil - Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle =
    document.querySelector('[data-menu-toggle]') ||
    document.getElementById('menuToggle');
  const navMenu =
    document.querySelector('[data-nav-menu]') || document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navButtons = document.querySelectorAll('.btn-nav-primary, .btn-nav-secondary');
  const body = document.body;

  if (!menuToggle || !navMenu) {
    console.warn(
      'Elementos del menú no encontrados. Asegúrate de que el botón tenga data-menu-toggle o id="menuToggle" y el menú data-nav-menu o id="navMenu".'
    );
    return;
  }

  // Overlay reutilizable
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      pointer-events: none;
    `;
    body.appendChild(overlay);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionDuration = prefersReducedMotion.matches ? '0s' : '0.3s';

  navMenu.style.transition = `transform ${transitionDuration} ease, opacity ${transitionDuration} ease`;
  navMenu.style.transform = 'translateX(100%)';
  navMenu.style.opacity = '0';
  navMenu.style.visibility = 'hidden';
  navMenu.style.pointerEvents = 'none';

  const setMenuState = (shouldOpen) => {
    const isOpen =
      typeof shouldOpen === 'boolean' ? shouldOpen : !navMenu.classList.contains('active');

    navMenu.classList.toggle('active', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    body.classList.toggle('menu-open', isOpen);
    overlay.classList.toggle('visible', isOpen);

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    navMenu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      navMenu.style.transform = 'translateX(0)';
      navMenu.style.opacity = '1';
      navMenu.style.visibility = 'visible';
      navMenu.style.pointerEvents = 'auto';

      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.pointerEvents = 'auto';

      body.style.overflow = 'hidden';

      const firstFocusable =
        navMenu.querySelector(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || navMenu;
      requestAnimationFrame(() => firstFocusable.focus({ preventScroll: true }));
    } else {
      navMenu.style.transform = 'translateX(100%)';
      navMenu.style.opacity = '0';
      navMenu.style.visibility = 'hidden';
      navMenu.style.pointerEvents = 'none';

      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      overlay.style.pointerEvents = 'none';

      body.style.overflow = '';
      menuToggle.focus({ preventScroll: true });
    }
  };

  // Toggle menú móvil
  menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    setMenuState();
  });

  // Overlay
  overlay.addEventListener('click', () => setMenuState(false));

  // Cerrar menú al seleccionar enlaces o botones
  [...navLinks, ...navButtons].forEach((element) => {
    element.addEventListener('click', () => setMenuState(false));
  });

  // Atajo con tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      setMenuState(false);
    }
  });

  // Reset en escritorio
  const mqDesktop = window.matchMedia('(min-width: 992px)');
  const handleViewportChange = () => {
    if (mqDesktop.matches) {
      setMenuState(false);
    }
  };
  mqDesktop.addEventListener('change', handleViewportChange);
  window.addEventListener('resize', handleViewportChange);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  });
});

// Activar enlace activo según scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
});

// Animación al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.glass-card, .value-card').forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});