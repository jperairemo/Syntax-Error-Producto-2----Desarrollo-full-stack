import { usuarios, agregarUsuario, eliminarUsuario } from './almacenaje.js';

// Mostrar los usuarios en la tabla
function mostrarUsuarios() {
    let tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar datos

    usuarios.forEach((usuario) => {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.password}</td>
            <td><button class="borrar-button btn-borrar" data-correo="${usuario.correo}">Borrar</button></td>
        `;

        tabla.appendChild(fila);
    });

    // Agregar eventos a los botones "Borrar"
    document.querySelectorAll(".borrar-button").forEach(button => {
        button.addEventListener("click", function() {
            let correo = this.getAttribute("data-correo");
            borrarUsuario(correo);
        });
    });
}

// Borrar usuario
window.borrarUsuario = function(correo) {
    eliminarUsuario(correo);
    mostrarUsuarios(); // Actualizar tabla
}

// Evento de formulario para agregar usuario
document.getElementById("formUsuario").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar recarga

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    // Agregar usuario
    if (agregarUsuario(nombre, correo, password)) {
        mostrarUsuarios();  // Refrescar tabla
        this.reset();       // Limpiar el formulario
    } else {
        alert('No se pudo agregar el usuario. Quizá ya exista.');
    }
});

// Mostrar los usuarios al cargar la página
document.addEventListener("DOMContentLoaded", mostrarUsuarios);
