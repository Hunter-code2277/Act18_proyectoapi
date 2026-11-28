/**
 * @author Jorge Enrique Parra Garcia
 * Gestión administrativa: CRUD completo de especies (alta, edición, baja, restauración) y gestión de usuarios.
 */

const IMAGEN_POR_DEFECTO = "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80";

document.addEventListener("DOMContentLoaded", () => {
    const sesion = requerirAdmin();
    if (!sesion) return;

    document.getElementById("contenido-admin").classList.remove("d-none");
    actualizarBarraSesion();
    renderizarTablaAdmin();
    renderizarTablaUsuarios();

    const formulario = document.getElementById("form-especie");
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarOActualizarEspecie(formulario);
    });

    document.getElementById("btn-cancelar-edicion").addEventListener("click", () => {
        cancelarEdicionEspecie(formulario);
    });

    document.getElementById("btn-restaurar").addEventListener("click", () => {
        guardarGanado(ESPECIES_INICIALES);
        cancelarEdicionEspecie(formulario);
        renderizarTablaAdmin();
        mostrarAlerta("Catálogo base restaurado correctamente.", "info");
    });
});

function guardarOActualizarEspecie(formulario) {
    const listaActual = obtenerGanado();
    const idEditando = Number(document.getElementById("especie-id-editando").value);

    const datosFormulario = {
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

    if (idEditando) {
        const indice = listaActual.findIndex(item => item.id === idEditando);
        if (indice !== -1) {
            listaActual[indice] = { id: idEditando, ...datosFormulario };
            guardarGanado(listaActual);
            cancelarEdicionEspecie(formulario);
            renderizarTablaAdmin();
            mostrarAlerta(`Se actualizó correctamente "${datosFormulario.nombre}".`, "success");
        }
        return;
    }

    const nuevoId = listaActual.length > 0
        ? Math.max(...listaActual.map(item => Number(item.id) || 0)) + 1
        : 1;

    const nuevaEspecie = { id: nuevoId, ...datosFormulario };
    listaActual.push(nuevaEspecie);
    guardarGanado(listaActual);
    formulario.reset();
    renderizarTablaAdmin();
    mostrarAlerta(`Se agregó "${nuevaEspecie.nombre}" al catálogo y buscador.`, "success");
}

function cargarEspecieParaEditar(id) {
    const especie = obtenerGanado().find(item => item.id === id);
    if (!especie) return;

    document.getElementById("especie-id-editando").value = especie.id;
    document.getElementById("nombre").value = especie.nombre;
    document.getElementById("especie").value = especie.especie;
    document.getElementById("estadoPrincipal").value = especie.estadoPrincipal;
    document.getElementById("ubicacion").value = especie.ubicacion;
    document.getElementById("proposito").value = especie.proposito;
    document.getElementById("lugarCompraOptimo").value = especie.lugarCompraOptimo;
    document.getElementById("tipoProveedor").value = especie.tipoProveedor;
    document.getElementById("climaOptimo").value = especie.climaOptimo;
    document.getElementById("precioEstimado").value = especie.precioEstimado;
    document.getElementById("faoItemCode").value = especie.faoItemCode;
    document.getElementById("parametrosReproductivos").value = especie.parametrosReproductivos;
    document.getElementById("imagen").value = especie.imagen;

    document.getElementById("titulo-form-especie").textContent = `Editando Especie: ${especie.nombre}`;
    document.getElementById("btn-guardar-especie").textContent = "Actualizar Especie";
    document.getElementById("btn-cancelar-edicion").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicionEspecie(formulario) {
    formulario.reset();
    document.getElementById("especie-id-editando").value = "";
    document.getElementById("titulo-form-especie").textContent = "Registrar Nueva Especie o Raza";
    document.getElementById("btn-guardar-especie").textContent = "Guardar Especie en Catálogo";
    document.getElementById("btn-cancelar-edicion").classList.add("d-none");
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
                <button type="button" class="btn btn-sm btn-outline-warning me-1" onclick="cargarEspecieParaEditar(${item.id})">Editar</button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarEspecie(${item.id})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

function renderizarTablaUsuarios() {
    const tbody = document.getElementById("tabla-usuarios");
    if (!tbody) return;

    const usuarios = obtenerUsuarios();
    const sesionActual = obtenerSesionActiva();

    tbody.innerHTML = usuarios.map(u => {
        const esUsuarioProtegido = u.usuario === "admin" || (sesionActual && u.usuario === sesionActual.usuario);
        return `
            <tr>
                <td class="fw-semibold text-white">${u.nombreCompleto}</td>
                <td>@${u.usuario}</td>
                <td>
                    <span class="badge ${u.rol === "Administrador" ? "bg-warning text-dark" : "bg-info text-dark"}">
                        ${u.rol}
                    </span>
                </td>
                <td class="text-nowrap">
                    ${esUsuarioProtegido
                        ? `<span class="small opacity-75">Cuenta protegida</span>`
                        : `
                            <button type="button" class="btn btn-sm btn-outline-info me-1" onclick="cambiarRolUsuario('${u.usuario}')">Cambiar rol</button>
                            <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${u.usuario}')">Eliminar</button>
                        `
                    }
                </td>
            </tr>
        `;
    }).join("");
}

function cambiarRolUsuario(nombreUsuario) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.usuario === nombreUsuario);
    if (!usuario) return;

    usuario.rol = usuario.rol === "Administrador" ? "Usuario final" : "Administrador";
    guardarUsuarios(usuarios);
    renderizarTablaUsuarios();
    mostrarAlerta(`Rol actualizado para @${usuario.usuario}: ahora es ${usuario.rol}.`, "info");
}

function eliminarUsuario(nombreUsuario) {
    if (nombreUsuario === "admin") return;
    const filtrados = obtenerUsuarios().filter(u => u.usuario !== nombreUsuario);
    guardarUsuarios(filtrados);
    renderizarTablaUsuarios();
    mostrarAlerta(`Usuario @${nombreUsuario} eliminado.`, "warning");
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