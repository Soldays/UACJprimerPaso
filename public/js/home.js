// home.js
// Llena los espacios dinámicos de index.html: accesos rápidos y progreso.

function Card(icon, title, description, href) {

    return `
        <a
            href="${href}"
            style="border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);"
            class="bg-white p-6 border border-gray-100 block transition-all duration-300 hover:border-blue-200 card-hover"
        >
            <div class="text-4xl mb-4">${icon}</div>
            <h3 class="font-bold text-lg mb-2">${title}</h3>
            <p class="text-gray-500 text-sm">${description}</p>
        </a>
    `;

}

function renderAccesos() {

    const contenedor = document.getElementById('accesos-rapidos');

    contenedor.innerHTML = [
        Card('📅', 'Fechas clave', 'Consulta fechas importantes.', './fechas.html'),
        Card('📄', 'Requisitos', 'Conoce la documentación necesaria.', './requisitos.html'),
        Card('💳', 'Pagos', 'Realiza tus pagos de forma segura.', './pagos.html'),
        Card('📁', 'Trámites', 'Consulta procesos y trámites.', './tramites.html')
    ].join('');

}

function renderProgreso() {

    // TODO: cuando exista login (Etapa 2), esto vendrá de
    // GET /api/aspirantes/:id/progreso en vez de estar fijo.

    const porcentaje = 25;

    const pasos = [
        { numero: 1, titulo: 'Registro', descripcion: 'Crea tu cuenta y llena tus datos.', activo: true },
        { numero: 2, titulo: 'Documentos', descripcion: 'Sube tu documentación.', activo: false },
        { numero: 3, titulo: 'Pago', descripcion: 'Realiza tu pago.', activo: false },
        { numero: 4, titulo: 'Confirmación', descripcion: 'Recibe información final.', activo: false }
    ];

    document.getElementById('progreso-porcentaje').textContent = `${porcentaje}%`;
    document.getElementById('progreso-barra').style.width = `${porcentaje}%`;

    document.getElementById('progreso-pasos').innerHTML = pasos.map(p => `
        <div>
            <div class="w-12 h-12 ${p.activo ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center font-bold mb-4">
                ${p.numero}
            </div>
            <h3 class="font-bold">${p.titulo}</h3>
            <p class="text-sm text-gray-500 mt-1">${p.descripcion}</p>
        </div>
    `).join('');

}

function startCarousel() {

    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (!slides.length) return;

    let current = 0;

    setInterval(() => {

        slides[current].classList.remove('active');
        indicators[current].classList.remove('bg-white');
        indicators[current].classList.add('bg-white/40');

        current = (current + 1) % slides.length;

        slides[current].classList.add('active');
        indicators[current].classList.remove('bg-white/40');
        indicators[current].classList.add('bg-white');

    }, 5000);

}

renderAccesos();
renderProgreso();
startCarousel();
