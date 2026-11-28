/**
 * @author Jorge Enrique Parra Garcia
 * Lógica de búsqueda, filtrado y generación de cotización de adquisición para el usuario final.
 */

const CLAVE_COTIZACION = "agro_lista_cotizacion";

document.addEventListener("DOMContentLoaded", () => {
    const sesion = requerirSesion();
    if (!sesion) return;

    actualizarBarraSesion();
    cargarOpcionesEstados();
    filtrarYMostrarCatalogo();
    renderizarListaCotizacion();

    document.getElementById("buscador-texto").addEventListener("input", filtrarYMostrarCatalogo);
    document.getElementById("filtro-especie").addEventListener("change", filtrarYMostrarCatalogo);
    document.getElementById("filtro-estado").addEventListener("change", filtrarYMostrarCatalogo);

    document.getElementById("btn-limpiar").addEventListener("click", () => {
        document.getElementById("buscador-texto").value = "";
        document.getElementById("filtro-especie").value = "";
        document.getElementById("filtro-estado").value = "";
        filtrarYMostrarCatalogo();
    });

    document.getElementById("btn-vaciar-lista").addEventListener("click", () => {
        sessionStorage.removeItem(CLAVE_COTIZACION);
        document.getElementById("comprobante-generado").innerHTML = "";
        renderizarListaCotizacion();
    });

    document.getElementById("btn-generar-comprobante").addEventListener("click", generarComprobanteCotizacion);
});

function cargarOpcionesEstados() {
    const selectEstado = document.getElementById("filtro-estado");
    const lista = obtenerGanado();
    const estadosUnicos = [...new Set(lista.map(item => item.estadoPrincipal))].sort();

    estadosUnicos.forEach(estado => {
        const opcion = document.createElement("option");
        opcion.value = estado;
        opcion.textContent = estado;
        selectEstado.appendChild(opcion);
    });
}

function filtrarYMostrarCatalogo() {
    const texto = document.getElementById("buscador-texto").value.toLowerCase().trim();
    const especieSeleccionada = document.getElementById("filtro-especie").value.toLowerCase();
    const estadoSeleccionado = document.getElementById("filtro-estado").value.toLowerCase();

    const listaCompleta = obtenerGanado();

    const filtrados = listaCompleta.filter(item => {
        const coincideTexto =
            item.nombre.toLowerCase().includes(texto) ||
            item.ubicacion.toLowerCase().includes(texto) ||
            item.lugarCompraOptimo.toLowerCase().includes(texto) ||
            item.proposito.toLowerCase().includes(texto);

        const coincideEspecie = !especieSeleccionada || item.especie.toLowerCase().includes(especieSeleccionada);
        const coincideEstado = !estadoSeleccionado || item.estadoPrincipal.toLowerCase() === estadoSeleccionado;

        return coincideTexto && coincideEspecie && coincideEstado;
    });

    renderizarTarjetasCatalogo(filtrados);
}

function renderizarTarjetasCatalogo(lista) {
    const grid = document.getElementById("grid-catalogo");
    const contador = document.getElementById("contador-resultados");

    contador.textContent = `${lista.length} ${lista.length === 1 ? "especie encontrada" : "especies encontradas"}`;

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="card-nord p-5 text-center">
                    <h2 class="h5 text-white">No se encontraron especies con esos criterios</h2>
                    <p class="small text-light opacity-75 mb-0">Prueba con otra región, especie o limpia los filtros activos.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card card-nord h-100 overflow-hidden">
                <img src="${item.imagen}" class="card-img-top" alt="Ejemplar de raza ${item.nombre}" style="height: 210px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge badge-especie">${obtenerSoloEspecie(item.especie)}</span>
                        <span class="small text-info fw-semibold">${item.estadoPrincipal}</span>
                    </div>
                    <h2 class="h5 card-title text-white fw-bold mb-1">${item.nombre}</h2>
                    <p class="small text-light opacity-75 mb-3">${item.proposito}</p>

                    <p class="small mb-2"><strong>Zonas de presencia:</strong> ${item.ubicacion}</p>

                    <div class="caja-compra small mb-3">
                        <strong class="d-block mb-1" style="color: #5fd9fa;">Lugar óptimo de compra:</strong>
                        <span>${item.lugarCompraOptimo}</span>
                    </div>

                    <p class="small mb-3"><strong>Inversión estimada:</strong> ${item.precioEstimado}</p>

                    <div class="d-grid gap-2 mt-auto">
                        <a href="perfiles.html?id=${item.id}" class="btn btn-nord btn-sm">
                            Consultar Ficha de Reproducción
                        </a>
                        <button type="button" class="btn btn-outline-info btn-sm" onclick="agregarACotizacion(${item.id})">
                            + Agregar a Cotización
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function obtenerListaCotizacion() {
    const raw = sessionStorage.getItem(CLAVE_COTIZACION);
    return raw ? JSON.parse(raw) : [];
}

function guardarListaCotizacion(lista) {
    sessionStorage.setItem(CLAVE_COTIZACION, JSON.stringify(lista));
}

function agregarACotizacion(id) {
    const catalogo = obtenerGanado();
    const especie = catalogo.find(item => item.id === id);
    if (!especie) return;

    const lista = obtenerListaCotizacion();
    const existente = lista.find(item => item.id === id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        lista.push({
            id: especie.id,
            nombre: especie.nombre,
            especie: especie.especie,
            lugarCompraOptimo: especie.lugarCompraOptimo,
            precioEstimado: especie.precioEstimado,
            cantidad: 1
        });
    }

    guardarListaCotizacion(lista);
    renderizarListaCotizacion();
}

function quitarDeCotizacion(id) {
    const filtrada = obtenerListaCotizacion().filter(item => item.id !== id);
    guardarListaCotizacion(filtrada);
    renderizarListaCotizacion();
}

function renderizarListaCotizacion() {
    const contenedor = document.getElementById("lista-cotizacion-contenedor");
    if (!contenedor) return;

    const lista = obtenerListaCotizacion();
    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="small text-light opacity-75 mb-0">Aún no has agregado ejemplares a tu lista de cotización.</p>`;
        return;
    }

    contenedor.innerHTML = `
        <ul class="list-group list-group-flush">
            ${lista.map(item => `
                <li class="list-group-item bg-transparent text-light border-secondary d-flex flex-wrap justify-content-between align-items-center gap-2 px-0">
                    <div>
                        <strong class="text-white">${item.nombre}</strong> (${item.especie}) &times; <strong>${item.cantidad}</strong>
                        <div class="small opacity-75">${item.precioEstimado} &bull; ${item.lugarCompraOptimo}</div>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="quitarDeCotizacion(${item.id})">Quitar</button>
                </li>
            `).join("")}
        </ul>
    `;
}

function generarComprobanteCotizacion() {
    const box = document.getElementById("comprobante-generado");
    const lista = obtenerListaCotizacion();
    const sesion = obtenerSesionActiva();

    if (lista.length === 0) {
        box.innerHTML = `<div class="alert alert-warning py-2 small mb-0">Agrega al menos una especie antes de generar la orden de cotización.</div>`;
        return;
    }

    const folio = `HC-${Date.now().toString().slice(-6)}`;
    const fecha = new Date().toLocaleString("es-MX");
    const totalEjemplares = lista.reduce((acc, item) => acc + item.cantidad, 0);

    box.innerHTML = `
        <div class="p-3 rounded mt-3" style="background-color: #242933; border: 1px solid #5fd9fa;">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong class="text-info">Orden de Cotización Reproductiva Generada</strong>
                <span class="badge bg-info text-dark">Folio: ${folio}</span>
            </div>
            <p class="small mb-1"><strong>Solicitante:</strong> ${sesion.nombreCompleto} (@${sesion.usuario})</p>
            <p class="small mb-2"><strong>Fecha:</strong> ${fecha} &bull; <strong>Total de ejemplares:</strong> ${totalEjemplares}</p>
            <ul class="small mb-0">
                ${lista.map(item => `<li>${item.cantidad}x ${item.nombre} (${item.especie}) — ${item.precioEstimado}</li>`).join("")}
            </ul>
        </div>
    `;
}