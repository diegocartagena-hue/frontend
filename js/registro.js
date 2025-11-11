// Partículas decorativas en el fondo
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

    particle.style.opacity = Math.random() * 0.5 + 0.3;

    particlesContainer.appendChild(particle);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createParticles);
} else {
  createParticles();
}

// Toggles de visibilidad de contraseñas
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordInput = document.getElementById('contraseña');
const confirmPasswordInput = document.getElementById('confirmar');

const toggleFieldVisibility = (button, input) => {
  if (!button || !input) return;
  button.addEventListener('click', () => {
    const newType = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', newType);
    const icon = button.querySelector('i');
    icon?.classList.toggle('fa-eye');
    icon?.classList.toggle('fa-eye-slash');
  });
};

toggleFieldVisibility(togglePassword, passwordInput);
toggleFieldVisibility(toggleConfirmPassword, confirmPasswordInput);

// Validación visual de coincidencia de contraseñas
if (passwordInput && confirmPasswordInput) {
  confirmPasswordInput.addEventListener('input', () => {
    const helper = document.getElementById('passwordMatch');
    if (!helper) return;

    if (passwordInput.value && confirmPasswordInput.value) {
      const coincide = passwordInput.value === confirmPasswordInput.value;
      helper.textContent = coincide
        ? '✓ Las contraseñas coinciden'
        : '✗ Las contraseñas no coinciden';
      helper.className = `password-match ${coincide ? 'match' : 'no-match'}`;
    } else {
      helper.textContent = '';
      helper.className = 'password-match';
    }
  });
}

// Dependencias para subida de comprobante
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
      if (fileName) {
        fileName.textContent = 'Ningún archivo seleccionado';
        fileName.style.color = '#666';
        fileName.style.fontWeight = '500';
      }
    }
  });

  maestroRadio.addEventListener('change', () => {
    comprobanteBox.classList.remove('d-none');
  });
}

// Mostrar nombre del comprobante seleccionado
if (comprobanteInput && fileName) {
  comprobanteInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      fileName.textContent = 'Ningún archivo seleccionado';
      fileName.style.color = '#666';
      fileName.style.fontWeight = '500';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      comprobanteInput.value = '';
      fileName.textContent = 'Ningún archivo seleccionado';
      fileName.style.color = '#666';
      fileName.style.fontWeight = '500';
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Formato no válido. Solo se aceptan JPG, PNG o PDF.');
      comprobanteInput.value = '';
      fileName.textContent = 'Ningún archivo seleccionado';
      fileName.style.color = '#666';
      fileName.style.fontWeight = '500';
      return;
    }

    fileName.textContent = file.name;
    fileName.style.color = 'var(--verde-medio)';
    fileName.style.fontWeight = '600';
  });
}

// Validación del formulario de registro
const registroForm = document.getElementById('registroForm');

if (registroForm) {
  registroForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const apellido = document.getElementById('apellido')?.value.trim();
    const correo = document.getElementById('correo')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const terms = document.getElementById('terms');

    if (!nombre || !apellido || !correo || !passwordInput?.value.trim() || !confirmPasswordInput?.value.trim() || !telefono) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (passwordInput.value.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (telefono.length < 10) {
      alert('Por favor, ingresa un número de teléfono válido.');
      return;
    }

    if (terms && !terms.checked) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    if (maestroRadio?.checked) {
      if (!comprobanteInput?.files || comprobanteInput.files.length === 0) {
        alert('Debes adjuntar tu comprobante para registrarte como maestro.');
        return;
      }
    }

    const formData = new FormData(registroForm);
    console.log('Datos de registro:', Object.fromEntries(formData.entries()));

    alert('¡Registro enviado! (demostración)');
  });
}