// Sesión de Videollamada con Jitsi Meet - ClasiYA
(function () {
  'use strict';

  // Estado global
  const state = {
    sesionId: null,
    sesionData: null,
    jitsiApi: null,
    tipoUsuario: 'alumno', // 'maestro' o 'alumno'
    startTime: null,
    timerInterval: null,
    participantCount: 0
  };

  // ========== INICIALIZACIÓN ==========
  document.addEventListener('DOMContentLoaded', function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    state.sesionId = urlParams.get('id');
    state.tipoUsuario = urlParams.get('tipo') || 'alumno';

    if (!state.sesionId) {
      showError('No se proporcionó un ID de sesión');
      return;
    }

    loadSesionData();
    setupEventListeners();
  });

  // ========== CARGA DE DATOS ==========
  async function loadSesionData() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/sesiones/${state.sesionId}`);
      // const data = await response.json();
      // state.sesionData = data;

      // Cargar desde localStorage
      const sesionesGuardadas = localStorage.getItem('clasiya_sesiones');
      const sesiones = sesionesGuardadas ? JSON.parse(sesionesGuardadas) : [];
      state.sesionData = sesiones.find(s => s.id === parseInt(state.sesionId));

      if (!state.sesionData) {
        showError('Sesión no encontrada');
        return;
      }

      // Actualizar UI
      updateSessionInfo();
      
      // Inicializar Jitsi
      initJitsi();
      
      // Iniciar timer
      startTimer();
    } catch (error) {
      console.error('Error al cargar datos de sesión:', error);
      showError('Error al cargar la sesión');
    }
  }

  function updateSessionInfo() {
    const sessionTitle = document.getElementById('sessionTitle');
    const sessionCourse = document.getElementById('sessionCourse');

    if (sessionTitle && state.sesionData) {
      sessionTitle.textContent = state.sesionData.titulo || 'Sesión en Vivo';
    }

    if (sessionCourse && state.sesionData) {
      sessionCourse.textContent = state.sesionData.cursoNombre || 'Curso';
    }
  }

  // ========== JITSI MEET ==========
  function initJitsi() {
    try {
      // Generar nombre de sala único
      const roomName = `clasiya-${state.sesionId}-${Date.now()}`;
      
      // Obtener nombre del usuario desde localStorage o estado
      const userData = getCurrentUser();
      const displayName = userData ? userData.nombre : 'Usuario';

      // Configuración de Jitsi Meet
      const domain = 'meet.jit.si'; // Cambiar por tu dominio si tienes servidor propio
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        configOverwrite: {
          // Configuración para soportar hasta 1000 participantes
          maxUsers: 1000,
          startVideoMuted: state.tipoUsuario === 'alumno', // Alumnos entran con video apagado
          startAudioMuted: state.tipoUsuario === 'alumno', // Alumnos entran con audio apagado
          enableLayerSuspension: true, // Suspender capas de video cuando no se ven
          
          // Configuración de calidad de video
          videoQuality: {
            maxBitrate: 2000000, // 2Mbps máximo por participante
            minBitrate: 500000,  // 500Kbps mínimo
            maxFramerate: 30     // 30 FPS máximo
          },
          
          // Configuración de audio
          audioQuality: {
            opusMaxAverageBitrate: 64000, // 64kbps para audio
            opusMaxPlaybackRate: 48000
          },
          
          // Optimizaciones para muchos participantes
          channelLastN: 20, // Mostrar últimos 20 videos activos
          adaptiveLastN: true, // Ajustar automáticamente según conexión
          disableAP: false, // Audio processing
          disableAGC: false, // Automatic Gain Control
          disableAEC: false, // Acoustic Echo Cancellation
          disableNS: false, // Noise Suppression
          disableHPF: false, // High Pass Filter
          
          // Configuración de pantalla compartida
          desktopSharingFrameRate: {
            min: 5,
            max: 30
          },
          
          // Configuración de grabación (opcional)
          // recordingService: {
          //   enabled: true
          // },
          
          // Configuración de moderador
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          
          // Configuración de chat
          disableChat: false,
          
          // Configuración de invitaciones
          disableInviteFunctions: false
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          
          // Botones de la barra de herramientas
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup', 'profile',
            'chat', 'recording', 'settings', 'raisehand', 
            'videoquality', 'filmstrip', 'invite', 'feedback', 
            'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
            'download', 'help', 'mute-everyone', 'security'
          ],
          
          // Configuración de vista
          DEFAULT_BACKGROUND: '#1a1a1a',
          INITIAL_TOOLBAR_TIMEOUT: 20000,
          TOOLBAR_TIMEOUT: 4000,
          
          // Configuración de grid
          TILE_VIEW_MAX_COLUMNS: 5,
          
          // Configuración de chat
          HIDE_INVITE_MORE_HEADER: false
        },
        userInfo: {
          displayName: displayName,
          email: userData ? userData.email : ''
        }
      };

      // Si es maestro, dar permisos de moderador
      if (state.tipoUsuario === 'maestro') {
        options.configOverwrite.startVideoMuted = false;
        options.configOverwrite.startAudioMuted = false;
      }

      // Inicializar Jitsi Meet
      state.jitsiApi = new JitsiMeetExternalAPI(domain, options);

      // Event listeners de Jitsi
      setupJitsiEvents();

      // Ocultar overlay de carga
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) {
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 2000);
      }
    } catch (error) {
      console.error('Error al inicializar Jitsi:', error);
      showError('Error al conectar con la videollamada');
    }
  }

  function setupJitsiEvents() {
    if (!state.jitsiApi) return;

    // Evento cuando se une un participante
    state.jitsiApi.addEventListener('participantJoined', (participant) => {
      state.participantCount++;
      updateParticipantCount();
      updateParticipantsList();
    });

    // Evento cuando se va un participante
    state.jitsiApi.addEventListener('participantLeft', (participant) => {
      state.participantCount = Math.max(0, state.participantCount - 1);
      updateParticipantCount();
      updateParticipantsList();
    });

    // Evento cuando se cierra la sesión
    state.jitsiApi.addEventListener('videoConferenceLeft', () => {
      handleLeaveSession();
    });

    // Evento de error
    state.jitsiApi.addEventListener('videoConferenceJoined', () => {
      console.log('Conectado a la videollamada');
      state.startTime = new Date();
    });

    // Evento de error
    state.jitsiApi.addEventListener('error', (error) => {
      console.error('Error en Jitsi:', error);
      showError('Error en la conexión de video');
    });

    // Obtener número inicial de participantes
    state.jitsiApi.getNumberOfParticipants().then(count => {
      state.participantCount = count;
      updateParticipantCount();
    });
  }

  // ========== UI UPDATES ==========
  function updateParticipantCount() {
    const countElement = document.getElementById('participantCount');
    if (countElement) {
      countElement.textContent = state.participantCount;
    }
  }

  function updateParticipantsList() {
    // TODO: Implementar lista de participantes si es necesario
    // Por ahora, Jitsi maneja esto internamente
  }

  function startTimer() {
    state.startTime = new Date();
    const timerElement = document.getElementById('sessionTimer');
    
    if (!timerElement) return;

    state.timerInterval = setInterval(() => {
      const now = new Date();
      const diff = now - state.startTime;
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      timerElement.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Botón volver
    const btnVolver = document.getElementById('btnVolver');
    if (btnVolver) {
      btnVolver.addEventListener('click', handleLeaveSession);
    }

    // Botón cerrar sidebar
    const btnCloseSidebar = document.getElementById('btnCloseSidebar');
    if (btnCloseSidebar) {
      btnCloseSidebar.addEventListener('click', () => {
        const sidebar = document.getElementById('sessionSidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    }

    // Prevenir salida accidental
    window.addEventListener('beforeunload', (e) => {
      if (state.jitsiApi) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de salir de la sesión?';
        return e.returnValue;
      }
    });
  }

  // ========== MANEJO DE SALIDA ==========
  function handleLeaveSession() {
    if (state.jitsiApi) {
      state.jitsiApi.dispose();
      state.jitsiApi = null;
    }

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }

    // Redirigir según el tipo de usuario
    if (state.tipoUsuario === 'maestro') {
      window.location.href = 'maestro.html';
    } else {
      window.location.href = 'alumno.html';
    }
  }

  // ========== UTILIDADES ==========
  function getCurrentUser() {
    // TODO: Obtener usuario actual desde localStorage o API
    try {
      const userData = localStorage.getItem('clasiya_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  function showError(message) {
    const container = document.querySelector('.jitsi-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>${message}</p>
          <button class="btn btn-back" onclick="window.location.href='${state.tipoUsuario === 'maestro' ? 'maestro.html' : 'alumno.html'}'">
            Volver
          </button>
        </div>
      `;
    }
  }

  // Limpiar al cerrar
  window.addEventListener('beforeunload', () => {
    if (state.jitsiApi) {
      state.jitsiApi.dispose();
    }
  });
})();

