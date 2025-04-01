// controlador/loginControlador.js

// Importa la función que permite validar el usuario desde el modelo de datos
import { loguearUsuario, obtenerUsuarioActivo, cerrarSesion } from "../Modelo/almacenaje.js";

// Función que se ejecuta cuando se envía el formulario de login
function Loguear(event) {
  event.preventDefault();

  const correo = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const ok = loguearUsuario(correo, password);

  if (ok) {
    alert("Inicio de sesión exitoso"); // ✅ Mostrar alerta

    // Espera un momento antes de redirigir
    setTimeout(() => {
      location.href = "home.html";
    }, 100); // pequeño retraso para que se vea la alerta
  } else {
    alert("Correo o contraseña incorrectos");
  }
}

// Mostrar el usuario activo en el menú
function mostrarUsuarioActivo() {
  const navUsuario = document.getElementById("navUsuario");
  const usuario = obtenerUsuarioActivo();

  if (navUsuario) {
    if (usuario) {
      navUsuario.innerHTML = `
        <span>${usuario}</span>
        <button id="cerrarSesionBtn" class="btn btn-sm btn-outline-dark ms-2">Cerrar Sesión</button>
      `;
      // Evento para cerrar sesión
      const cerrarBtn = document.getElementById("cerrarSesionBtn");
      cerrarBtn.addEventListener("click", () => {
        cerrarSesion();
        location.reload(); // Recarga la página para reflejar el cierre
      });
    } else {
      navUsuario.innerHTML = `<a href="inicioSesion.html">Login</a>`;
    }
  }
}

// Cuando el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");

  if (form) {
    form.addEventListener("submit", Loguear);
  }

  mostrarUsuarioActivo(); // Llama a la función para mostrar usuario o botón login
});
