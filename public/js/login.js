// login.js
// Maneja el formulario de login.html

import { login } from './api.js';

const form = document.getElementById('form-login');
const mensajeError = document.getElementById('mensaje-error');

form.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    mensajeError.classList.add('hidden');

    const matricula = document.getElementById('matricula').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    try {

        await login(matricula, contrasena);

        // Si el login funcionó, lo mandamos a la pantalla de bienvenida.
        window.location.href = './semestre.html';

    } catch (err) {

        mensajeError.textContent = err.message;
        mensajeError.classList.remove('hidden');

    }

});
