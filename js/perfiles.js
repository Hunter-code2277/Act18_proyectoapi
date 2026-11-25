/**
 * @author Jorge Enrique Parra Garcia
 *Vista detallada de cada especie ganadera, ubicacion, lugar optimo de compra y datos de la api.
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
    const infoPais = await consultarDatosApiSector("mexico");

    const referenciaRegion = infoPais
        ? `${infoPais.name.common} (${infoPais.subregion})`
        : "México (referencia local)";

    contenedor.innerHTML = `
        <div class="row g-4 align-items-start">
            <div class="col-lg-5">
                <img src="${especie.imagen}" alt="${especie.nombre}" class="img-fluid rounded w-100" style="max-height: 340px; object-fit: cover; border: 1px solid #4c566a;">
                <div class="bloque-dato mt-3 small">
                    <h6 class="text-info fw-bold mb-2">Referencia de API y Estadística</h6>
                    <p class="mb-1"><strong>Región consultada en API:</strong> ${referenciaRegion}</p>
                    <p class="mb-1"><strong>Código de ítem FAOSTAT:</strong> ${especie.faoItemCode || "N/A"}</p>
                    <p class="mb-0"><strong>Clima óptimo:</strong> ${especie.climaOptimo}</p>
                </div>
            </div>

            <div class="col-lg-7">
                <span class="badge badge-especie mb-2">${obtenerSoloEspecie(especie.especie)}</span>
                <h1 class="h2 fw-bold text-white mb-2">${especie.nombre}</h1>
                <p class="text-info fw-semibold mb-4">${especie.proposito}</p>

                <div class="bloque-dato mb-3">
                    <h6 class="text-white fw-bold mb-1">Ubicación y Zonas de Presencia</h6>
                    <p class="mb-1 small"><strong>Estado principal:</strong> ${especie.estadoPrincipal}</p>
                    <p class="mb-0 small">${especie.ubicacion}</p>
                </div>

                <div class="bloque-dato mb-3" style="border-left: 4px solid #5fd9fa;">
                    <h6 class="text-info fw-bold mb-1">Lugar Óptimo de Compra para Reproducción</h6>
                    <p class="mb-1 small"><strong>Punto recomendado:</strong> ${especie.lugarCompraOptimo}</p>
                    <p class="mb-1 small"><strong>Tipo de proveedor:</strong> ${especie.tipoProveedor}</p>
                    <p class="mb-0 small"><strong>Inversión estimada:</strong> ${especie.precioEstimado}</p>
                </div>

                <div class="bloque-dato mb-4">
                    <h6 class="text-white fw-bold mb-1">Aptitud y Parámetros Reproductivos</h6>
                    <p class="mb-0 small">${especie.parametrosReproductivos}</p>
                </div>

                <div class="d-flex flex-wrap gap-2">
                    <a href="catalogo.html" class="btn btn-nord">Buscar más razas</a>
                    <a href="admin.html" class="btn btn-outline-light">Editar o agregar registro</a>
                </div>
            </div>
        </div>
    `;
}