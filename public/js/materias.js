// materias.js
// Llena los espacios dinámicos de materias.html: tabs (Guía / Tips / Videos) + tarjetas.

import { obtenerSesionActual, getMateriasTips } from './api.js';

const TABS = [
    { id: 'guia', etiqueta: 'Guía' },
    { id: 'tip', etiqueta: 'Tips' },
    { id: 'video', etiqueta: 'Videos' }
];

let tips = [];
let tabActiva = 'guia';

function TarjetaTip(item) {

    if (item.tipo === 'video') {

        return `
            <div class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                <div class="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center text-xl shrink-0">
                    ▶️
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-800">${item.titulo}</p>
                    ${item.duracion ? `<p class="text-sm text-gray-400">${item.duracion}</p>` : ''}
                </div>
            </div>
        `;

    }

    return `
        <div class="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
            <span class="text-blue-700 mt-0.5">✔️</span>
            <p class="text-gray-700">${item.titulo}</p>
        </div>
    `;

}

function renderTabs() {

    document.getElementById('tabs-materias').innerHTML = TABS.map(tab => `
        <button
            data-tab="${tab.id}"
            class="pb-3 -mb-px border-b-2 font-medium text-sm transition ${
                tab.id === tabActiva
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
            }"
        >
            ${tab.etiqueta}
        </button>
    `).join('');

    document.querySelectorAll('#tabs-materias button').forEach(boton => {

        boton.addEventListener('click', () => {

            tabActiva = boton.dataset.tab;
            renderTabs();
            renderLista();

        });

    });

}

function renderLista() {

    const items = tabActiva === 'guia'
        ? tips
        : tips.filter(item => item.tipo === tabActiva);

    document.getElementById('lista-tips').innerHTML = items.length
        ? items.map(TarjetaTip).join('')
        : `<p class="text-gray-400 text-sm">Todavía no hay contenido en esta sección.</p>`;

}

async function init() {

    const usuario = await obtenerSesionActual();

    if (!usuario) {

        window.location.href = './login.html';
        return;

    }

    tips = await getMateriasTips();

    renderTabs();
    renderLista();

}

init();
