// Panel de Maestro - ClasiYA
(function () {
  'use strict';

  // Estado global
  const state = {
    maestro: null,
    cursos: [],
    sesiones: [],
    codigosAcceso: {},
    profilePhotoFile: null // Para almacenar la foto seleccionada
  };

  // ========== INICIALIZACIÓN ==========
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    loadMaestroProfile();
    loadCursos();
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
  async function loadMaestroProfile() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/perfil');
      // const data = await response.json();
      
      // Datos de ejemplo
      const maestroData = {
        id: 1,
        nombre: 'Prof. Juan Pérez',
        email: 'juan.perez@clasiya.com',
        avatar: 'assets/logosinfondo.png',
        edad: null,
        biografia: '',
        experiencia: '',
        especialidades: '',
        totalCursos: 0,
        totalEstudiantes: 0,
        totalSesiones: 0
      };

      state.maestro = maestroData;
      renderProfile(maestroData);
    } catch (error) {
      console.error('Error al cargar perfil del maestro:', error);
      showNotification('Error al cargar el perfil', 'error');
    }
  }

  async function loadCursos() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/cursos');
      // const data = await response.json();
      
      // Cargar cursos desde localStorage
      const cursosGuardados = localStorage.getItem('clasiya_cursos');
      const cursosData = cursosGuardados ? JSON.parse(cursosGuardados) : [];

      state.cursos = cursosData;
      renderCursos(cursosData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      showNotification('Error al cargar los cursos', 'error');
    }
  }

  // Guardar cursos en localStorage
  function saveCursosToStorage() {
    try {
      localStorage.setItem('clasiya_cursos', JSON.stringify(state.cursos));
      // Actualizar timestamp para notificar cambios
      localStorage.setItem('clasiya_cursos_updated', Date.now().toString());
      // Disparar evento personalizado para notificar cambios en la misma pestaña
      window.dispatchEvent(new CustomEvent('cursosUpdated'));
    } catch (error) {
      console.error('Error al guardar cursos:', error);
    }
  }
  async function loadSesiones() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/sesiones');
      // const data = await response.json();
      
      // Cargar sesiones desde localStorage
      const sesionesGuardadas = localStorage.getItem('clasiya_sesiones');
      const sesionesData = sesionesGuardadas ? JSON.parse(sesionesGuardadas) : [];

      state.sesiones = sesionesData;
      renderSesiones(sesionesData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
      showNotification('Error al cargar las sesiones', 'error');
    }
  }

  // Guardar sesiones en localStorage
  function saveSesionesToStorage() {
    try {
      localStorage.setItem('clasiya_sesiones', JSON.stringify(state.sesiones));
      // Actualizar timestamp para notificar cambios
      localStorage.setItem('clasiya_sesiones_updated', Date.now().toString());
      // Disparar evento personalizado para notificar cambios en la misma pestaña
      window.dispatchEvent(new CustomEvent('sesionesUpdated'));
    } catch (error) {
      console.error('Error al guardar sesiones:', error);
    }
  }
  // ========== RENDERIZADO ==========
  function renderProfile(maestro) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');

    if (profileName) profileName.textContent = maestro.nombre;
    if (profileEmail) profileEmail.textContent = maestro.email;
    if (profileAvatar) profileAvatar.src = maestro.avatar;
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
      const studentCount = card.querySelector('.student-count');
      const sessionCount = card.querySelector('.session-count');
      const viewBtn = card.querySelector('.btn-view');
      const sessionsBtn = card.querySelector('.btn-sessions');
      const codesBtn = card.querySelector('.btn-codes');

      if (title) title.textContent = curso.nombre;
      if (description) description.textContent = curso.descripcion;
      if (studentCount) studentCount.textContent = curso.totalEstudiantes || 0;
      if (sessionCount) sessionCount.textContent = curso.totalSesiones || 0;
      if (viewBtn) viewBtn.setAttribute('data-course-id', curso.id);
      if (sessionsBtn) sessionsBtn.setAttribute('data-course-id', curso.id);
      if (codesBtn) codesBtn.setAttribute('data-course-id', curso.id);

      container.appendChild(card);
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
      const editBtn = item.querySelector('.btn-session-edit');

      if (day) day.textContent = dia;
      if (time) time.textContent = `${mes} ${hora}`;
      if (title) title.textContent = sesion.titulo;
      if (course) course.textContent = sesion.cursoNombre;
      if (codeValue) codeValue.textContent = sesion.codigoAcceso;
      if (joinBtn) joinBtn.setAttribute('data-session-id', sesion.id);
      if (editBtn) editBtn.setAttribute('data-session-id', sesion.id);

      container.appendChild(item);
    });
  }

  function updateStats() {
    const totalCursos = document.getElementById('totalCursos');
    const totalEstudiantes = document.getElementById('totalEstudiantes');
    const totalSesiones = document.getElementById('totalSesiones');

    if (totalCursos) totalCursos.textContent = state.cursos.length;
    if (totalSesiones) totalSesiones.textContent = state.sesiones.length;

    // Calcular total de estudiantes
    const estudiantes = state.cursos.reduce((sum, curso) => sum + (curso.totalEstudiantes || 0), 0);
    if (totalEstudiantes) totalEstudiantes.textContent = estudiantes;
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Configurar limpieza del backdrop para los modales
    const modalCrearCurso = document.getElementById('modalCrearCurso');
    if (modalCrearCurso) {
      modalCrearCurso.addEventListener('hidden.bs.modal', function() {
        cleanupModalBackdrop();
      });
    }

    const modalEditarPerfil = document.getElementById('modalEditarPerfil');
    if (modalEditarPerfil) {
      modalEditarPerfil.addEventListener('hidden.bs.modal', function() {
        cleanupModalBackdrop();
      });
    }

    // Botón crear curso
    const btnCrearCurso = document.getElementById('btnCrearCurso');
    const btnCrearCursoEmpty = document.getElementById('btnCrearCursoEmpty');
    if (btnCrearCurso) {
      btnCrearCurso.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('modalCrearCurso'));
        modal.show();
      });
    }
    if (btnCrearCursoEmpty) {
      btnCrearCursoEmpty.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('modalCrearCurso'));
        modal.show();
      });
    }

    // Botón guardar curso
    const btnGuardarCurso = document.getElementById('btnGuardarCurso');
    if (btnGuardarCurso) {
      btnGuardarCurso.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleCrearCurso();
      });
    }

    // Prevenir envío del formulario al presionar Enter
    const formCrearCurso = document.getElementById('formCrearCurso');
    if (formCrearCurso) {
      formCrearCurso.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleCrearCurso();
      });
    }

    // Botón nueva sesión
    const btnNuevaSesion = document.getElementById('btnNuevaSesion');
    if (btnNuevaSesion) {
      btnNuevaSesion.addEventListener('click', () => {
        loadCursosForSesion();
        const modal = new bootstrap.Modal(document.getElementById('modalCrearSesion'));
        modal.show();
      });
    }

    // Botón guardar sesión
    const btnGuardarSesion = document.getElementById('btnGuardarSesion');
    if (btnGuardarSesion) {
      btnGuardarSesion.addEventListener('click', handleCrearSesion);
    }

    // Botones de acciones de curso
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-codes')) {
        const cursoId = e.target.closest('.btn-codes').getAttribute('data-course-id');
        handleVerCodigos(cursoId);
      }
      if (e.target.closest('.btn-sessions')) {
        const cursoId = e.target.closest('.btn-sessions').getAttribute('data-course-id');
        handleVerSesionesCurso(cursoId);
      }
      if (e.target.closest('.btn-session-join')) {
        const sesionId = e.target.closest('.btn-session-join').getAttribute('data-session-id');
        handleIniciarSesion(sesionId);
      }
      if (e.target.closest('.btn-copy-code')) {
        const codigo = e.target.closest('.btn-copy-code').getAttribute('data-code');
        handleCopiarCodigo(codigo);
      }
      if (e.target.closest('.btn-delete-code')) {
        const codeId = e.target.closest('.btn-delete-code').getAttribute('data-code-id');
        handleEliminarCodigo(codeId);
      }
    });

    // Botón generar código
    const btnGenerarCodigo = document.getElementById('btnGenerarCodigo');
    if (btnGenerarCodigo) {
      btnGenerarCodigo.addEventListener('click', handleGenerarCodigo);
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

    // Botón guardar perfil
    const btnGuardarPerfil = document.getElementById('btnGuardarPerfil');
    if (btnGuardarPerfil) {
      btnGuardarPerfil.addEventListener('click', handleGuardarPerfil);
    }

    // Botón subir foto y preview de foto
    const btnUploadPhoto = document.getElementById('btnUploadPhoto');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profilePreview = document.getElementById('profilePreview');
    const profilePreviewImg = document.getElementById('profilePreviewImg');

    if (btnUploadPhoto && profilePhotoInput) {
      btnUploadPhoto.addEventListener('click', () => {
        profilePhotoInput.click();
      });
    }

    if (profilePreview && profilePhotoInput) {
      profilePreview.addEventListener('click', () => {
        profilePhotoInput.click();
      });
    }

    if (profilePhotoInput && profilePreviewImg) {
      profilePhotoInput.addEventListener('change', function(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
          showNotification('El archivo es demasiado grande. El tamaño máximo es 2MB.', 'error');
          profilePhotoInput.value = '';
          return;
        }

        // Validar tipo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          showNotification('Formato no válido. Solo se aceptan JPG o PNG.', 'error');
          profilePhotoInput.value = '';
          return;
        }

        // Guardar archivo en el estado
        state.profilePhotoFile = file;

        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
          profilePreviewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);

        showNotification('Foto seleccionada correctamente', 'success');
      });
    }
  }

  // ========== MANEJO DE FORMULARIOS ==========
  async function handleCrearCurso() {
    const form = document.getElementById('formCrearCurso');
    if (!form || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cursoData = {
      nombre: document.getElementById('cursoNombre').value,
      descripcion: document.getElementById('cursoDescripcion').value,
      categoria: document.getElementById('cursoCategoria').value
    };

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/cursos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cursoData)
      // });
      // const nuevoCurso = await response.json();

      // Simulación
      const nuevoCurso = {
        id: Date.now(),
        ...cursoData,
        totalEstudiantes: 0,
        totalSesiones: 0,
        profesor: state.maestro ? state.maestro.nombre : 'Profesor',
        disponible: true
      };

      state.cursos.push(nuevoCurso);
      saveCursosToStorage(); // Guardar en localStorage
      renderCursos(state.cursos);
      updateStats();

      // Limpiar formulario primero
      form.reset();

      // Cerrar modal
      const modalElement = document.getElementById('modalCrearCurso');
      const modal = bootstrap.Modal.getInstance(modalElement);
      
      if (modal) {
        // Cerrar el modal
        modal.hide();
        
        // La limpieza del backdrop se manejará automáticamente por el event listener
        // Agregar un timeout adicional como fallback
        setTimeout(function() {
          cleanupModalBackdrop();
        }, 300);
      }

      showNotification('Curso creado exitosamente', 'success');
    } catch (error) {
      console.error('Error al crear curso:', error);
      showNotification('Error al crear el curso', 'error');
    }
  }

  async function handleCrearSesion() {
    const form = document.getElementById('formCrearSesion');
    if (!form || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const cursoId = document.getElementById('sesionCurso').value;
    const fecha = document.getElementById('sesionFecha').value;
    const hora = document.getElementById('sesionHora').value;
    const fechaHora = new Date(`${fecha}T${hora}`);

    const sesionData = {
      cursoId: parseInt(cursoId),
      titulo: document.getElementById('sesionTitulo').value,
      fecha: fechaHora.toISOString(),
      duracion: parseInt(document.getElementById('sesionDuracion').value),
      codigoAcceso: generarCodigoAcceso()
    };

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/sesiones', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(sesionData)
      // });
      // const nuevaSesion = await response.json();

      // Simulación
      const curso = state.cursos.find(c => c.id === parseInt(cursoId));
      const nuevaSesion = {
        id: Date.now(),
        ...sesionData,
        cursoNombre: curso ? curso.nombre : 'Curso sin nombre'
      };

      state.sesiones.push(nuevaSesion);
      saveSesionesToStorage(); // Guardar en localStorage
      renderSesiones(state.sesiones);
      updateStats();

      // Cerrar modal y limpiar formulario
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearSesion'));
      if (modal) modal.hide();
      form.reset();

      showNotification('Sesión creada exitosamente', 'success');
    } catch (error) {
      console.error('Error al crear sesión:', error);
      showNotification('Error al crear la sesión', 'error');
    }
  }

  function loadCursosForSesion() {
    const select = document.getElementById('sesionCurso');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un curso</option>';
    state.cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso.id;
      option.textContent = curso.nombre;
      select.appendChild(option);
    });
  }

  // ========== CÓDIGOS DE ACCESO ==========
  function handleVerCodigos(cursoId) {
    const curso = state.cursos.find(c => c.id === parseInt(cursoId));
    if (!curso) return;

    // Cargar códigos del curso
    loadCodigosCurso(cursoId);

    // Mostrar modal
    const modalNombre = document.getElementById('modalCursoNombre');
    if (modalNombre) modalNombre.textContent = curso.nombre;

    const modal = new bootstrap.Modal(document.getElementById('modalCodigosAcceso'));
    modal.show();

    // Guardar curso actual
    document.getElementById('modalCodigosAcceso').setAttribute('data-curso-id', cursoId);
  }

  async function loadCodigosCurso(cursoId) {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/maestro/cursos/${cursoId}/codigos`);
      // const codigos = await response.json();

      // Simulación
      const codigos = state.codigosAcceso[cursoId] || [];

      renderCodigos(codigos);
    } catch (error) {
      console.error('Error al cargar códigos:', error);
      showNotification('Error al cargar los códigos', 'error');
    }
  }

  function renderCodigos(codigos) {
    const container = document.getElementById('codesList');
    const template = document.getElementById('codeTemplate');
    const emptyState = document.getElementById('emptyCodesState');

    if (!container || !template) return;

    // Limpiar códigos existentes
    const existingCodes = container.querySelectorAll('.code-item:not(#codeTemplate)');
    existingCodes.forEach(item => item.remove());

    if (codigos.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    codigos.forEach(codigo => {
      const item = template.cloneNode(true);
      item.id = `code-${codigo.id}`;
      item.style.display = 'flex';

      const codeValue = item.querySelector('.code-value-display');
      const codeStudent = item.querySelector('.code-student');
      const codeStatus = item.querySelector('.code-status');
      const copyBtn = item.querySelector('.btn-copy-code');
      const deleteBtn = item.querySelector('.btn-delete-code');

      if (codeValue) codeValue.textContent = codigo.codigo;
      if (codeStudent) codeStudent.textContent = codigo.estudianteNombre || 'Sin asignar';
      if (codeStatus) {
        codeStatus.textContent = codigo.activo ? 'Activo' : 'Inactivo';
        codeStatus.className = `code-status ${codigo.activo ? 'active' : 'inactive'}`;
      }
      if (copyBtn) copyBtn.setAttribute('data-code', codigo.codigo);
      if (deleteBtn) deleteBtn.setAttribute('data-code-id', codigo.id);

      container.appendChild(item);
    });
  }

  async function handleGenerarCodigo() {
    const modal = document.getElementById('modalCodigosAcceso');
    const cursoId = modal.getAttribute('data-curso-id');
    if (!cursoId) return;

    const nuevoCodigo = {
      id: Date.now(),
      codigo: generarCodigoAcceso(),
      cursoId: parseInt(cursoId),
      estudianteNombre: null,
      activo: true
    };

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/maestro/cursos/${cursoId}/codigos`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ codigo: nuevoCodigo.codigo })
      // });
      // const codigoCreado = await response.json();

      // Simulación
      if (!state.codigosAcceso[cursoId]) {
        state.codigosAcceso[cursoId] = [];
      }
      state.codigosAcceso[cursoId].push(nuevoCodigo);

      loadCodigosCurso(cursoId);
      showNotification('Código generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar código:', error);
      showNotification('Error al generar el código', 'error');
    }
  }

  function generarCodigoAcceso() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  }

  function handleCopiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
      showNotification('Código copiado al portapapeles', 'success');
    }).catch(err => {
      console.error('Error al copiar código:', err);
      showNotification('Error al copiar el código', 'error');
    });
  }

  async function handleEliminarCodigo(codeId) {
    if (!confirm('¿Estás seguro de eliminar este código?')) return;

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/maestro/codigos/${codeId}`, {
      //   method: 'DELETE'
      // });

      // Simulación
      const modal = document.getElementById('modalCodigosAcceso');
      const cursoId = modal.getAttribute('data-curso-id');
      if (cursoId && state.codigosAcceso[cursoId]) {
        state.codigosAcceso[cursoId] = state.codigosAcceso[cursoId].filter(c => c.id !== parseInt(codeId));
        loadCodigosCurso(cursoId);
        showNotification('Código eliminado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar código:', error);
      showNotification('Error al eliminar el código', 'error');
    }
  }

  // ========== OTRAS FUNCIONES ==========
  function handleIniciarSesion(sesionId) {
    const sesion = state.sesiones.find(s => s.id === parseInt(sesionId));
    if (!sesion) return;

    // TODO: Integrar con Jitsi Meet
    // Por ahora, redirigir a una página de sesión
    window.location.href = `sesiones.html?id=${sesionId}`;
  }

  function handleVerSesionesCurso(cursoId) {
    // Filtrar sesiones por curso y mostrarlas
    const sesionesCurso = state.sesiones.filter(s => s.cursoId === parseInt(cursoId));
    // TODO: Implementar vista de sesiones por curso
    console.log('Sesiones del curso:', sesionesCurso);
  }

  function handleCerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      // TODO: Limpiar sesión y redirigir a login
      window.location.href = 'login.html';
    }
  }

  function handleEditarPerfil() {
    if (!state.maestro) return;

    // Cargar datos actuales en el formulario
    const perfilNombre = document.getElementById('perfilNombre');
    const perfilEmail = document.getElementById('perfilEmail');
    const perfilEdad = document.getElementById('perfilEdad');
    const perfilBiografia = document.getElementById('perfilBiografia');
    const perfilExperiencia = document.getElementById('perfilExperiencia');
    const perfilEspecialidades = document.getElementById('perfilEspecialidades');
    const profilePreviewImg = document.getElementById('profilePreviewImg');

    if (perfilNombre) perfilNombre.value = state.maestro.nombre || '';
    if (perfilEmail) perfilEmail.value = state.maestro.email || '';
    if (perfilEdad) perfilEdad.value = state.maestro.edad || '';
    if (perfilBiografia) perfilBiografia.value = state.maestro.biografia || '';
    if (perfilExperiencia) perfilExperiencia.value = state.maestro.experiencia || '';
    if (perfilEspecialidades) perfilEspecialidades.value = state.maestro.especialidades || '';
    if (profilePreviewImg) profilePreviewImg.src = state.maestro.avatar || 'assets/logosinfondo.png';

    // Limpiar archivo seleccionado
    state.profilePhotoFile = null;
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    if (profilePhotoInput) profilePhotoInput.value = '';

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarPerfil'));
    modal.show();
  }

  async function handleGuardarPerfil() {
    const form = document.getElementById('formEditarPerfil');
    if (!form) return;

    const perfilNombre = document.getElementById('perfilNombre');
    const perfilEdad = document.getElementById('perfilEdad');
    const perfilBiografia = document.getElementById('perfilBiografia');
    const perfilExperiencia = document.getElementById('perfilExperiencia');
    const perfilEspecialidades = document.getElementById('perfilEspecialidades');

    if (!perfilNombre || !perfilNombre.value.trim()) {
      showNotification('El nombre es obligatorio', 'error');
      perfilNombre.focus();
      return;
    }

    try {
      // Preparar datos para enviar
      const formData = new FormData();
      formData.append('nombre', perfilNombre.value.trim());
      if (perfilEdad && perfilEdad.value) {
        formData.append('edad', parseInt(perfilEdad.value));
      }
      if (perfilBiografia) {
        formData.append('biografia', perfilBiografia.value.trim());
      }
      if (perfilExperiencia) {
        formData.append('experiencia', perfilExperiencia.value.trim());
      }
      if (perfilEspecialidades) {
        formData.append('especialidades', perfilEspecialidades.value.trim());
      }
      if (state.profilePhotoFile) {
        formData.append('foto', state.profilePhotoFile);
      }

      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/maestro/perfil', {
      //   method: 'PUT',
      //   body: formData
      // });
      // const updatedProfile = await response.json();

      // Simulación - Actualizar estado local
      const updatedMaestro = {
        ...state.maestro,
        nombre: perfilNombre.value.trim(),
        edad: perfilEdad && perfilEdad.value ? parseInt(perfilEdad.value) : null,
        biografia: perfilBiografia ? perfilBiografia.value.trim() : '',
        experiencia: perfilExperiencia ? perfilExperiencia.value.trim() : '',
        especialidades: perfilEspecialidades ? perfilEspecialidades.value.trim() : ''
      };

      // Si hay una nueva foto, actualizar el avatar (en producción sería la URL de la imagen subida)
      if (state.profilePhotoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          updatedMaestro.avatar = e.target.result;
          state.maestro = updatedMaestro;
          renderProfile(updatedMaestro);
        };
        reader.readAsDataURL(state.profilePhotoFile);
      } else {
        state.maestro = updatedMaestro;
        renderProfile(updatedMaestro);
      }

      // Cerrar modal
      const modalElement = document.getElementById('modalEditarPerfil');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        setTimeout(function() {
          cleanupModalBackdrop();
        }, 300);
      }

      showNotification('Perfil actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showNotification('Error al actualizar el perfil', 'error');
    }
  }

  // ========== UTILIDADES ==========
  function cleanupModalBackdrop() {
    // Eliminar todos los backdrops que puedan existir
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Remover clases y estilos del body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Asegurarse de que no haya modales abiertos
    const openModals = document.querySelectorAll('.modal.show');
    if (openModals.length === 0) {
      // Si no hay modales abiertos, forzar limpieza
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

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
