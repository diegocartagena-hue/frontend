// Panel de Alumno - ClasiYA
(function () {
  'use strict';

  // Estado global
  const state = {
    alumno: null,
    cursosDisponibles: [],
    misCursos: [],
    sesiones: []
  };

  // ========== INICIALIZACIÓN ==========
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    loadAlumnoProfile();
    loadCursosDisponibles();
    loadMisCursos();
    loadSesiones();
    setupEventListeners();
  });

  // ========== PARTÍCULAS ANIMADAS ==========
  function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 18 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // ========== CARGA DE DATOS ==========
  async function loadAlumnoProfile() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/perfil');
      // const data = await response.json();
      
      // Datos de ejemplo
      const alumnoData = {
        id: 1,
        nombre: 'Estudiante Ejemplo',
        email: 'estudiante@clasiya.com',
        avatar: 'assets/logosinfondo.png',
        totalCursosInscritos: 0,
        totalSesionesAsistidas: 0,
        totalLogros: 0
      };

      state.alumno = alumnoData;
      renderProfile(alumnoData);
    } catch (error) {
      console.error('Error al cargar perfil del alumno:', error);
      showNotification('Error al cargar el perfil', 'error');
    }
  }

  async function loadCursosDisponibles() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/cursos-disponibles');
      // const data = await response.json();
      
      // Datos de ejemplo
      const cursosData = [
        {
          id: 1,
          nombre: 'Matemáticas Avanzadas',
          descripcion: 'Curso completo de matemáticas avanzadas para estudiantes de nivel superior',
          profesor: 'Prof. Juan Pérez',
          totalEstudiantes: 25,
          disponible: true
        },
        {
          id: 2,
          nombre: 'Programación Web',
          descripcion: 'Aprende a crear aplicaciones web modernas con las últimas tecnologías',
          profesor: 'Prof. María García',
          totalEstudiantes: 30,
          disponible: true
        },
        {
          id: 3,
          nombre: 'Historia del Arte',
          descripcion: 'Explora las diferentes épocas y movimientos artísticos a lo largo de la historia',
          profesor: 'Prof. Carlos López',
          totalEstudiantes: 18,
          disponible: true
        }
      ];

      state.cursosDisponibles = cursosData;
      renderCursosDisponibles(cursosData);
    } catch (error) {
      console.error('Error al cargar cursos disponibles:', error);
      showNotification('Error al cargar los cursos disponibles', 'error');
    }
  }

  async function loadMisCursos() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/mis-cursos');
      // const data = await response.json();
      
      // Datos de ejemplo
      const misCursosData = [];

      state.misCursos = misCursosData;
      renderMisCursos(misCursosData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar mis cursos:', error);
      showNotification('Error al cargar tus cursos', 'error');
    }
  }

  async function loadSesiones() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/sesiones');
      // const data = await response.json();
      
      // Datos de ejemplo
      const sesionesData = [];

      state.sesiones = sesionesData;
      renderSesiones(sesionesData);
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
      showNotification('Error al cargar las sesiones', 'error');
    }
  }

  // ========== RENDERIZADO ==========
  function renderProfile(alumno) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');

    if (profileName) profileName.textContent = alumno.nombre;
    if (profileEmail) profileEmail.textContent = alumno.email;
    if (profileAvatar) profileAvatar.src = alumno.avatar;
  }

  function renderCursosDisponibles(cursos) {
    const container = document.getElementById('coursesContainer');
    const template = document.getElementById('courseTemplate');
    const emptyState = document.getElementById('emptyState');

    if (!container || !template) return;

    // Limpiar cursos existentes (excepto template y empty state)
    const existingCourses = container.querySelectorAll('.course-card:not(#courseTemplate)');
    existingCourses.forEach(card => card.remove());

    if (cursos.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    cursos.forEach(curso => {
      const card = template.cloneNode(true);
      card.id = `course-${curso.id}`;
      card.style.display = 'block';

      // Llenar datos
      const title = card.querySelector('.course-title');
      const description = card.querySelector('.course-description');
      const teacherName = card.querySelector('.teacher-name');
      const studentCount = card.querySelector('.student-count');
      const statusText = card.querySelector('.status-text');
      const joinBtn = card.querySelector('.btn-join');
      const viewBtn = card.querySelector('.btn-view');

      if (title) title.textContent = curso.nombre;
      if (description) description.textContent = curso.descripcion;
      if (teacherName) teacherName.textContent = curso.profesor;
      if (studentCount) studentCount.textContent = curso.totalEstudiantes || 0;
      if (statusText) statusText.textContent = curso.disponible ? 'Disponible' : 'No disponible';
      if (joinBtn) {
        joinBtn.setAttribute('data-course-id', curso.id);
        joinBtn.disabled = !curso.disponible;
      }
      if (viewBtn) viewBtn.setAttribute('data-course-id', curso.id);

      container.appendChild(card);
    });
  }

  function renderMisCursos(cursos) {
    const container = document.getElementById('myCoursesList');
    const template = document.getElementById('myCourseTemplate');
    const emptyState = document.getElementById('emptyMyCoursesState');

    if (!container || !template) return;

    // Limpiar cursos existentes (excepto template y empty state)
    const existingCourses = container.querySelectorAll('.my-course-item:not(#myCourseTemplate)');
    existingCourses.forEach(item => item.remove());

    if (cursos.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    cursos.forEach(curso => {
      const item = template.cloneNode(true);
      item.id = `my-course-${curso.id}`;
      item.style.display = 'flex';

      // Llenar datos
      const title = item.querySelector('.my-course-title');
      const teacher = item.querySelector('.my-course-teacher');
      const progressValue = item.querySelector('.progress-value');
      const enterBtn = item.querySelector('.btn-enter');

      if (title) title.textContent = curso.nombre;
      if (teacher) teacher.textContent = `Profesor: ${curso.profesor}`;
      if (progressValue) progressValue.textContent = `${curso.progreso || 0}%`;
      if (enterBtn) enterBtn.setAttribute('data-course-id', curso.id);

      container.appendChild(item);
    });
  }

  function renderSesiones(sesiones) {
    const container = document.getElementById('sessionsList');
    const template = document.getElementById('sessionTemplate');
    const emptyState = document.getElementById('emptySessionsState');

    if (!container || !template) return;

    // Limpiar sesiones existentes (excepto template y empty state)
    const existingSessions = container.querySelectorAll('.session-item:not(#sessionTemplate)');
    existingSessions.forEach(item => item.remove());

    if (sesiones.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    sesiones.forEach(sesion => {
      const item = template.cloneNode(true);
      item.id = `session-${sesion.id}`;
      item.style.display = 'flex';

      // Formatear fecha y hora
      const fecha = new Date(sesion.fecha);
      const dia = fecha.getDate();
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
      const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      // Llenar datos
      const day = item.querySelector('.session-day');
      const time = item.querySelector('.session-time');
      const title = item.querySelector('.session-title');
      const course = item.querySelector('.session-course');
      const codeValue = item.querySelector('.code-value');
      const joinBtn = item.querySelector('.btn-session-join');

      if (day) day.textContent = dia;
      if (time) time.textContent = `${mes} ${hora}`;
      if (title) title.textContent = sesion.titulo;
      if (course) course.textContent = sesion.cursoNombre;
      if (codeValue) codeValue.textContent = sesion.codigoAcceso;
      if (joinBtn) joinBtn.setAttribute('data-session-id', sesion.id);

      container.appendChild(item);
    });
  }

  function updateStats() {
    const totalCursosInscritos = document.getElementById('totalCursosInscritos');
    const totalSesionesAsistidas = document.getElementById('totalSesionesAsistidas');
    const totalLogros = document.getElementById('totalLogros');

    if (totalCursosInscritos) totalCursosInscritos.textContent = state.misCursos.length;
    if (totalSesionesAsistidas) totalSesionesAsistidas.textContent = state.sesiones.length;
    if (totalLogros) totalLogros.textContent = 0; // TODO: Implementar logros
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Botón unirse a curso
    const btnUnirseCurso = document.getElementById('btnUnirseCurso');
    const btnUnirseCursoEmpty = document.getElementById('btnUnirseCursoEmpty');
    if (btnUnirseCurso) {
      btnUnirseCurso.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('modalUnirseCurso'));
        modal.show();
      });
    }
    if (btnUnirseCursoEmpty) {
      btnUnirseCursoEmpty.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('modalUnirseCurso'));
        modal.show();
      });
    }

    // Botón confirmar unirse a curso
    const btnUnirseCursoConfirm = document.getElementById('btnUnirseCursoConfirm');
    if (btnUnirseCursoConfirm) {
      btnUnirseCursoConfirm.addEventListener('click', handleUnirseCurso);
    }

    // Prevenir envío del formulario al presionar Enter
    const formUnirseCurso = document.getElementById('formUnirseCurso');
    if (formUnirseCurso) {
      formUnirseCurso.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleUnirseCurso();
      });
    }

    // Botones de acciones de curso
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-join')) {
        const cursoId = e.target.closest('.btn-join').getAttribute('data-course-id');
        handleUnirseCursoDirecto(cursoId);
      }
      if (e.target.closest('.btn-view')) {
        const cursoId = e.target.closest('.btn-view').getAttribute('data-course-id');
        handleVerDetallesCurso(cursoId);
      }
      if (e.target.closest('.btn-enter')) {
        const cursoId = e.target.closest('.btn-enter').getAttribute('data-course-id');
        handleEntrarCurso(cursoId);
      }
      if (e.target.closest('.btn-session-join')) {
        const sesionId = e.target.closest('.btn-session-join').getAttribute('data-session-id');
        handleUnirseSesion(sesionId);
      }
    });

    // Botón cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', handleCerrarSesion);
    }

    // Botón editar perfil
    const btnEditarPerfil = document.getElementById('btnEditarPerfil');
    if (btnEditarPerfil) {
      btnEditarPerfil.addEventListener('click', handleEditarPerfil);
    }
  }

  // ========== MANEJO DE FORMULARIOS ==========
  async function handleUnirseCurso() {
    const form = document.getElementById('formUnirseCurso');
    if (!form || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const codigoAcceso = document.getElementById('codigoAcceso').value.trim().toUpperCase();

    if (!codigoAcceso) {
      showNotification('Por favor ingresa un código de acceso', 'error');
      return;
    }

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/unirse-curso', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ codigoAcceso })
      // });
      // const resultado = await response.json();

      // Simulación - buscar curso por código
      const cursoEncontrado = state.cursosDisponibles.find(c => {
        // En un caso real, esto vendría del backend
        return true; // Simulación
      });

      if (!cursoEncontrado) {
        showNotification('Código de acceso inválido', 'error');
        return;
      }

      // Agregar curso a mis cursos
      const nuevoCurso = {
        id: Date.now(),
        nombre: cursoEncontrado.nombre || 'Curso Nuevo',
        profesor: cursoEncontrado.profesor || 'Profesor',
        progreso: 0
      };

      state.misCursos.push(nuevoCurso);
      renderMisCursos(state.misCursos);
      updateStats();

      // Limpiar formulario
      form.reset();

      // Cerrar modal
      const modalElement = document.getElementById('modalUnirseCurso');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        }, 300);
      }

      showNotification('Te has unido al curso exitosamente', 'success');
    } catch (error) {
      console.error('Error al unirse al curso:', error);
      showNotification('Error al unirse al curso', 'error');
    }
  }

  async function handleUnirseCursoDirecto(cursoId) {
    const curso = state.cursosDisponibles.find(c => c.id === parseInt(cursoId));
    if (!curso) return;

    if (!curso.disponible) {
      showNotification('Este curso no está disponible', 'error');
      return;
    }

    // Verificar si ya está inscrito
    const yaInscrito = state.misCursos.find(c => c.id === parseInt(cursoId));
    if (yaInscrito) {
      showNotification('Ya estás inscrito en este curso', 'info');
      return;
    }

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/alumno/cursos/${cursoId}/unirse`, {
      //   method: 'POST'
      // });

      // Simulación
      const nuevoCurso = {
        id: curso.id,
        nombre: curso.nombre,
        profesor: curso.profesor,
        progreso: 0
      };

      state.misCursos.push(nuevoCurso);
      renderMisCursos(state.misCursos);
      updateStats();

      showNotification('Te has unido al curso exitosamente', 'success');
    } catch (error) {
      console.error('Error al unirse al curso:', error);
      showNotification('Error al unirse al curso', 'error');
    }
  }

  function handleVerDetallesCurso(cursoId) {
    const curso = state.cursosDisponibles.find(c => c.id === parseInt(cursoId));
    if (!curso) return;

    // TODO: Implementar modal de detalles del curso
    showNotification(`Detalles del curso: ${curso.nombre}`, 'info');
  }

  function handleEntrarCurso(cursoId) {
    const curso = state.misCursos.find(c => c.id === parseInt(cursoId));
    if (!curso) return;

    // TODO: Redirigir a la página del curso
    showNotification(`Entrando al curso: ${curso.nombre}`, 'info');
    // window.location.href = `curso.html?id=${cursoId}`;
  }

  function handleUnirseSesion(sesionId) {
    const sesion = state.sesiones.find(s => s.id === parseInt(sesionId));
    if (!sesion) return;

    // TODO: Integrar con Jitsi Meet o sistema de videollamadas
    showNotification(`Uniéndose a la sesión: ${sesion.titulo}`, 'info');
    // window.location.href = `sesion.html?id=${sesionId}`;
  }

  function handleCerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      // TODO: Limpiar sesión y redirigir a login
      window.location.href = 'login.html';
    }
  }

  function handleEditarPerfil() {
    // TODO: Implementar edición de perfil
    showNotification('Funcionalidad en desarrollo', 'info');
  }

  // ========== UTILIDADES ==========
  function showNotification(message, type = 'info') {
    // Crear notificación simple
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 9999;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Agregar animación de fadeOut
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();

