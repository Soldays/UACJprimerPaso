// semestre.js
// Pantalla de bienvenida de la Etapa 2. Si no hay sesión activa,
// regresa al alumno al login.

import { obtenerSesionActual, logout } from './api.js';

const CREDITOS_TOTALES = 120; // según tu maqueta: "120 créditos" para egresar

function TarjetaAcceso(icono, titulo, descripcion, href, disponible = true) {

    if (!disponible) {

        return `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
                <div class="text-4xl mb-4">${icono}</div>
                <h3 class="font-bold text-lg mb-2">${titulo}</h3>
                <p class="text-gray-500 text-sm mb-3">${descripcion}</p>
                <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Próximamente</span>
            </div>
        `;

    }

    return `
        <a
            href="${href}"
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 block hover:border-blue-200 card-hover transition-all duration-300"
        >
            <div class="text-4xl mb-4">${icono}</div>
            <h3 class="font-bold text-lg mb-2">${titulo}</h3>
            <p class="text-gray-500 text-sm">${descripcion}</p>
        </a>
    `;

}

function renderAccesos() {

    document.getElementById('accesos-semestre').innerHTML = [
        TarjetaAcceso('📚', 'Materias', 'Conoce y elige tus materias.', './materias.html', true),
        TarjetaAcceso('🕒', 'Horarios', 'Organiza tu horario de clases.', './horario.html', false),
        TarjetaAcceso('📍', 'Ubicación de salones', 'Encuentra tus salones en el mapa.', './horario.html', false),
        TarjetaAcceso('💻', 'Campus virtual', 'Accede a la plataforma en línea.', '#', false),
        TarjetaAcceso('🧭', 'Recursos y tips', 'Consejos para tu primer semestre.', '#', false),
        TarjetaAcceso('❓', 'Dudas', '¿Necesitas ayuda? Contacta a un tutor.', '#', false)
    ].join('');

}

async function init() {

    const usuario = await obtenerSesionActual();

    // Si no hay sesión activa, no debería poder ver esta página.
    if (!usuario) {

        window.location.href = './login.html';
        return;

    }

    document.getElementById('titulo-bienvenida').textContent =
        `¡Bienvenido a tu primer semestre, ${usuario.nombre.split(' ')[0]}!`;

    const porcentaje = Math.min(100, Math.round((usuario.numero_creditos / CREDITOS_TOTALES) * 100));

    document.getElementById('barra-creditos').style.width = `${porcentaje}%`;
    document.getElementById('texto-creditos').textContent =
        `${usuario.numero_creditos} / ${CREDITOS_TOTALES} créditos (${porcentaje}%)`;

    renderAccesos();

}

init();
