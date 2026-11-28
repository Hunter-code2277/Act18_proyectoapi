/**
 * @author Jorge Enrique Parra Garcia
 * Vista detallada de cada especie ganadera enriquecida con API Ninjas Animals API.
 */

function limpiarNombreEspecie(textoEspecie) {
    if (typeof obtenerSoloEspecie === "function") {
        return obtenerSoloEspecie(textoEspecie);
    }
    return textoEspecie ? textoEspecie.split("(")[0].trim() : "";
}

document.addEventListener("DOMContentLoaded", async () => {
    const sesion = requerirSesion();
    if (!sesion) return;

    actualizarBarraSesion();

    const lista = obtenerGanado();
    const selector = document.getElementById("selector-perfil");

    selector.innerHTML = lista.map(item => `
        <option value="${item.id}">${item.nombre} (${limpiarNombreEspecie(item.especie)})</option>
    `).join("");

    const params = new URLSearchParams(window.location.search);
    const idParam = Number(params.get("id"));
    const especieInicial = lista.find(item => item.id === idParam) || lista[0];

    if (especieInicial) {
        selector.value = especieInicial.id;
        await mostrarFichaEspecie(especieInicial);
    }

    selector.addEventListener("change", async (e) => {
        const seleccionada = lista.find(item => item.id === Number(e.target.value));
        if (seleccionada) {
            const nuevaUrl = `${window.location.pathname}?id=${seleccionada.id}`;
            window.history.replaceState({}, "", nuevaUrl);
            await mostrarFichaEspecie(seleccionada);
        }
    });
});

async function mostrarFichaEspecie(especie) {
    const contenedor = document.getElementById("contenedor-ficha");
    contenedor.innerHTML = `<p class="text-info mb-0">Consultando datos de la especie en API Ninjas...</p>`;

    const queryApi = resolverQueryNinjas(especie);
    const infoApi = await consultarApiNinjasAnimal(queryApi);

    const nombreCientifico = infoApi?.taxonomy?.scientific_name || "No reportado en API";
    const familiaApi = infoApi?.taxonomy?.family || "N/A";
    const gestacionApi = infoApi?.characteristics?.gestation_period || "No reportada en API";
    const dietaApi = infoApi?.characteristics?.diet || "N/A";
    const ubicacionesApi = Array.isArray(infoApi?.locations) && infoApi.locations.length > 0
        ? infoApi.locations.join(", ")
        : "Global";

    const botonAdmin = esAdministrador()
        ? `<a href="admin.html" class="btn btn-outline-light">Editar en Administración</a>`
        : "";

    contenedor.innerHTML = `
        <div class="row g-4 align-items-start">
            <div class="col-lg-5">
                <img src="${especie.imagen}" alt="Ejemplar reproductor de raza ${especie.nombre}" class="img-fluid rounded w-100" style="max-height: 340px; object-fit: cover; border: 1px solid #4c566a;">
                <div class="bloque-dato mt-3 small">
                    <h2 class="h6 text-info fw-bold mb-2">Datos desde API Ninjas (Animals API)</h2>
                    <p class="mb-1"><strong>Consulta API:</strong> <code>?name=${queryApi}</code></p>
                    <p class="mb-1"><strong>Nombre científico:</strong> <em>${nombreCientifico}</em></p>
                    <p class="mb-1"><strong>Familia:</strong> ${familiaApi}</p>
                    <p class="mb-1"><strong>Gestación (API):</strong> ${gestacionApi}</p>
                    <p class="mb-1"><strong>Dieta (API):</strong> ${dietaApi}</p>
                    <p class="mb-0"><strong>Distribución (API):</strong> ${ubicacionesApi}</p>
                </div>
            </div>

            <div class="col-lg-7">
                <span class="badge badge-especie mb-2">${obtenerSoloEspecie(especie.especie)}</span>
                <h1 class="h2 fw-bold text-white mb-2">${especie.nombre}</h1>
                <p class="text-info fw-semibold mb-4">${especie.proposito}</p>

                <div class="bloque-dato mb-3">
                    <h2 class="h6 text-white fw-bold mb-1">Ubicación y Zonas de Presencia</h2>
                    <p class="mb-1 small"><strong>Estado principal:</strong> ${especie.estadoPrincipal}</p>
                    <p class="mb-0 small">${especie.ubicacion}</p>
                </div>

                <div class="bloque-dato mb-3" style="border-left: 4px solid #5fd9fa;">
                    <h2 class="h6 text-info fw-bold mb-1">Lugar Óptimo de Compra para Reproducción</h2>
                    <p class="mb-1 small"><strong>Punto recomendado:</strong> ${especie.lugarCompraOptimo}</p>
                    <p class="mb-1 small"><strong>Tipo de proveedor:</strong> ${especie.tipoProveedor}</p>
                    <p class="mb-0 small"><strong>Inversión estimada:</strong> ${especie.precioEstimado}</p>
                </div>

                <div class="bloque-dato mb-4">
                    <h2 class="h6 text-white fw-bold mb-1">Aptitud y Parámetros Reproductivos</h2>
                    <p class="mb-0 small">${especie.parametrosReproductivos}</p>
                    <p class="mb-0 small opacity-75 mt-1"><strong>Clima óptimo:</strong> ${especie.climaOptimo} &bull; <strong>Código FAOSTAT:</strong> ${especie.faoItemCode || "N/A"}</p>
                </div>

                <div class="d-flex flex-wrap gap-2">
                    <a href="catalogo.html" class="btn btn-nord">Buscar o cotizar razas</a>
                    ${botonAdmin}
                </div>
            </div>
        </div>
    `;
}