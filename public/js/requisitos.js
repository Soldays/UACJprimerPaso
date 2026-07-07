// requisitos.js
// Llena el espacio dinámico #lista-requisitos en requisitos.html usando la API.

import { getRequisitos } from './api.js';

function FilaRequisito(req) {

    return `
        <li class="flex items-center text-gray-700">
            <input type="checkbox" class="mr-3 w-5 h-5 text-blue-600 rounded">
            ${req.nombre}
            <span class="ml-2 text-gray-400 cursor-pointer" title="${req.info}">
                ℹ️
            </span>
        </li>
    `;

}

async function init() {

    const requisitos = await getRequisitos();

    document.getElementById('lista-requisitos').innerHTML = requisitos.map(FilaRequisito).join('');

}

init();
