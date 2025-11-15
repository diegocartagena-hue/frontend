// Navbar móvil reutilizable
(function () {
  const initMenu = () => {
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
        'Navbar: no se encontraron los elementos requeridos. Asegúrate de tener data-menu-toggle/id="menuToggle" y data-nav-menu/id="navMenu".'
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

    const computeLayout = () => {
      const styles = window.getComputedStyle(navMenu);
      const initialDisplay =
        styles.display === 'none' ? 'flex' : styles.display || 'flex';
      const usesRightTransition =
        styles.position !== 'static' &&
        (styles.right !== 'auto' ||
          styles.getPropertyValue('transition-property').includes('right') ||
          navMenu.classList.contains('nav-menu--right'));

      return { initialDisplay, usesRightTransition };
    };

    let { initialDisplay, usesRightTransition } = computeLayout();

    const applyMobileLayout = () => {
      ({ initialDisplay, usesRightTransition } = computeLayout());

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

      ({ initialDisplay, usesRightTransition } = computeLayout());

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
      ({ initialDisplay, usesRightTransition } = computeLayout());
      navMenu.setAttribute('aria-hidden', String(!navMenu.classList.contains('active')));
      applyMobileLayout();
    }
  };

  const initNavbarScrollEffect = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMenu();
      initNavbarScrollEffect();
    });
  } else {
    initMenu();
    initNavbarScrollEffect();
  }
})();