/**
 * js/maestro.js
 * Lógica de frontend para el Dashboard de Maestro (maestro.html)
 * Maneja la interacción de botones del prototipo.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // Manejo del botón "CREAR NUEVO CURSO"
    // =========================================================
    const createCourseBtn = document.querySelector('.create-course-btn');
    if (createCourseBtn) {
        createCourseBtn.addEventListener('click', () => {
            console.log('Maestro: Botón CREAR NUEVO CURSO presionado.');
            alert('Abriendo formulario para crear un nuevo curso...');
            // window.location.href = 'crear-curso.html'; // Descomentar para redirección real
        });
    }

    // =========================================================
    // Manejo de botones "VER CURSO"
    // =========================================================
    const courseList = document.querySelector('.course-list');
    if (courseList) {
        courseList.addEventListener('click', (event) => {
            const viewButton = event.target.closest('.view-course-btn');
            
            if (viewButton) {
                const courseId = viewButton.dataset.id || 'N/A';
                
                console.log(`Maestro: Redirigiendo a la sesión/detalles del Curso ID: ${courseId}`);
                
                alert(`Abriendo página de sesiones para el curso ${courseId}`);
                // window.location.href = `sesiones.html?id=${courseId}`; // Redirección a la página de Jitsi
            }
        });
    }

    // =========================================================
    // Manejo de botones de navegación superior (Flechas)
    // =========================================================
    document.querySelectorAll('.sidebar-top-nav .btn-outline-secondary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = button.querySelector('i');

            if (icon.classList.contains('fa-arrow-left')) {
                console.log('Navegación: Botón Atrás.');
                // history.back(); 
            } else if (icon.classList.contains('fa-arrow-right')) {
                console.log('Navegación: Botón Adelante.');
                // history.forward();
            }
        });
    });

    console.log('Dashboard de Maestro cargado. Interactividad lista.');
});