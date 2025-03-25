import { validarUsuario } from './datos.js';

// 🟢 Capturar el evento submit del formulario de login
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que la página se recargue

    let correo = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let usuario = validarUsuario(correo, password);

    if (usuario) {
        // Guardar usuario logueado en sesión (solo en memoria, sin persistencia)
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

        // Actualizar el menú con el correo del usuario
        actualizarMenuUsuario(usuario.correo);

        // Redirigir a la página principal (opcional)
        window.location.href = "home.html"; 
    } else {
        alert("Correo o contraseña incorrectos. Intenta de nuevo.");
    }
});

// 🟢 Función para actualizar el menú con el usuario logueado
function actualizarMenuUsuario(correo) {
    let navUsuario = document.getElementById("navUsuario");
    if (navUsuario) {
        navUsuario.innerHTML = `<a href="#">${correo}</a>`;
    }
}

// 🟢 Verificar si hay un usuario logueado al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    let usuarioGuardado = sessionStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
        let usuario = JSON.parse(usuarioGuardado);
        actualizarMenuUsuario(usuario.correo);
    }
});
