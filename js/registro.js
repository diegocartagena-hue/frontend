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

// Toggle de visibilidad de contraseña
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordInput = document.getElementById('contraseña');
const confirmPasswordInput = document.getElementById('confirmar');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.querySelector('i').classList.toggle('fa-eye');
    togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
  });
}

if (toggleConfirmPassword && confirmPasswordInput) {
  toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye');
    toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye-slash');
  });
}

// Validación de contraseñas
if (passwordInput && confirmPasswordInput) {
  confirmPasswordInput.addEventListener('input', () => {
    const passwordMatch = document.getElementById('passwordMatch');
    if (passwordInput.value && confirmPasswordInput.value) {
      if (passwordInput.value === confirmPasswordInput.value) {
        passwordMatch.textContent = '✓ Las contraseñas coinciden';
        passwordMatch.className = 'password-match match';
      } else {
        passwordMatch.textContent = '✗ Las contraseñas no coinciden';
        passwordMatch.className = 'password-match no-match';
      }
    } else {
      passwordMatch.textContent = '';
    }
  });
}

// Toggle campo de comprobante según tipo de cuenta
const alumnoRadio = document.getElementById('alumno');
const maestroRadio = document.getElementById('maestro');
const comprobanteBox = document.getElementById('comprobante-box');
const comprobanteInput = document.getElementById('comprobante');
const fileName = document.getElementById('fileName');

if (alumnoRadio && maestroRadio && comprobanteBox) {
  alumnoRadio.addEventListener('change', () => {
    comprobanteBox.classList.add('d-none');
    if (comprobanteInput) {
      comprobanteInput.value = '';
      if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
    }
  });

  maestroRadio.addEventListener('change', () => {
    comprobanteBox.classList.remove('d-none');
  });
}

// Mostrar nombre del archivo seleccionado
if (comprobanteInput && fileName) {
  comprobanteInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
        comprobanteInput.value = '';
        fileName.textContent = 'Ningún archivo seleccionado';
        return;
      }
      
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Formato no válido. Solo se aceptan JPG, PNG o PDF.');
        comprobanteInput.value = '';
        fileName.textContent = 'Ningún archivo seleccionado';
        return;
      }

      fileName.textContent = file.name;
      fileName.style.color = 'var(--verde-medio)';
      fileName.style.fontWeight = '600';
    } else {
      fileName.textContent = 'Ningún archivo seleccionado';
      fileName.style.color = '#666';
      fileName.style.fontWeight = '500';
    }
  });
}

// Validación del formulario
const registroForm = document.getElementById('registroForm');

if (registroForm) {
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud de contraseña
    if (passwordInput.value.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Si es maestro, validar que haya subido el comprobante
    if (maestroRadio && maestroRadio.checked) {
      if (!comprobanteInput || !comprobanteInput.files || comprobanteInput.files.length === 0) {
        alert('Debes subir un comprobante de carnet de profesor para registrarte como maestro');
        return;
      }
    }

    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario válido, enviando...');
    
    // Ejemplo de datos a enviar
    const formData = {
      nombre: document.getElementById('nombre').value,
      correo: document.getElementById('correo').value,
      contraseña: passwordInput.value,
      tipo: document.querySelector('input[name="tipo"]:checked').value,
      comprobante: maestroRadio.checked ? comprobanteInput.files[0] : null
    };

    console.log('Datos del formulario:', formData);
    
    // Aquí harías la petición al servidor
    // fetch('/api/registro', { method: 'POST', body: formData })
    
    alert('¡Registro exitoso! (Esta es una demostración)');
  });
}