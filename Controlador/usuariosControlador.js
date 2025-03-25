// controlador/usuariosControlador.js

// Importamos la clase Usuario (modelo de datos)
import { Usuario } from "../Modelo/Usuario.js";

// Importamos funciones del modelo para manejar los datos de los usuarios
import {
  obtenerUsuarios,
  guardarUsuario,
  eliminarUsuario
} from "../Modelo/datos.js";

// Función que muestra todos los usuarios en la tabla HTML
function mostrarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = ""; // Limpiamos la tabla antes de rellenarla

  const usuarios = obtenerUsuarios(); // Obtenemos la lista desde localStorage

  usuarios.forEach(usuario => {
    // Creamos una fila por cada usuario
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.password}</td>
      <td><button class="borrar-button btn btn-danger" data-correo="${usuario.correo}">Borrar</button></td>
    `;
    tabla.appendChild(fila); // Añadimos la fila a la tabla
  });

  // Asignamos eventos a los botones de borrar
  document.querySelectorAll(".borrar-button").forEach(btn => {
    btn.addEventListener("click", e => {
      const correo = e.target.getAttribute("data-correo"); // Obtenemos el correo del usuario a borrar
      eliminarUsuario(correo); // Lo eliminamos del almacenamiento
      mostrarUsuarios(); // Volvemos a actualizar la tabla
    });
  });
}

// Función que maneja el alta de usuario cuando se envía el formulario
function DarAltaUsuario(event) {
  event.preventDefault(); // Evita que se recargue la página

  // Capturamos los valores del formulario
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  // Creamos un nuevo objeto Usuario
  const nuevoUsuario = new Usuario(nombre, correo, password);

  // Guardamos el usuario en localStorage
  const ok = guardarUsuario(nuevoUsuario);

  if (ok) {
    mostrarUsuarios(); // Refrescamos la tabla con el nuevo usuario
    document.getElementById("formUsuario").reset(); // Limpiamos el formulario
  } else {
    alert("El correo ya está registrado"); // Avisamos si ya existe
  }
}

// Función que se ejecuta al cargar la página
function iniciarUsuarios() {
  mostrarUsuarios(); // Cargamos los usuarios al abrir la vista
  const form = document.getElementById("formUsuario");
  if (form) {
    form.addEventListener("submit", DarAltaUsuario); // Asociamos el evento al botón de alta
  }
}

// Lanzamos el controlador cuando el DOM está listo
document.addEventListener("DOMContentLoaded", iniciarUsuarios);