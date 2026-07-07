// guia.js
// Llena los espacios dinámicos de guia.html: lista de pasos + panel con video.

import { getGuiaPasos } from './api.js';

let pasos = [];
let pasoActivo = 0;

// Convierte cualquier link de YouTube (watch, youtu.be, embed) a su
// formato "embed" que sí se puede meter en un iframe.
function urlEmbedYoutube(url) {

    if (!url) return null;

    const patrones = [
        /youtu\.be\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
    ];

    for (const patron of patrones) {

        const match = url.match(patron);

        if (match) return `https://www.youtube.com/embed/${match[1]}`;

    }

    return null; // no es un link de YouTube reconocido

}

function renderListaPasos() {

    const lista = document.getElementById('lista-pasos');

    lista.innerHTML = pasos.map((p, i) => `
        <li data-index="${i}" class="paso-item flex items-center cursor-pointer ${i === pasoActivo ? 'font-bold text-blue-900' : 'text-gray-500'}">
            <span class="${i === pasoActivo ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-500'} w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">
                ${p.paso}
            </span>
            ${p.titulo}
        </li>
    `).join('');

    lista.querySelectorAll('.paso-item').forEach(item => {

        item.addEventListener('click', () => {

            pasoActivo = Number(item.dataset.index);
            renderListaPasos();
            renderPanel();

        });

    });

}

function renderPanel() {

    const paso = pasos[pasoActivo];

    if (!paso) return;

    const videoContenedor = document.getElementById('video-paso');

    const embedYoutube = urlEmbedYoutube(paso.video_url);

    if (embedYoutube) {

        // Es un link de YouTube → se muestra con iframe
        videoContenedor.innerHTML = `
            <iframe
                class="w-full h-64 rounded-lg"
                src="${embedYoutube}"
                title="${paso.titulo}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        `;

    } else if (paso.video_url) {

        // Es un archivo de video directo (.mp4, .webm, etc.)
        videoContenedor.innerHTML = `<video src="${paso.video_url}" controls class="w-full h-48 object-cover rounded-lg"></video>`;

    } else {

        videoContenedor.innerHTML = `▶️`;

    }

    document.getElementById('titulo-paso').textContent = `${paso.paso}. ${paso.titulo}`;
    document.getElementById('descripcion-paso').textContent = paso.descripcion;

    document.getElementById('requisitos-paso').innerHTML = (paso.requisitos || [])
        .map(r => `<li>${r}</li>`)
        .join('');

    const porcentaje = Math.round(((pasoActivo + 1) / pasos.length) * 100);

    document.getElementById('progreso-texto').textContent = `${porcentaje}%`;
    document.getElementById('progreso-barra-guia').style.width = `${porcentaje}%`;

}

async function init() {

    pasos = await getGuiaPasos();
    renderListaPasos();
    renderPanel();

}

init();
