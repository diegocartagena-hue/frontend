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
    setupStorageListener();
  });

  // ========== LISTENER PARA CAMBIOS EN LOCALSTORAGE ==========
  function setupStorageListener() {
    let lastCursosUpdate = localStorage.getItem('clasiya_cursos_updated') || '0';
    let lastSesionesUpdate = localStorage.getItem('clasiya_sesiones_updated') || '0';

    // Escuchar eventos personalizados (para cambios en la misma pestaña)
    window.addEventListener('cursosUpdated', function() {
      loadCursosDisponibles();
    });

    window.addEventListener('sesionesUpdated', function() {
      loadSesiones();
    });

    // Escuchar cambios en localStorage (funciona entre pestañas/ventanas)
    window.addEventListener('storage', function(e) {
      if (e.key === 'clasiya_cursos' || e.key === 'clasiya_cursos_updated') {
        loadCursosDisponibles();
      }
      if (e.key === 'clasiya_sesiones' || e.key === 'clasiya_sesiones_updated') {
        loadSesiones();
      }
    });

    // Recargar cursos cuando la ventana vuelve a tener foco
    window.addEventListener('focus', function() {
      loadCursosDisponibles();
      loadSesiones();
    });

    // Verificar cambios periódicamente cada 2 segundos
    setInterval(function() {
      const currentCursosUpdate = localStorage.getItem('clasiya_cursos_updated') || '0';
      const currentSesionesUpdate = localStorage.getItem('clasiya_sesiones_updated') || '0';
      
      if (currentCursosUpdate !== lastCursosUpdate) {
        lastCursosUpdate = currentCursosUpdate;
        loadCursosDisponibles();
      }
      
      if (currentSesionesUpdate !== lastSesionesUpdate) {
        lastSesionesUpdate = currentSesionesUpdate;
        loadSesiones();
      }
    }, 2000);
  }

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
      
      // Cargar cursos desde localStorage (cursos creados por maestros)
      const cursosGuardados = localStorage.getItem('clasiya_cursos');
      const cursosData = cursosGuardados ? JSON.parse(cursosGuardados) : [];

      // Cargar mis cursos para filtrar los que ya están inscritos
      const misCursosGuardados = localStorage.getItem('clasiya_mis_cursos');
      const misCursosIds = misCursosGuardados ? JSON.parse(misCursosGuardados).map(c => c.id) : [];

      // Agregar información adicional si falta y filtrar cursos ya inscritos
      const cursosConInfo = cursosData
        .filter(curso => !misCursosIds.includes(curso.id)) // Filtrar cursos ya inscritos
        .map(curso => ({
          ...curso,
          profesor: curso.profesor || 'Profesor',
          totalEstudiantes: curso.totalEstudiantes || 0,
          disponible: curso.disponible !== undefined ? curso.disponible : true
        }));

      state.cursosDisponibles = cursosConInfo;
      renderCursosDisponibles(cursosConInfo);
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
      
      // Cargar mis cursos desde localStorage
      const misCursosGuardados = localStorage.getItem('clasiya_mis_cursos');
      const misCursosData = misCursosGuardados ? JSON.parse(misCursosGuardados) : [];

      state.misCursos = misCursosData;
      renderMisCursos(misCursosData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar mis cursos:', error);
      showNotification('Error al cargar tus cursos', 'error');
    }
  }

  // Guardar mis cursos en localStorage
  function saveMisCursosToStorage() {
    try {
      localStorage.setItem('clasiya_mis_cursos', JSON.stringify(state.misCursos));
    } catch (error) {
      console.error('Error al guardar mis cursos:', error);
    }
  }

  // Actualizar contador de estudiantes en un curso
  function updateCursoEstudiantes(cursoId, incremento) {
    try {
      const cursosGuardados = localStorage.getItem('clasiya_cursos');
      if (cursosGuardados) {
        const cursos = JSON.parse(cursosGuardados);
        const cursoIndex = cursos.findIndex(c => c.id === parseInt(cursoId));
        if (cursoIndex !== -1) {
          cursos[cursoIndex].totalEstudiantes = (cursos[cursoIndex].totalEstudiantes || 0) + incremento;
          localStorage.setItem('clasiya_cursos', JSON.stringify(cursos));
        }
      }
    } catch (error) {
      console.error('Error al actualizar contador de estudiantes:', error);
    }
  }

  async function loadSesiones() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/sesiones');
      // const data = await response.json();
      
      // Cargar sesiones desde localStorage (sesiones creadas por maestros)
      const sesionesGuardadas = localStorage.getItem('clasiya_sesiones');
      const sesionesData = sesionesGuardadas ? JSON.parse(sesionesGuardadas) : [];

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

    // Limpiar backdrop cuando se cierra el modal
    const modalUnirseCurso = document.getElementById('modalUnirseCurso');
    if (modalUnirseCurso) {
      modalUnirseCurso.addEventListener('hidden.bs.modal', function() {
        // Limpiar backdrop si existe
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        // Remover clases del body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
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

      // Buscar curso por código de acceso en todos los cursos
      const todosLosCursos = localStorage.getItem('clasiya_cursos');
      const cursosData = todosLosCursos ? JSON.parse(todosLosCursos) : [];
      
      // Verificar si hay un curso seleccionado (cuando se abre desde el botón directo)
      const modalElement = document.getElementById('modalUnirseCurso');
      const cursoSeleccionadoId = modalElement ? modalElement.getAttribute('data-curso-id') : null;
      
      let cursoEncontrado = null;
      
      if (cursoSeleccionadoId) {
        // Si hay un curso seleccionado, buscar ese curso específico
        cursoEncontrado = cursosData.find(c => c.id === parseInt(cursoSeleccionadoId));
        
        if (!cursoEncontrado) {
          showNotification('Curso no encontrado', 'error');
          return;
        }
        
        // En un caso real, aquí se validaría que el código corresponda a este curso específico
        // Por ahora, solo verificamos que el curso exista y esté disponible
        if (!cursoEncontrado.disponible) {
          showNotification('Este curso no está disponible', 'error');
          return;
        }
      } else {
        // Si no hay curso seleccionado, buscar cualquier curso con el código
        // En un caso real, esto vendría del backend con el código
        // Por ahora, simulamos que el código es válido y tomamos el primer curso disponible
        cursoEncontrado = cursosData.find(c => {
          // En un caso real, aquí se validaría el código de acceso
          // Por ahora, tomamos cualquier curso disponible
          return c.disponible !== false;
        });
      }

      if (!cursoEncontrado) {
        showNotification('Código de acceso inválido o curso no disponible', 'error');
        return;
      }

      // Verificar si ya está inscrito
      const yaInscrito = state.misCursos.find(c => c.id === cursoEncontrado.id);
      if (yaInscrito) {
        showNotification('Ya estás inscrito en este curso', 'info');
        form.reset();
        const modalElement = document.getElementById('modalUnirseCurso');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        return;
      }

      // Agregar curso a mis cursos
      const nuevoCurso = {
        id: cursoEncontrado.id,
        nombre: cursoEncontrado.nombre || 'Curso Nuevo',
        profesor: cursoEncontrado.profesor || 'Profesor',
        progreso: 0
      };

      state.misCursos.push(nuevoCurso);
      saveMisCursosToStorage(); // Guardar en localStorage
      
      // Actualizar contador de estudiantes en el curso
      updateCursoEstudiantes(cursoEncontrado.id || nuevoCurso.id, 1);
      
      // Recargar cursos disponibles para actualizar la lista
      loadCursosDisponibles();
      
      renderMisCursos(state.misCursos);
      updateStats();

      // Limpiar formulario primero
      form.reset();
      
      // Limpiar atributos del curso seleccionado
      const modalElement = document.getElementById('modalUnirseCurso');
      if (modalElement) {
        modalElement.removeAttribute('data-curso-id');
        modalElement.removeAttribute('data-curso-nombre');
      }
      
      // Restaurar título del modal
      const modalTitle = document.querySelector('#modalUnirseCursoLabel');
      if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Unirse a un Curso';
      }

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(modalElement);
      
      if (modal) {
        // Cerrar el modal
        modal.hide();
        
        // Asegurarse de que el backdrop se elimine después de que el modal se cierre
        const cleanupBackdrop = function() {
          // Eliminar el backdrop manualmente si existe
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          // Remover la clase modal-open del body
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          // Remover el event listener después de usarlo
          modalElement.removeEventListener('hidden.bs.modal', cleanupBackdrop);
        };
        
        modalElement.addEventListener('hidden.bs.modal', cleanupBackdrop, { once: true });
        
        // También limpiar inmediatamente si el backdrop ya existe (fallback)
        setTimeout(function() {
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

    // Guardar el curso seleccionado para mostrarlo en el modal
    const modalElement = document.getElementById('modalUnirseCurso');
    if (!modalElement) return;

    modalElement.setAttribute('data-curso-id', cursoId);
    modalElement.setAttribute('data-curso-nombre', curso.nombre);
    
    // Mostrar información del curso en el modal (opcional)
    const modalTitle = document.querySelector('#modalUnirseCursoLabel');
    if (modalTitle) {
      modalTitle.innerHTML = `<i class="fas fa-sign-in-alt me-2"></i>Unirse a: ${curso.nombre}`;
    }

    // Limpiar el campo de código de acceso
    const codigoAccesoInput = document.getElementById('codigoAcceso');
    if (codigoAccesoInput) {
      codigoAccesoInput.value = '';
    }

    // Abrir el modal para ingresar el código de acceso
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Restaurar el título original cuando se cierre el modal
    modalElement.addEventListener('hidden.bs.modal', function restoreTitle() {
      const modalTitle = document.querySelector('#modalUnirseCursoLabel');
      if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Unirse a un Curso';
      }
      // Limpiar atributos del curso seleccionado
      modalElement.removeAttribute('data-curso-id');
      modalElement.removeAttribute('data-curso-nombre');
      // Remover el listener después de usarlo
      modalElement.removeEventListener('hidden.bs.modal', restoreTitle);
    }, { once: true });
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

