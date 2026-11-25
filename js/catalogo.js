/**
 * @author Jorge Enrique Parra Garcia
 *Logica de busqueda, filtrado por ubicacion/especie y renderizado del catálogo ganadero.
 */

document.addEventListener("DOMContentLoaded", () => {
    const sesion = requerirSesion();
    if (!sesion) return;

    actualizarBarraSesion();
    cargarOpcionesEstados();
    filtrarYMostrarCatalogo();

    document.getElementById("buscador-texto").addEventListener("input", filtrarYMostrarCatalogo);
    document.getElementById("filtro-especie").addEventListener("change", filtrarYMostrarCatalogo);
    document.getElementById("filtro-estado").addEventListener("change", filtrarYMostrarCatalogo);

    document.getElementById("btn-limpiar").addEventListener("click", () => {
        document.getElementById("buscador-texto").value = "";
        document.getElementById("filtro-especie").value = "";
        document.getElementById("filtro-estado").value = "";
        filtrarYMostrarCatalogo();
    });
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
                    <h5 class="text-white">No se encontraron especies con esos criterios</h5>
                    <p class="small text-light opacity-75 mb-0">Prueba con otra región, especie o limpia los filtros activos.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card card-nord h-100 overflow-hidden">
                <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}" style="height: 210px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge badge-especie">${obtenerSoloEspecie(item.especie)}</span>
                        <span class="small text-info fw-semibold">${item.estadoPrincipal}</span>
                    </div>
                    <h5 class="card-title text-white fw-bold mb-1">${item.nombre}</h5>
                    <p class="small text-light opacity-75 mb-3">${item.proposito}</p>

                    <p class="small mb-2"><strong>Zonas de presencia:</strong> ${item.ubicacion}</p>

                    <div class="caja-compra small mb-3">
                    <strong class="d-block mb-1" style="color: #5fd9fa;">Lugar óptimo de compra:</strong>
                    <span>${item.lugarCompraOptimo}</span>
                    </div>

                    <p class="small mb-3"><strong>Inversión estimada:</strong> ${item.precioEstimado}</p>

                    <a href="perfiles.html?id=${item.id}" class="btn btn-nord btn-sm mt-auto w-100">
                        Consultar Ficha de Reproducción
                    </a>
                </div>
            </div>
        </div>
    `).join("");
}