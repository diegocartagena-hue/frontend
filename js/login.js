// Menú móvil - Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  if (!menuToggle || !navMenu) {
    console.warn('Elementos del menú no encontrados');
    return;
  }

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
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    pointer-events: none;
  `;
  body.appendChild(overlay);

  // Función para abrir el menú
  function openMenu() {
    console.log('Abriendo menú...');
    menuToggle.classList.add('open');
    navMenu.classList.add('active');
    navMenu.style.right = '0';
    navMenu.style.display = 'flex';
    navMenu.style.visibility = 'visible';
    navMenu.style.opacity = '1';
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'auto';
    body.style.overflow = 'hidden';
    console.log('Menú abierto');
  }

  // Función para cerrar el menú
  function closeMenu() {
    console.log('Cerrando menú...');
    menuToggle.classList.remove('open');
    navMenu.classList.remove('active');
    navMenu.style.right = '-100%';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';
    body.style.overflow = '';
    console.log('Menú cerrado');
  }

  // Toggle menú móvil
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Menú toggle clickeado');
    console.log('Estado actual:', navMenu.classList.contains('active'));
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

  // Cerrar menú cuando se redimensiona la ventana a pantalla grande
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
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
    
    // Tamaño aleatorio
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    // Opacidad aleatoria
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    particlesContainer.appendChild(particle);
  }
}

// Inicializar partículas cuando el DOM esté listo
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

    // Validación básica
    if (!correo || !contraseña) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor, ingresa un correo electrónico válido');
      return;
    }

    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Iniciando sesión...');
    
    // Ejemplo de datos a enviar
    const formData = {
      correo: correo,
      contraseña: contraseña,
      rememberMe: document.getElementById('rememberMe').checked
    };

    console.log('Datos del formulario:', formData);
    
    // Aquí harías la petición al servidor
    // fetch('/api/login', { method: 'POST', body: JSON.stringify(formData) })
    
    // Simulación de login exitoso
    alert('¡Inicio de sesión exitoso! (Esta es una demostración)');
  });
}