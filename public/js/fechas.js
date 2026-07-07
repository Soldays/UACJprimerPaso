// fechas.js
// Llena el espacio dinámico #lista-fechas en fechas.html usando la API.

import { getFechas } from './api.js';

let todasLasFechas = [];

function FilaFecha(fecha) {

    return `
        <div class="p-6 flex items-center">
            <div class="w-16 text-center mr-6">
                <div class="text-2xl font-bold text-blue-900">${fecha.dia}</div>
                <div class="text-xs text-gray-500 uppercase">${fecha.mes}</div>
            </div>
            <div>
                <div class="font-bold text-lg">${fecha.titulo}</div>
                <div class="text-sm text-gray-500">${fecha.descripcion}</div>
            </div>
        </div>
    `;

}

function renderFechas(lista) {

    const contenedor = document.getElementById('lista-fechas');

    if (!lista.length) {

        contenedor.innerHTML = `<div class="p-6 text-gray-400 text-sm">No hay fechas para este filtro.</div>`;
        return;

    }

    contenedor.innerHTML = lista.map(FilaFecha).join('');

}

function activarFiltros() {

    document.querySelectorAll('.filtro-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            document.querySelectorAll('.filtro-btn').forEach(b => {
                b.classList.remove('bg-blue-100', 'text-blue-900', 'font-bold', 'border-blue-900');
                b.classList.add('bg-white', 'text-gray-500', 'border-gray-300');
            });

            btn.classList.remove('bg-white', 'text-gray-500', 'border-gray-300');
            btn.classList.add('bg-blue-100', 'text-blue-900', 'font-bold', 'border-blue-900');

            const filtro = btn.dataset.filtro;

            const filtradas = filtro === 'todos'
                ? todasLasFechas
                : todasLasFechas.filter(f => f.categoria === filtro);

            renderFechas(filtradas);

        });

    });

}

async function init() {

    todasLasFechas = await getFechas();
    renderFechas(todasLasFechas);
    activarFiltros();

}

init();
