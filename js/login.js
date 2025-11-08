// Inicializar navbar
if (typeof initNavbar === 'function') {
  initNavbar();
}

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