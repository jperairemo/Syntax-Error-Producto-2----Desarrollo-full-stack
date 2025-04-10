// controlador/menuControlador.js

// Importamos funciones del modelo para obtener el usuario activo y cerrar sesión
import { obtenerUsuarioActivo, cerrarSesion } from "../Modelo/almacenaje.js";

// Función que muestra el nombre del usuario activo o "-no login-"
function mostrarUsuarioActivo() {
  const navUsuario = document.getElementById("navUsuario");
  const usuario = obtenerUsuarioActivo();

  if (navUsuario) {
    if (usuario) {
      navUsuario.innerHTML = `
        <span>${usuario.nombre.charAt(0).toUpperCase() + usuario.nombre.slice(1)}</span>
        <button id="cerrarSesion" class="btn btn-sm btn-danger">Cerrar sesión</button>
      `;

      const btnCerrar = document.getElementById("cerrarSesion");
      if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
          cerrarSesion();
          location.href = "inicioSesion.html";
        });
      }

    } else {
      navUsuario.innerHTML = `
        <span class="me-2">-no login-</span>
        <a href="inicioSesion.html">Login</a>
      `;
    }
  }
}

// ✅ Ejecuta la función cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", mostrarUsuarioActivo);
