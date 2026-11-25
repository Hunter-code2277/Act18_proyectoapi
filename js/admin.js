/**
 * @author Jorge Enrique Parra Garcia
 *Gestion de altas, bajas y restauracion de especies ganaderas y puntos de compra.
 */

const IMAGEN_POR_DEFECTO = "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80";

document.addEventListener("DOMContentLoaded", () => {
    const sesion = requerirSesion();
    if (!sesion) return;

    actualizarBarraSesion();
    renderizarTablaAdmin();

    const formulario = document.getElementById("form-especie");
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        agregarNuevaEspecie(formulario);
    });

    document.getElementById("btn-restaurar").addEventListener("click", () => {
        guardarGanado(ESPECIES_INICIALES);
        renderizarTablaAdmin();
        mostrarAlerta("Catálogo base restaurado correctamente.", "info");
    });
});

function agregarNuevaEspecie(formulario) {
    const listaActual = obtenerGanado();
    const nuevoId = listaActual.length > 0
        ? Math.max(...listaActual.map(item => Number(item.id) || 0)) + 1
        : 1;

    const nuevaEspecie = {
        id: nuevoId,
        nombre: document.getElementById("nombre").value.trim(),
        especie: document.getElementById("especie").value,
        proposito: document.getElementById("proposito").value.trim(),
        ubicacion: document.getElementById("ubicacion").value.trim(),
        estadoPrincipal: document.getElementById("estadoPrincipal").value.trim(),
        climaOptimo: document.getElementById("climaOptimo").value.trim() || "Adaptable",
        lugarCompraOptimo: document.getElementById("lugarCompraOptimo").value.trim(),
        tipoProveedor: document.getElementById("tipoProveedor").value.trim(),
        precioEstimado: document.getElementById("precioEstimado").value.trim() || "Consultar cotización",
        parametrosReproductivos: document.getElementById("parametrosReproductivos").value.trim(),
        faoItemCode: document.getElementById("faoItemCode").value.trim() || "866",
        imagen: document.getElementById("imagen").value.trim() || IMAGEN_POR_DEFECTO
    };

    listaActual.push(nuevaEspecie);
    guardarGanado(listaActual);
    formulario.reset();
    renderizarTablaAdmin();
    mostrarAlerta(`Se agregó "${nuevaEspecie.nombre}" al catálogo y buscador.`, "success");
}

function eliminarEspecie(id) {
    const listaActual = obtenerGanado();
    const filtrada = listaActual.filter(item => item.id !== id);
    guardarGanado(filtrada);
    renderizarTablaAdmin();
    mostrarAlerta("Registro eliminado del catálogo.", "warning");
}

function renderizarTablaAdmin() {
    const tbody = document.getElementById("tabla-ganado");
    const lista = obtenerGanado();

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">No hay especies registradas actualmente.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td class="fw-bold text-white">${item.nombre}</td>
            <td>${item.especie}</td>
            <td>${item.estadoPrincipal} — <span class="small opacity-75">${item.ubicacion}</span></td>
            <td>${item.lugarCompraOptimo}</td>
            <td class="text-nowrap">
                <a href="perfiles.html?id=${item.id}" class="btn btn-sm btn-outline-info me-1">Ver</a>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarEspecie(${item.id})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

function mostrarAlerta(mensaje, tipo) {
    const contenedor = document.getElementById("alerta-admin");
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
}