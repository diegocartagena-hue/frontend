/**
 * js/maestro.js
 * Lógica de frontend para el Dashboard de Maestro (maestro.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. Inicialización de Componentes Globales (Opcional)
    // =========================================================
    // Llama a la inicialización de la navbar si está en un archivo separado (ej. navbar.js)
    if (typeof initNavbar === 'function') {
        initNavbar();
    }

    // =========================================================
    // 2. Manejo de Botones de Curso
    // =========================================================

    // Botón "CREAR NUEVO CURSO"
    const createCourseBtn = document.querySelector('.create-course-btn');
    if (createCourseBtn) {
        createCourseBtn.addEventListener('click', () => {
            console.log('Botón CREAR NUEVO CURSO presionado. Redirigiendo a creación...');
            // **TO DO:** Reemplazar por la ruta correcta al formulario de creación
            alert('Abriendo formulario de creación de curso.');
            // window.location.href = 'crear-curso.html'; 
        });
    }

    // Botones "VER CURSO" (Delegación de Eventos)
    const courseList = document.querySelector('.course-list');
    if (courseList) {
        courseList.addEventListener('click', (event) => {
            const viewButton = event.target.closest('.view-course-btn');
            
            if (viewButton) {
                const courseCard = viewButton.closest('.course-card');
                const courseName = courseCard ? courseCard.querySelector('.course-name').textContent : 'Curso Desconocido';
                
                // **IMPORTANTE:** Redirigimos a la página de sesiones.html
                console.log(`Redirigiendo a la sesión de: ${courseName}`);
                
                // En una implementación real, pasarías el ID del curso:
                // const courseId = viewButton.dataset.id; 
                
                alert(`Abriendo página de sesiones para: ${courseName}`);
                // window.location.href = `sesiones.html?curso=${encodeURIComponent(courseName)}`; 
            }
        });
    }

    // =========================================================
    // 3. Lógica para Botones de Navegación (Flechas)
    // =========================================================
    // Estos botones generalmente manejan el historial del navegador o la paginación.

    document.querySelectorAll('.navbar-top .btn-outline-secondary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = button.querySelector('i');

            if (icon.classList.contains('fa-arrow-left')) {
                console.log('Botón de ir atrás presionado.');
                // history.back(); // Descomentar para usar el historial del navegador
            } else if (icon.classList.contains('fa-arrow-right')) {
                console.log('Botón de ir adelante presionado.');
                // history.forward(); // Descomentar para usar el historial del navegador
            }
        });
    });


    // =========================================================
    // 4. Simulación de Carga de Cursos (Lógica de Backend)
    // =========================================================

    /**
     * Esta función simularía la obtención de datos de tu backend (Node.js/Express).
     * En un proyecto real, necesitarías renderizar las tarjetas aquí.
     */
    async function loadCourses() {
        console.log('Iniciando proceso de carga de cursos...');
        
        // **FUTURO TO DO:** Implementar la llamada real a la API
        /*
        try {
            const response = await fetch('/api/maestro/cursos'); 
            if (!response.ok) throw new Error('Network response was not ok');
            const courses = await response.json();
            // renderCourses(courses); // Función para insertar las tarjetas en el HTML
        } catch (error) {
            console.error('Error al cargar los cursos:', error);
        }
        */
    }

    loadCourses(); 
});