// controlador/menuControlador.js

// Importamos funciones del modelo para obtener el usuario activo y cerrar sesión
import { obtenerUsuarioActivo, cerrarSesion } from "../Modelo/almacenaje.js";

// Importamos funciones de la vista para mostrar el menú según si hay login o no
import { mostrarMenuLogin, mostrarMenuUsuario } from "../Vista/menuVista.js";

// Función que gestiona la lógica del menú según el estado del usuario
function iniciarMenu() {
  const usuario = obtenerUsuarioActivo(); // Recupera el usuario activo desde el almacenamiento

  if (usuario) {
    // Si hay usuario logueado, muestra el menú personalizado
    mostrarMenuUsuario(usuario);

    // Asigna evento al botón "Cerrar sesión" si existe en el DOM
    const btnCerrar = document.getElementById("cerrarSesion");
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        cerrarSesion(); // Borra el usuario activo del almacenamiento
        location.href = "login.html"; // Redirige al login
      });
    }
  } else {
    // Si no hay usuario logueado, muestra el menú con opción de login
    mostrarMenuLogin();
  }
}

// Ejecuta la función cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", iniciarMenu);