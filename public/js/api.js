// api.js
// Punto único de conexión hacia el backend (Node + Express + SQL).
// Cuando el backend esté listo, solo se cambia BASE_URL si hace falta.

const BASE_URL = '/api';

async function getJSON(endpoint, fallback) {

    try {

        const res = await fetch(`${BASE_URL}${endpoint}`);

        if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`);

        return await res.json();

    } catch (err) {

        console.warn(`[api.js] No se pudo conectar a ${endpoint}, usando datos de respaldo.`, err.message);

        return fallback;

    }

}

// ---- ETAPA 1: endpoints públicos ----

export function getFechas() {

    return getJSON('/fechas', [
        {
            id: 1,
            dia: '20',
            mes: 'May',
            categoria: 'registro',
            titulo: 'Registro de aspirantes',
            descripcion: 'Del 20 de mayo al 15 de junio'
        }
    ]);

}

export function getGuiaPasos() {

    return getJSON('/guia', [
        {
            id: 1,
            paso: 1,
            titulo: 'Registro',
            descripcion: 'Crea tu cuenta en el portal de aspirantes y llena tus datos personales.',
            requisitos: ['Correo electrónico vigente', 'CURP'],
            video_url: null
        }
    ]);

}

export function getRequisitos() {

    return getJSON('/requisitos', [
        {
            id: 1,
            nombre: 'CURP',
            info: 'Clave Única de Registro de Población vigente',
            obligatorio: true
        }
    ]);

}

export function getMateriasTips() {

    return getJSON('/materias/tips', [
        {
            id: 1,
            tipo: 'video',
            titulo: 'Cómo leer el mapa curricular de tu carrera',
            descripcion: null,
            video_url: null,
            duracion: '2:45 min'
        }
    ]);

}

// ---- ETAPA 2: requiere sesión iniciada ----

export async function login(matricula, contrasena) {

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // para que la cookie de sesión se guarde
        body: JSON.stringify({ matricula, contrasena })
    });

    const datos = await res.json();

    if (!res.ok) throw new Error(datos.error || 'No se pudo iniciar sesión.');

    return datos;

}

export async function logout() {

    await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

}

export async function obtenerSesionActual() {

    try {

        const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });

        if (!res.ok) return null;

        return await res.json();

    } catch {

        return null;

    }

}
