// Inicializar navbar
if (typeof initNavbar === 'function') {
  initNavbar();
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