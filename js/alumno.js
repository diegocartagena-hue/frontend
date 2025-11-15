// Panel de Alumno - ClasiYA
(function () {
  'use strict';

  // Estado global
  const state = {
    alumno: null,
    cursosInscritos: [],
    cursosDisponibles: [],
    solicitudes: [],
    sesiones: []
  };

  // ========== INICIALIZACIÓN ==========
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    loadAlumnoProfile();
    loadCursosInscritos();
    loadCursosDisponibles();
    loadSolicitudes();
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
        totalCursos: 0,
        totalSolicitudes: 0,
        totalSesiones: 0
      };

      state.alumno = alumnoData;
      renderProfile(alumnoData);
    } catch (error) {
      console.error('Error al cargar perfil del alumno:', error);
      showNotification('Error al cargar el perfil', 'error');
    }
  }

  async function loadCursosInscritos() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/cursos');
      // const data = await response.json();
      
      // Datos de ejemplo
      const cursosData = [];

      state.cursosInscritos = cursosData;
      renderCursos(cursosData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      showNotification('Error al cargar los cursos', 'error');
    }
  }

  async function loadCursosDisponibles() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/cursos/disponibles');
      // const data = await response.json();
      
      // Datos de ejemplo - cursos que los maestros han creado
      const cursosDisponiblesData = [
        {
          id: 1,
          nombre: 'Matemáticas Avanzadas',
          descripcion: 'Curso de matemáticas para estudiantes avanzados',
          maestroNombre: 'Prof. Juan Pérez',
          maestroId: 1,
          totalEstudiantes: 15,
          totalSesiones: 5,
          categoria: 'matematicas'
        },
        {
          id: 2,
          nombre: 'Programación Web',
          descripcion: 'Aprende HTML, CSS y JavaScript desde cero',
          maestroNombre: 'Prof. María García',
          maestroId: 2,
          totalEstudiantes: 20,
          totalSesiones: 8,
          categoria: 'tecnologia'
        }
      ];

      state.cursosDisponibles = cursosDisponiblesData;
      renderCursosDisponibles(cursosDisponiblesData);
    } catch (error) {
      console.error('Error al cargar cursos disponibles:', error);
      showNotification('Error al cargar los cursos disponibles', 'error');
    }
  }

  async function loadSolicitudes() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/solicitudes');
      // const data = await response.json();
      
      // Datos de ejemplo
      const solicitudesData = [];

      state.solicitudes = solicitudesData;
      renderSolicitudes(solicitudesData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      showNotification('Error al cargar las solicitudes', 'error');
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
      updateStats();
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

  function renderCursos(cursos) {
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
      const sessionCount = card.querySelector('.session-count');
      const viewBtn = card.querySelector('.btn-view');
      const sessionsBtn = card.querySelector('.btn-sessions');

      if (title) title.textContent = curso.nombre;
      if (description) description.textContent = curso.descripcion;
      if (teacherName) teacherName.textContent = curso.maestroNombre || 'Sin asignar';
      if (sessionCount) sessionCount.textContent = curso.totalSesiones || 0;
      if (viewBtn) viewBtn.setAttribute('data-course-id', curso.id);
      if (sessionsBtn) sessionsBtn.setAttribute('data-course-id', curso.id);

      container.appendChild(card);
    });
  }

  function renderCursosDisponibles(cursos) {
    const container = document.getElementById('availableCoursesContainer');
    const template = document.getElementById('availableCourseTemplate');
    const emptyState = document.getElementById('emptyAvailableState');

    if (!container || !template) return;

    // Limpiar cursos existentes
    const existingCourses = container.querySelectorAll('.course-card:not(#availableCourseTemplate)');
    existingCourses.forEach(card => card.remove());

    // Filtrar cursos que ya están inscritos o tienen solicitud pendiente
    const cursosFiltrados = cursos.filter(curso => {
      const yaInscrito = state.cursosInscritos.some(c => c.id === curso.id);
      const solicitudPendiente = state.solicitudes.some(s => 
        s.cursoId === curso.id && s.estado === 'pendiente'
      );
      return !yaInscrito && !solicitudPendiente;
    });

    if (cursosFiltrados.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    cursosFiltrados.forEach(curso => {
      const card = template.cloneNode(true);
      card.id = `available-course-${curso.id}`;
      card.style.display = 'block';

      // Llenar datos
      const title = card.querySelector('.course-title');
      const description = card.querySelector('.course-description');
      const teacherName = card.querySelector('.teacher-name');
      const studentCount = card.querySelector('.student-count');
      const sessionCount = card.querySelector('.session-count');
      const requestBtn = card.querySelector('.btn-request');
      const viewBtn = card.querySelector('.btn-view');

      if (title) title.textContent = curso.nombre;
      if (description) description.textContent = curso.descripcion;
      if (teacherName) teacherName.textContent = curso.maestroNombre || 'Sin asignar';
      if (studentCount) studentCount.textContent = curso.totalEstudiantes || 0;
      if (sessionCount) sessionCount.textContent = curso.totalSesiones || 0;
      if (requestBtn) requestBtn.setAttribute('data-course-id', curso.id);
      if (viewBtn) viewBtn.setAttribute('data-course-id', curso.id);

      container.appendChild(card);
    });
  }

  function renderSolicitudes(solicitudes) {
    const container = document.getElementById('requestsContainer');
    const template = document.getElementById('requestTemplate');
    const emptyState = document.getElementById('emptyRequestsState');

    if (!container || !template) return;

    // Limpiar solicitudes existentes
    const existingRequests = container.querySelectorAll('.request-item:not(#requestTemplate)');
    existingRequests.forEach(item => item.remove());

    if (solicitudes.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Ordenar solicitudes: pendientes primero, luego por fecha
    const solicitudesOrdenadas = [...solicitudes].sort((a, b) => {
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
      if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
      return new Date(b.fecha) - new Date(a.fecha);
    });

    solicitudesOrdenadas.forEach(solicitud => {
      const item = template.cloneNode(true);
      item.id = `request-${solicitud.id}`;
      item.style.display = 'block';

      // Buscar información del curso
      const curso = state.cursosDisponibles.find(c => c.id === solicitud.cursoId) ||
                    state.cursosInscritos.find(c => c.id === solicitud.cursoId);

      // Llenar datos
      const courseTitle = item.querySelector('.request-course-title');
      const courseTeacher = item.querySelector('.request-course-teacher');
      const statusBadge = item.querySelector('.request-status-badge');
      const dateText = item.querySelector('.request-date-text');
      const message = item.querySelector('.request-message');
      const actions = item.querySelector('.request-actions');

      if (courseTitle) courseTitle.textContent = curso ? curso.nombre : 'Curso no encontrado';
      if (courseTeacher) courseTeacher.textContent = curso ? `Maestro: ${curso.maestroNombre}` : '';
      
      if (statusBadge) {
        statusBadge.setAttribute('data-status', solicitud.estado);
        statusBadge.textContent = getEstadoTexto(solicitud.estado);
        statusBadge.className = `request-status-badge status-${solicitud.estado}`;
      }

      if (dateText) {
        const fecha = new Date(solicitud.fecha);
        dateText.textContent = fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      if (message) {
        if (solicitud.mensaje) {
          message.textContent = solicitud.mensaje;
          message.style.display = 'block';
        } else {
          message.style.display = 'none';
        }
      }

      // Acciones según el estado
      if (actions) {
        actions.innerHTML = '';
        if (solicitud.estado === 'pendiente') {
          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'btn btn-cancel-request';
          cancelBtn.innerHTML = '<i class="fas fa-times me-2"></i>Cancelar Solicitud';
          cancelBtn.addEventListener('click', () => handleCancelarSolicitud(solicitud.id));
          actions.appendChild(cancelBtn);
        }
      }

      container.appendChild(item);
    });
  }

  function getEstadoTexto(estado) {
    const estados = {
      'pendiente': 'Pendiente',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada'
    };
    return estados[estado] || estado;
  }

  function renderSesiones(sesiones) {
    const container = document.getElementById('sessionsList');
    const template = document.getElementById('sessionTemplate');
    const emptyState = document.getElementById('emptySessionsState');

    if (!container || !template) return;

    // Limpiar sesiones existentes
    const existingSessions = container.querySelectorAll('.session-item:not(#sessionTemplate)');
    existingSessions.forEach(item => item.remove());

    // Ordenar sesiones por fecha
    const sesionesOrdenadas = [...sesiones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (sesionesOrdenadas.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    sesionesOrdenadas.forEach(sesion => {
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
      const teacherName = item.querySelector('.session-teacher .teacher-name');
      const joinBtn = item.querySelector('.btn-session-join');

      if (day) day.textContent = dia;
      if (time) time.textContent = `${mes} ${hora}`;
      if (title) title.textContent = sesion.titulo;
      if (course) course.textContent = sesion.cursoNombre;
      if (teacherName) teacherName.textContent = sesion.maestroNombre || 'Sin asignar';
      if (joinBtn) joinBtn.setAttribute('data-session-id', sesion.id);

      container.appendChild(item);
    });
  }

  function updateStats() {
    const totalCursosInscritos = document.getElementById('totalCursosInscritos');
    const totalSolicitudesPendientes = document.getElementById('totalSolicitudesPendientes');
    const totalSesiones = document.getElementById('totalSesiones');

    if (totalCursosInscritos) totalCursosInscritos.textContent = state.cursosInscritos.length;
    
    const solicitudesPendientes = state.solicitudes.filter(s => s.estado === 'pendiente').length;
    if (totalSolicitudesPendientes) totalSolicitudesPendientes.textContent = solicitudesPendientes;
    
    if (totalSesiones) totalSesiones.textContent = state.sesiones.length;
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Botones de acciones de curso
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-view')) {
        const cursoId = e.target.closest('.btn-view').getAttribute('data-course-id');
        handleVerDetallesCurso(cursoId);
      }
      if (e.target.closest('.btn-sessions')) {
        const cursoId = e.target.closest('.btn-sessions').getAttribute('data-course-id');
        handleVerSesionesCurso(cursoId);
      }
      if (e.target.closest('.btn-request')) {
        const cursoId = e.target.closest('.btn-request').getAttribute('data-course-id');
        handleEnviarSolicitud(cursoId);
      }
      if (e.target.closest('.btn-session-join')) {
        const sesionId = e.target.closest('.btn-session-join').getAttribute('data-session-id');
        handleUnirseSesion(sesionId);
      }
      if (e.target.closest('.btn-session-join-modal')) {
        const sesionId = e.target.closest('.btn-session-join-modal').getAttribute('data-session-id');
        handleUnirseSesion(sesionId);
      }
    });

    // Botón enviar solicitud
    const btnEnviarSolicitud = document.getElementById('btnEnviarSolicitud');
    if (btnEnviarSolicitud) {
      btnEnviarSolicitud.addEventListener('click', handleConfirmarEnviarSolicitud);
    }

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

    // Cambio de tabs
    const tabs = document.querySelectorAll('#cursosTabs button[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', function (e) {
        // Recargar datos cuando se cambia de tab
        if (e.target.id === 'cursos-disponibles-tab') {
          loadCursosDisponibles();
        } else if (e.target.id === 'solicitudes-tab') {
          loadSolicitudes();
        }
      });
    });
  }

  // ========== MANEJO DE SOLICITUDES ==========
  function handleEnviarSolicitud(cursoId) {
    const curso = state.cursosDisponibles.find(c => c.id === parseInt(cursoId));
    if (!curso) {
      showNotification('Curso no encontrado', 'error');
      return;
    }

    // Verificar si ya tiene una solicitud pendiente
    const solicitudExistente = state.solicitudes.find(s => 
      s.cursoId === parseInt(cursoId) && s.estado === 'pendiente'
    );
    if (solicitudExistente) {
      showNotification('Ya tienes una solicitud pendiente para este curso', 'info');
      return;
    }

    // Guardar cursoId en el modal
    document.getElementById('modalEnviarSolicitud').setAttribute('data-curso-id', cursoId);
    
    // Limpiar mensaje
    const mensajeInput = document.getElementById('solicitudMensaje');
    if (mensajeInput) mensajeInput.value = '';

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEnviarSolicitud'));
    modal.show();
  }

  async function handleConfirmarEnviarSolicitud() {
    const modal = document.getElementById('modalEnviarSolicitud');
    const cursoId = modal.getAttribute('data-curso-id');
    const mensaje = document.getElementById('solicitudMensaje').value.trim();

    if (!cursoId) {
      showNotification('Error: No se pudo identificar el curso', 'error');
      return;
    }

    const curso = state.cursosDisponibles.find(c => c.id === parseInt(cursoId));
    if (!curso) {
      showNotification('Curso no encontrado', 'error');
      return;
    }

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/alumno/solicitudes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     cursoId: parseInt(cursoId),
      //     mensaje: mensaje
      //   })
      // });
      // const nuevaSolicitud = await response.json();

      // Simulación
      const nuevaSolicitud = {
        id: Date.now(),
        cursoId: parseInt(cursoId),
        cursoNombre: curso.nombre,
        maestroNombre: curso.maestroNombre,
        mensaje: mensaje || null,
        estado: 'pendiente',
        fecha: new Date().toISOString()
      };

      state.solicitudes.push(nuevaSolicitud);
      renderSolicitudes(state.solicitudes);
      updateStats();

      // Cerrar modal
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();

      showNotification('Solicitud enviada exitosamente. El maestro la revisará pronto.', 'success');

      // Recargar cursos disponibles para ocultar el curso solicitado
      loadCursosDisponibles();
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      showNotification('Error al enviar la solicitud', 'error');
    }
  }

  async function handleCancelarSolicitud(solicitudId) {
    if (!confirm('¿Estás seguro de cancelar esta solicitud?')) return;

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/alumno/solicitudes/${solicitudId}`, {
      //   method: 'DELETE'
      // });

      // Simulación
      state.solicitudes = state.solicitudes.filter(s => s.id !== solicitudId);
      renderSolicitudes(state.solicitudes);
      updateStats();

      showNotification('Solicitud cancelada', 'success');

      // Recargar cursos disponibles
      loadCursosDisponibles();
    } catch (error) {
      console.error('Error al cancelar solicitud:', error);
      showNotification('Error al cancelar la solicitud', 'error');
    }
  }

  // ========== MANEJO DE CURSOS Y SESIONES ==========
  function handleVerDetallesCurso(cursoId) {
    let curso = state.cursosInscritos.find(c => c.id === parseInt(cursoId));
    if (!curso) {
      curso = state.cursosDisponibles.find(c => c.id === parseInt(cursoId));
    }
    
    if (!curso) {
      showNotification('Curso no encontrado', 'error');
      return;
    }

    const detallesContainer = document.getElementById('cursoDetalles');
    const modalTitulo = document.getElementById('modalDetallesCursoLabel');
    
    if (detallesContainer) {
      detallesContainer.innerHTML = `
        <div class="curso-detalle-item mb-3">
          <h5 class="mb-2"><i class="fas fa-book me-2"></i>${curso.nombre}</h5>
          <p class="text-muted">${curso.descripcion || 'Sin descripción'}</p>
        </div>
        <div class="curso-detalle-item mb-3">
          <h6><i class="fas fa-chalkboard-teacher me-2"></i>Maestro</h6>
          <p>${curso.maestroNombre || 'Sin asignar'}</p>
        </div>
        <div class="curso-detalle-item mb-3">
          <h6><i class="fas fa-calendar me-2"></i>Sesiones Programadas</h6>
          <p>${curso.totalSesiones || 0} sesiones</p>
        </div>
        ${curso.totalEstudiantes !== undefined ? `
        <div class="curso-detalle-item mb-3">
          <h6><i class="fas fa-users me-2"></i>Estudiantes</h6>
          <p>${curso.totalEstudiantes} estudiantes</p>
        </div>
        ` : ''}
      `;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalDetallesCurso'));
    modal.show();
  }

  function handleVerSesionesCurso(cursoId) {
    const curso = state.cursosInscritos.find(c => c.id === parseInt(cursoId));
    if (!curso) {
      showNotification('Curso no encontrado', 'error');
      return;
    }

    // Filtrar sesiones del curso
    const sesionesCurso = state.sesiones.filter(s => s.cursoId === parseInt(cursoId));
    
    renderSesionesModal(curso.nombre, sesionesCurso);

    const modal = new bootstrap.Modal(document.getElementById('modalSesionesCurso'));
    modal.show();
  }

  function renderSesionesModal(cursoNombre, sesiones) {
    const container = document.getElementById('sessionsListModal');
    const template = document.getElementById('sessionItemTemplate');
    const emptyState = document.getElementById('emptySessionsModalState');
    const modalTitulo = document.getElementById('modalCursoNombreSesiones');

    if (!container || !template) return;

    if (modalTitulo) modalTitulo.textContent = cursoNombre;

    // Limpiar sesiones existentes
    const existingSessions = container.querySelectorAll('.session-item-modal:not(#sessionItemTemplate)');
    existingSessions.forEach(item => item.remove());

    // Ordenar sesiones por fecha
    const sesionesOrdenadas = [...sesiones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (sesionesOrdenadas.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    sesionesOrdenadas.forEach(sesion => {
      const item = template.cloneNode(true);
      item.id = `session-modal-${sesion.id}`;
      item.style.display = 'flex';

      const fecha = new Date(sesion.fecha);
      const dia = fecha.getDate();
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
      const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      const dayModal = item.querySelector('.session-day-modal');
      const timeModal = item.querySelector('.session-time-modal');
      const titleModal = item.querySelector('.session-title-modal');
      const durationModal = item.querySelector('.session-duration-modal');
      const joinBtnModal = item.querySelector('.btn-session-join-modal');

      if (dayModal) dayModal.textContent = dia;
      if (timeModal) timeModal.textContent = `${mes} ${hora}`;
      if (titleModal) titleModal.textContent = sesion.titulo;
      if (durationModal) durationModal.textContent = `Duración: ${sesion.duracion || 60} minutos`;
      if (joinBtnModal) joinBtnModal.setAttribute('data-session-id', sesion.id);

      container.appendChild(item);
    });
  }

  function handleUnirseSesion(sesionId) {
    const sesion = state.sesiones.find(s => s.id === parseInt(sesionId));
    if (!sesion) {
      showNotification('Sesión no encontrada', 'error');
      return;
    }

    // Verificar si la sesión ya pasó
    const ahora = new Date();
    const fechaSesion = new Date(sesion.fecha);
    
    if (fechaSesion < ahora) {
      showNotification('Esta sesión ya ha finalizado', 'info');
      return;
    }

    // Verificar si el alumno está inscrito en el curso
    const cursoInscrito = state.cursosInscritos.find(c => c.id === sesion.cursoId);
    if (!cursoInscrito) {
      showNotification('Debes estar inscrito en el curso para unirte a la sesión', 'error');
      return;
    }

    // TODO: Integrar con Jitsi Meet
    // Por ahora, redirigir a una página de sesión
    showNotification('Redirigiendo a la sesión...', 'info');
    setTimeout(() => {
      window.location.href = `sesiones.html?id=${sesionId}&tipo=alumno`;
    }, 1000);
  }

  // ========== OTRAS FUNCIONES ==========
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
