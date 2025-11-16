// Panel de Administrador - ClasiYA
(function () {
  'use strict';

  // Estado global
  const state = {
    solicitudes: [],
    filtroActual: 'all',
    solicitudSeleccionada: null
  };

  // ========== INICIALIZACIÓN ==========
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    loadSolicitudes();
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
  async function loadSolicitudes() {
    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch('/api/admin/solicitudes');
      // const data = await response.json();
      
      // Cargar solicitudes desde localStorage
      const solicitudesGuardadas = localStorage.getItem('clasiya_solicitudes_maestros');
      const solicitudesData = solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];

      state.solicitudes = solicitudesData;
      renderSolicitudes(solicitudesData);
      updateStats();
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      showNotification('Error al cargar las solicitudes', 'error');
    }
  }

  // Guardar solicitudes en localStorage
  function saveSolicitudesToStorage() {
    try {
      localStorage.setItem('clasiya_solicitudes_maestros', JSON.stringify(state.solicitudes));
      // Actualizar timestamp para notificar cambios
      localStorage.setItem('clasiya_solicitudes_updated', Date.now().toString());
    } catch (error) {
      console.error('Error al guardar solicitudes:', error);
    }
  }

  // ========== RENDERIZADO ==========
  function renderSolicitudes(solicitudes) {
    const container = document.getElementById('requestsContainer');
    const template = document.getElementById('requestTemplate');
    const emptyState = document.getElementById('emptyState');

    if (!container || !template) return;

    // Filtrar solicitudes según el filtro actual
    let solicitudesFiltradas = solicitudes;
    if (state.filtroActual === 'pending') {
      solicitudesFiltradas = solicitudes.filter(s => s.estado === 'pending');
    }

    // Limpiar solicitudes existentes (excepto template y empty state)
    const existingRequests = container.querySelectorAll('.request-card:not(#requestTemplate)');
    existingRequests.forEach(card => card.remove());

    if (solicitudesFiltradas.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Ordenar por fecha (más recientes primero)
    solicitudesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    solicitudesFiltradas.forEach(solicitud => {
      const card = template.cloneNode(true);
      card.id = `request-${solicitud.id}`;
      card.style.display = 'block';

      // Llenar datos
      const name = card.querySelector('.request-name');
      const email = card.querySelector('.request-email');
      const date = card.querySelector('.date-value');
      const phone = card.querySelector('.request-phone');
      const statusBadge = card.querySelector('.status-badge');
      const viewDocBtn = card.querySelector('.btn-view-document');
      const approveBtn = card.querySelector('.btn-approve');
      const rejectBtn = card.querySelector('.btn-reject');

      if (name) name.textContent = solicitud.nombre || 'Sin nombre';
      if (email) email.textContent = solicitud.correo || 'Sin correo';
      if (date) {
        const fecha = new Date(solicitud.fecha);
        date.textContent = fecha.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      if (phone) phone.textContent = solicitud.telefono || 'No proporcionado';
      
      // Actualizar estado
      if (statusBadge) {
        statusBadge.className = `status-badge ${solicitud.estado || 'pending'}`;
        if (solicitud.estado === 'approved') {
          statusBadge.innerHTML = '<i class="fas fa-check-circle me-1"></i>Aprobada';
        } else if (solicitud.estado === 'rejected') {
          statusBadge.innerHTML = '<i class="fas fa-times-circle me-1"></i>Rechazada';
        } else {
          statusBadge.innerHTML = '<i class="fas fa-clock me-1"></i>Pendiente';
        }
      }

      // Ocultar acciones si ya está procesada
      if (solicitud.estado !== 'pending') {
        const actions = card.querySelector('.request-actions');
        if (actions) actions.style.display = 'none';
      }

      if (viewDocBtn) viewDocBtn.setAttribute('data-request-id', solicitud.id);
      if (approveBtn) approveBtn.setAttribute('data-request-id', solicitud.id);
      if (rejectBtn) rejectBtn.setAttribute('data-request-id', solicitud.id);

      container.appendChild(card);
    });
  }

  function updateStats() {
    const totalPendientes = document.getElementById('totalPendientes');
    const totalAprobadas = document.getElementById('totalAprobadas');
    const totalRechazadas = document.getElementById('totalRechazadas');

    const pendientes = state.solicitudes.filter(s => s.estado === 'pending' || !s.estado).length;
    const aprobadas = state.solicitudes.filter(s => s.estado === 'approved').length;
    const rechazadas = state.solicitudes.filter(s => s.estado === 'rejected').length;

    if (totalPendientes) totalPendientes.textContent = pendientes;
    if (totalAprobadas) totalAprobadas.textContent = aprobadas;
    if (totalRechazadas) totalRechazadas.textContent = rechazadas;
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Filtros
    const btnFilterAll = document.getElementById('btnFilterAll');
    const btnFilterPending = document.getElementById('btnFilterPending');

    if (btnFilterAll) {
      btnFilterAll.addEventListener('click', () => {
        state.filtroActual = 'all';
        updateFilterButtons();
        renderSolicitudes(state.solicitudes);
      });
    }

    if (btnFilterPending) {
      btnFilterPending.addEventListener('click', () => {
        state.filtroActual = 'pending';
        updateFilterButtons();
        renderSolicitudes(state.solicitudes);
      });
    }

    // Botones de acciones
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-view-document')) {
        const requestId = e.target.closest('.btn-view-document').getAttribute('data-request-id');
        handleVerDocumento(requestId);
      }
      if (e.target.closest('.btn-approve')) {
        const requestId = e.target.closest('.btn-approve').getAttribute('data-request-id');
        handleAprobarSolicitud(requestId);
      }
      if (e.target.closest('.btn-reject')) {
        const requestId = e.target.closest('.btn-reject').getAttribute('data-request-id');
        handleRechazarSolicitud(requestId);
      }
    });

    // Botón confirmar rechazo
    const btnConfirmarRechazo = document.getElementById('btnConfirmarRechazo');
    if (btnConfirmarRechazo) {
      btnConfirmarRechazo.addEventListener('click', handleConfirmarRechazo);
    }

    // Limpiar backdrop cuando se cierran los modales
    const modalVerDocumento = document.getElementById('modalVerDocumento');
    const modalRechazar = document.getElementById('modalRechazar');
    
    if (modalVerDocumento) {
      modalVerDocumento.addEventListener('hidden.bs.modal', cleanupModalBackdrop);
    }
    
    if (modalRechazar) {
      modalRechazar.addEventListener('hidden.bs.modal', cleanupModalBackdrop);
    }

    // Botón cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', handleCerrarSesion);
    }
  }

  function updateFilterButtons() {
    const btnFilterAll = document.getElementById('btnFilterAll');
    const btnFilterPending = document.getElementById('btnFilterPending');

    if (btnFilterAll && btnFilterPending) {
      if (state.filtroActual === 'all') {
        btnFilterAll.classList.add('active');
        btnFilterPending.classList.remove('active');
      } else {
        btnFilterAll.classList.remove('active');
        btnFilterPending.classList.add('active');
      }
    }
  }

  // ========== MANEJO DE ACCIONES ==========
  function handleVerDocumento(requestId) {
    const solicitud = state.solicitudes.find(s => s.id === parseInt(requestId));
    if (!solicitud || !solicitud.comprobante) {
      showNotification('No hay documento disponible', 'error');
      return;
    }

    const documentViewer = document.getElementById('documentViewer');
    const documentImage = document.getElementById('documentImage');
    const documentPdf = document.getElementById('documentPdf');
    const documentError = document.getElementById('documentError');

    if (!documentViewer) return;

    // Ocultar todos
    if (documentImage) documentImage.style.display = 'none';
    if (documentPdf) documentPdf.style.display = 'none';
    if (documentError) documentError.style.display = 'none';

    // Mostrar según el tipo de archivo
    if (solicitud.comprobante.type && solicitud.comprobante.type.includes('pdf')) {
      if (documentPdf) {
        documentPdf.src = solicitud.comprobante.url || solicitud.comprobante;
        documentPdf.style.display = 'block';
      }
    } else if (solicitud.comprobante.type && solicitud.comprobante.type.includes('image')) {
      if (documentImage) {
        documentImage.src = solicitud.comprobante.url || solicitud.comprobante;
        documentImage.style.display = 'block';
      }
    } else {
      // Intentar mostrar como imagen
      if (documentImage) {
        documentImage.src = solicitud.comprobante.url || solicitud.comprobante;
        documentImage.style.display = 'block';
        documentImage.onerror = function() {
          if (documentImage) documentImage.style.display = 'none';
          if (documentError) documentError.style.display = 'block';
        };
      }
    }

    const modal = new bootstrap.Modal(document.getElementById('modalVerDocumento'));
    modal.show();
  }

  async function handleAprobarSolicitud(requestId) {
    if (!confirm('¿Estás seguro de aprobar esta solicitud? El maestro recibirá acceso a su cuenta.')) {
      return;
    }

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/admin/solicitudes/${requestId}/aprobar`, {
      //   method: 'POST'
      // });

      const solicitud = state.solicitudes.find(s => s.id === parseInt(requestId));
      if (!solicitud) return;

      // Actualizar estado
      solicitud.estado = 'approved';
      solicitud.fechaAprobacion = new Date().toISOString();
      solicitud.aprobadoPor = 'Admin'; // En producción sería el ID del admin

      saveSolicitudesToStorage();
      renderSolicitudes(state.solicitudes);
      updateStats();

      showNotification('Solicitud aprobada exitosamente', 'success');
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      showNotification('Error al aprobar la solicitud', 'error');
    }
  }

  function handleRechazarSolicitud(requestId) {
    const solicitud = state.solicitudes.find(s => s.id === parseInt(requestId));
    if (!solicitud) return;

    state.solicitudSeleccionada = solicitud;

    // Limpiar formulario
    const form = document.getElementById('formRechazar');
    if (form) form.reset();

    const modal = new bootstrap.Modal(document.getElementById('modalRechazar'));
    modal.show();
  }

  async function handleConfirmarRechazo() {
    const form = document.getElementById('formRechazar');
    const motivoInput = document.getElementById('motivoRechazo');

    if (!form || !motivoInput || !motivoInput.value.trim()) {
      showNotification('Por favor ingresa un motivo de rechazo', 'error');
      return;
    }

    if (!state.solicitudSeleccionada) return;

    try {
      // TODO: Reemplazar con llamada a API real
      // const response = await fetch(`/api/admin/solicitudes/${state.solicitudSeleccionada.id}/rechazar`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ motivo: motivoInput.value.trim() })
      // });

      // Actualizar estado
      state.solicitudSeleccionada.estado = 'rejected';
      state.solicitudSeleccionada.fechaRechazo = new Date().toISOString();
      state.solicitudSeleccionada.motivoRechazo = motivoInput.value.trim();
      state.solicitudSeleccionada.rechazadoPor = 'Admin'; // En producción sería el ID del admin

      saveSolicitudesToStorage();
      renderSolicitudes(state.solicitudes);
      updateStats();

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalRechazar'));
      if (modal) {
        modal.hide();
        setTimeout(function() {
          cleanupModalBackdrop();
        }, 300);
      }

      state.solicitudSeleccionada = null;

      showNotification('Solicitud rechazada exitosamente', 'success');
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      showNotification('Error al rechazar la solicitud', 'error');
    }
  }

  function handleCerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      window.location.href = 'login.html';
    }
  }

  // ========== UTILIDADES ==========
  function cleanupModalBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  function showNotification(message, type = 'info') {
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

