/**
 * @author Jorge Enrique Parra Garcia
 * Controlador principal de la página de inicio y validación de la api en vivo.
 */

document.addEventListener("DOMContentLoaded", async () => {
    const sesion = requerirSesion();
    if (!sesion) return;

    actualizarBarraSesion();
    renderizarDestacados();
    await cargarEstadoApi();
});

function renderizarDestacados() {
    const contenedor = document.getElementById("contenedor-destacados");
    if (!contenedor) return;

    const lista = obtenerGanado().slice(0, 3);
    contenedor.innerHTML = lista.map(item => `
        <div class="col-md-4">
            <div class="card card-nord h-100 overflow-hidden">
                <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge badge-especie">${obtenerSoloEspecie(item.especie)}</span>
                    </div>
                    <h5 class="card-title text-white fw-bold">${item.nombre}</h5>
                    <p class="small mb-2"><strong>Ubicación:</strong> ${item.ubicacion}</p>
                    <p class="small mb-3"><strong>Compra óptima:</strong> ${item.lugarCompraOptimo}</p>
                    <a href="perfiles.html?id=${item.id}" class="btn btn-nord btn-sm mt-auto">Ver Ficha Reproductiva</a>
                </div>
            </div>
        </div>
    `).join("");
}

async function cargarEstadoApi() {
    const panel = document.getElementById("panel-api-estado");
    if (!panel) return;

    const datosApi = await consultarDatosApiSector("mexico");
    const totalRegistros = obtenerGanado().length;

    if (datosApi) {
        panel.innerHTML = `
            <p class="mb-1 text-success fw-semibold">&#9679; API activa conectada</p>
            <p class="mb-1"><strong>Región base:</strong> ${datosApi.name.common} (${datosApi.subregion})</p>
            <p class="mb-0"><strong>Especies en catálogo:</strong> ${totalRegistros} razas verificadas</p>
        `;
    } else {
        panel.innerHTML = `
            <p class="mb-1 text-warning">&#9679; Modo local activo</p>
            <p class="mb-0"><strong>Especies disponibles:</strong> ${totalRegistros}</p>
        `;
    }
}