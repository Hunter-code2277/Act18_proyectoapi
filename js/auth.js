/**
 * @author Jorge Enrique Parra Garcia
 * Autenticación, registro de usuarios (localStorage) y control de sesión/roles (sessionStorage).
 */

const CLAVE_USUARIOS = "agro_usuarios_db";
const CLAVE_SESION = "agro_sesion_activa";

const USUARIOS_DEMO = [
    {
        nombreCompleto: "Jorge Enrique Parra Garcia",
        usuario: "admin",
        password: "123",
        rol: "Administrador"
    },
    {
        nombreCompleto: "Productor Ganadero Demo",
        usuario: "us1",
        password: "123",
        rol: "Usuario final"
    }
];

function inicializarUsuarios() {
    const actuales = localStorage.getItem(CLAVE_USUARIOS);
    if (!actuales) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_DEMO));
    }
}

function obtenerUsuarios() {
    inicializarUsuarios();
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(lista) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

function iniciarSesionUsuario(usuarioInput, passwordInput) {
    const usuarios = obtenerUsuarios();
    const usuarioLimpio = usuarioInput.trim().toLowerCase();

    const encontrado = usuarios.find(
        u => u.usuario.toLowerCase() === usuarioLimpio && u.password === passwordInput
    );

    if (!encontrado) {
        return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
    }

    const sesion = {
        nombreCompleto: encontrado.nombreCompleto,
        usuario: encontrado.usuario,
        rol: encontrado.rol,
        ingresoEn: new Date().toISOString()
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return { ok: true, sesion };
}

function registrarUsuario({ nombreCompleto, usuario, password, confirmarPassword }) {
    const nombreLimpio = nombreCompleto.trim();
    const usuarioLimpio = usuario.trim();

    if (!nombreLimpio || !usuarioLimpio || !password || !confirmarPassword) {
        return { ok: false, mensaje: "Completa todos los campos del registro." };
    }

    if (password.length < 3) {
        return { ok: false, mensaje: "La contraseña debe tener al menos 3 caracteres." };
    }

    if (password !== confirmarPassword) {
        return { ok: false, mensaje: "Las contraseñas no coinciden." };
    }

    const usuarios = obtenerUsuarios();
    const existe = usuarios.some(u => u.usuario.toLowerCase() === usuarioLimpio.toLowerCase());

    if (existe) {
        return { ok: false, mensaje: "Ese nombre de usuario ya está registrado." };
    }

    const nuevoUsuario = {
        nombreCompleto: nombreLimpio,
        usuario: usuarioLimpio,
        password: password,
        rol: "Usuario final"
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    const sesion = {
        nombreCompleto: nuevoUsuario.nombreCompleto,
        usuario: nuevoUsuario.usuario,
        rol: nuevoUsuario.rol,
        ingresoEn: new Date().toISOString()
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return { ok: true, sesion };
}

function obtenerSesionActiva() {
    const raw = sessionStorage.getItem(CLAVE_SESION);
    return raw ? JSON.parse(raw) : null;
}

function esAdministrador() {
    const sesion = obtenerSesionActiva();
    return Boolean(sesion && sesion.rol === "Administrador");
}

function requerirSesion() {
    const sesion = obtenerSesionActiva();
    if (!sesion) {
        window.location.href = "login.html";
        return null;
    }
    aplicarVisibilidadPorRol();
    return sesion;
}

function requerirAdmin() {
    const sesion = requerirSesion();
    if (!sesion) return null;

    if (sesion.rol !== "Administrador") {
        alert("Acceso denegado: esta sección es exclusiva para el rol Administrador.");
        window.location.href = "index.html";
        return null;
    }
    return sesion;
}

function aplicarVisibilidadPorRol() {
    const admin = esAdministrador();
    document.querySelectorAll(".solo-admin").forEach(el => {
        if (admin) {
            el.classList.remove("d-none");
        } else {
            el.classList.add("d-none");
        }
    });
}

function cerrarSesionUsuario() {
    sessionStorage.removeItem(CLAVE_SESION);
    window.location.href = "login.html";
}

function actualizarBarraSesion() {
    const navList = document.querySelector("#menuNav ul");
    if (!navList) return;

    const sesion = obtenerSesionActiva();
    const liExistente = document.getElementById("item-sesion-nav");
    if (liExistente) liExistente.remove();

    const li = document.createElement("li");
    li.id = "item-sesion-nav";
    li.className = "nav-item d-flex align-items-center gap-2 ms-lg-2";

    if (sesion) {
        const badgeClass = sesion.rol === "Administrador" ? "bg-warning text-dark" : "bg-info text-dark";
        li.innerHTML = `
            <span class="badge ${badgeClass}">@${sesion.usuario} (${sesion.rol})</span>
            <button type="button" class="btn btn-outline-light btn-sm" onclick="cerrarSesionUsuario()">Salir</button>
        `;
    } else {
        li.innerHTML = `<a class="btn btn-nord btn-sm" href="login.html">Iniciar Sesión</a>`;
    }

    navList.appendChild(li);
}