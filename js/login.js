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
  const mqDesktop = window.matchMedia('(min-width: 992px)');

  const navMenuComputed = window.getComputedStyle(navMenu);
  const initialDisplay =
    navMenuComputed.display === 'none' ? 'flex' : navMenuComputed.display || 'flex';
  const usesRightTransition =
    navMenuComputed.position !== 'static' &&
    (navMenuComputed.right !== 'auto' || navMenu.classList.contains('nav-menu--right'));

  const applyMobileLayout = () => {
    navMenu.style.transition = usesRightTransition
      ? `right ${transitionDuration} ease`
      : `transform ${transitionDuration} ease, opacity ${transitionDuration} ease`;

    if (navMenu.classList.contains('active')) {
      navMenu.style.display = initialDisplay;
      if (usesRightTransition) {
        navMenu.style.setProperty('right', '0', 'important');
      } else {
        navMenu.style.transform = 'translateX(0)';
      }
      navMenu.style.opacity = '1';
      navMenu.style.visibility = 'visible';
      navMenu.style.pointerEvents = 'auto';
    } else {
      if (usesRightTransition) {
        navMenu.style.setProperty('right', '-100%', 'important');
      } else {
        navMenu.style.transform = 'translateX(100%)';
      }
      navMenu.style.display = initialDisplay;
      navMenu.style.opacity = '0';
      navMenu.style.visibility = 'hidden';
      navMenu.style.pointerEvents = 'none';
    }
  };

  const resetDesktopLayout = () => {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('open');
    body.classList.remove('menu-open');

    navMenu.style.transition = '';
    navMenu.style.transform = '';
    navMenu.style.removeProperty('right');
    navMenu.style.opacity = '';
    navMenu.style.visibility = '';
    navMenu.style.pointerEvents = '';
    navMenu.style.display = '';

    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';

    body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.removeAttribute('aria-hidden');
  };

  const setMenuState = (shouldOpen) => {
    if (mqDesktop.matches) {
      return;
    }

    const isOpen =
      typeof shouldOpen === 'boolean' ? shouldOpen : !navMenu.classList.contains('active');

    navMenu.classList.toggle('active', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    body.classList.toggle('menu-open', isOpen);
    overlay.classList.toggle('visible', isOpen);

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    navMenu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      applyMobileLayout();

      if (usesRightTransition) {
        navMenu.style.setProperty('right', '0', 'important');
      } else {
        navMenu.style.transform = 'translateX(0)';
      }
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
      applyMobileLayout();

      if (usesRightTransition) {
        navMenu.style.setProperty('right', '-100%', 'important');
      } else {
        navMenu.style.transform = 'translateX(100%)';
      }
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

  menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    setMenuState();
  });

  overlay.addEventListener('click', () => setMenuState(false));

  [...navLinks, ...navButtons].forEach((element) => {
    element.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      setMenuState(false);
    }
  });

  const handleViewportChange = () => {
    if (mqDesktop.matches) {
      resetDesktopLayout();
    } else {
      navMenu.setAttribute('aria-hidden', String(!navMenu.classList.contains('active')));
      applyMobileLayout();
    }
  };

  mqDesktop.addEventListener('change', handleViewportChange);
  window.addEventListener('resize', handleViewportChange);

  if (mqDesktop.matches) {
    resetDesktopLayout();
  } else {
    navMenu.setAttribute('aria-hidden', String(!navMenu.classList.contains('active')));
    applyMobileLayout();
  }
});

// Toggle de visibilidad de contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contraseña');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

// Crear partículas animadas
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = Math.random() * 10 + 10 + 's';

    particle.style.opacity = Math.random() * 0.5 + 0.3;

    particlesContainer.appendChild(particle);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createParticles);
} else {
  createParticles();
}

// Validación del formulario
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    if (!correo || !contraseña) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor, ingresa un correo electrónico válido');
      return;
    }

    console.log('Iniciando sesión...');

    const formData = {
      correo: correo,
      contraseña: contraseña,
      rememberMe: document.getElementById('rememberMe').checked,
    };

    console.log('Datos del formulario:', formData);

    alert('¡Inicio de sesión exitoso! (Esta es una demostración)');
  });
}