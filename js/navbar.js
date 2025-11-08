// Menú móvil - Reutilizable para todas las páginas
function initNavbar() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  if (!menuToggle || !navMenu) return;

  // Crear overlay para cerrar el menú
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  `;
  body.appendChild(overlay);

  // Función para abrir el menú
  function openMenu() {
    menuToggle.classList.add('open');
    navMenu.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    body.style.overflow = 'hidden';
  }

  // Función para cerrar el menú
  function closeMenu() {
    menuToggle.classList.remove('open');
    navMenu.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    body.style.overflow = '';
  }

  // Toggle menú móvil
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar menú al hacer clic en el overlay
  overlay.addEventListener('click', () => {
    closeMenu();
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Cerrar menú al hacer clic en los botones de navegación
  const navButtons = document.querySelectorAll('.btn-nav-primary, .btn-nav-secondary');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}