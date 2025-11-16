-- ============================================
-- Esquema de Base de Datos - ClasiYA
-- Solo funcionalidades para videollamadas
-- ============================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios
-- Almacena todos los usuarios (alumnos, maestros, admin)
-- ============================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    url_avatar TEXT,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('alumno', 'maestro', 'admin')),
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- ============================================
-- TABLA: solicitudes_maestros
-- Solicitudes de registro de maestros pendientes de aprobación
-- ============================================
CREATE TABLE solicitudes_maestros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    comprobante_nombre VARCHAR(255) NOT NULL,
    comprobante_tipo VARCHAR(50) NOT NULL,
    comprobante_tamaño INTEGER NOT NULL,
    comprobante_url TEXT NOT NULL, -- Base64 o URL del archivo
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
    admin_revisor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_revision TIMESTAMP,
    comentarios TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para solicitudes_maestros
CREATE INDEX idx_solicitudes_maestros_estado ON solicitudes_maestros(estado);
CREATE INDEX idx_solicitudes_maestros_email ON solicitudes_maestros(email);
CREATE INDEX idx_solicitudes_maestros_creado_en ON solicitudes_maestros(creado_en);

-- ============================================
-- TABLA: cursos
-- Cursos creados por maestros
-- ============================================
CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    profesor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    disponible BOOLEAN DEFAULT true,
    total_estudiantes INTEGER DEFAULT 0,
    total_sesiones INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT verificar_fechas CHECK (fecha_fin > fecha_inicio)
);

-- Índices para cursos
CREATE INDEX idx_cursos_profesor_id ON cursos(profesor_id);
CREATE INDEX idx_cursos_disponible ON cursos(disponible);
CREATE INDEX idx_cursos_fecha_inicio ON cursos(fecha_inicio);
CREATE INDEX idx_cursos_categoria ON cursos(categoria);

-- ============================================
-- TABLA: sesiones
-- Sesiones de videollamada dentro de un curso
-- ============================================
CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    duracion INTEGER NOT NULL, -- Duración en minutos
    codigo_acceso VARCHAR(20) NOT NULL UNIQUE,
    jitsi_room_name VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para sesiones
CREATE INDEX idx_sesiones_curso_id ON sesiones(curso_id);
CREATE INDEX idx_sesiones_fecha ON sesiones(fecha);
CREATE INDEX idx_sesiones_codigo_acceso ON sesiones(codigo_acceso);

-- ============================================
-- TABLA: inscripciones
-- Inscripciones de alumnos a cursos
-- ============================================
CREATE TABLE inscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    estudiante_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_acceso_usado VARCHAR(20), -- Código usado para inscribirse
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    UNIQUE(curso_id, estudiante_id)
);

-- Índices para inscripciones
CREATE INDEX idx_inscripciones_curso_id ON inscripciones(curso_id);
CREATE INDEX idx_inscripciones_estudiante_id ON inscripciones(estudiante_id);
CREATE INDEX idx_inscripciones_activo ON inscripciones(activo);

-- ============================================
-- TABLA: codigos_acceso_cursos
-- Códigos de acceso para cursos (generados por maestros)
-- ============================================
CREATE TABLE codigos_acceso_cursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    estudiante_nombre VARCHAR(255), -- Nombre del estudiante que usó el código (opcional)
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usado_en TIMESTAMP
);

-- Índices para codigos_acceso_cursos
CREATE INDEX idx_codigos_acceso_cursos_curso_id ON codigos_acceso_cursos(curso_id);
CREATE INDEX idx_codigos_acceso_cursos_codigo ON codigos_acceso_cursos(codigo);
CREATE INDEX idx_codigos_acceso_cursos_activo ON codigos_acceso_cursos(activo);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_columna_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizado_en
CREATE TRIGGER actualizar_usuarios_actualizado_en BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_solicitudes_maestros_actualizado_en BEFORE UPDATE ON solicitudes_maestros
    FOR EACH ROW EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_cursos_actualizado_en BEFORE UPDATE ON cursos
    FOR EACH ROW EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_sesiones_actualizado_en BEFORE UPDATE ON sesiones
    FOR EACH ROW EXECUTE FUNCTION actualizar_columna_actualizado_en();

-- Función para actualizar total_estudiantes en cursos
CREATE OR REPLACE FUNCTION actualizar_conteo_estudiantes_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursos 
        SET total_estudiantes = (
            SELECT COUNT(*) 
            FROM inscripciones 
            WHERE curso_id = NEW.curso_id AND activo = true
        )
        WHERE id = NEW.curso_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE cursos 
        SET total_estudiantes = (
            SELECT COUNT(*) 
            FROM inscripciones 
            WHERE curso_id = NEW.curso_id AND activo = true
        )
        WHERE id = NEW.curso_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursos 
        SET total_estudiantes = (
            SELECT COUNT(*) 
            FROM inscripciones 
            WHERE curso_id = OLD.curso_id AND activo = true
        )
        WHERE id = OLD.curso_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para actualizar total_estudiantes
CREATE TRIGGER disparador_actualizar_conteo_estudiantes_curso
    AFTER INSERT OR UPDATE OR DELETE ON inscripciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_conteo_estudiantes_curso();

-- Función para actualizar total_sesiones en cursos
CREATE OR REPLACE FUNCTION actualizar_conteo_sesiones_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursos 
        SET total_sesiones = (
            SELECT COUNT(*) 
            FROM sesiones 
            WHERE curso_id = NEW.curso_id
        )
        WHERE id = NEW.curso_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursos 
        SET total_sesiones = (
            SELECT COUNT(*) 
            FROM sesiones 
            WHERE curso_id = OLD.curso_id
        )
        WHERE id = OLD.curso_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para actualizar total_sesiones
CREATE TRIGGER disparador_actualizar_conteo_sesiones_curso
    AFTER INSERT OR DELETE ON sesiones
    FOR EACH ROW EXECUTE FUNCTION actualizar_conteo_sesiones_curso();

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE usuarios IS 'Usuarios del sistema (alumnos, maestros, admin)';
COMMENT ON TABLE solicitudes_maestros IS 'Solicitudes de registro de maestros';
COMMENT ON TABLE cursos IS 'Cursos creados por maestros';
COMMENT ON TABLE sesiones IS 'Sesiones de videollamada dentro de cursos';
COMMENT ON TABLE inscripciones IS 'Inscripciones de alumnos a cursos';
COMMENT ON TABLE codigos_acceso_cursos IS 'Códigos de acceso para cursos generados por maestros';
