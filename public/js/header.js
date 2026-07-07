// header.js
// Se inyecta en el div#header de cada página HTML.
// Detecta la página actual por el nombre del archivo para marcar el nav activo.

function paginaActual() {

    const archivo = window.location.pathname.split('/').pop() || 'index.html';

    if (archivo === 'index.html' || archivo === '') return 'home';
    if (archivo === 'fechas.html') return 'fechas';
    if (archivo === 'guia.html') return 'guia';
    if (archivo === 'requisitos.html') return 'requisitos';

    return '';

}

function claseNav(view, actual) {

    return view === actual ? 'nav-active' : 'nav-inactive';

}

function renderHeader() {

    const actual = paginaActual();

    const html = `
        <header
            style="
                background: var(--primary);
                border-bottom: 1px solid var(--primary-dark);
                box-shadow: var(--shadow-soft);
            "
            class="sticky top-0 z-50 text-white"
        >
            <div class="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

                <div class="flex items-center gap-12">

                    <a href="./index.html" class="flex items-center">
                        <img
                            src="./assets/logo-uacj.png"
                            alt="Logo UACJ"
                            class="h-16 w-auto object-contain transition duration-300 hover:scale-105"
                        >
                    </a>

                    <nav class="hidden lg:flex items-center gap-8 text-sm font-medium">

                        <a href="./index.html" class="${claseNav('home', actual)}">Inicio</a>
                        <a href="./guia.html" class="${claseNav('guia', actual)}">Guía de ingreso</a>
                        <a href="./fechas.html" class="${claseNav('fechas', actual)}">Fechas clave</a>
                        <a href="./requisitos.html" class="${claseNav('requisitos', actual)}">Requisitos</a>

                    </nav>

                </div>

                <div class="flex items-center gap-5">

                    <button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>

                    <button class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </button>

                </div>

            </div>

        </header>
    `;

    document.getElementById('header').innerHTML = html;

}

renderHeader();
