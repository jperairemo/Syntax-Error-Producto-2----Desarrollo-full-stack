// controlador/loginControlador.js

// Importa la función que permite validar el usuario desde el modelo de datos
import { loguearUsuario } from "../Modelo/almacenaje.js";

// Función que se ejecuta cuando se envía el formulario de login
function Loguear(event) {
  event.preventDefault(); // Evita que el formulario recargue la página

  // Obtiene los valores introducidos por el usuario en el formulario
  const correo = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Verifica si el usuario existe y la contraseña es correcta
  const ok = loguearUsuario(correo, password);

  if (ok) {
    location.href = "home.html";  // Si el login es correcto, redirige a la página principal
  } else {
    alert("Correo o contraseña incorrectos"); // Muestra error si los datos no coinciden
  }
}

// Cuando el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin"); // Obtiene el formulario de login

  // Si existe el formulario, asigna el evento de envío al manejador Loguear
  if (form) {
    form.addEventListener("submit", Loguear);
  }
});

  