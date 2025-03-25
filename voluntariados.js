import { voluntariados, agregarVoluntariado, eliminarVoluntariado } from './almacenaje.js';

// Función para mostrar los voluntariados en la tabla
function mostrarVoluntariados() {
    let tabla = document.getElementById("voluntariados-table").getElementsByTagName("tbody")[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar los datos

    voluntariados.forEach((v) => {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${v.titulo}</td>
            <td>${v.usuario}</td>
            <td>${v.fecha}</td>
            <td>${v.descripcion}</td>
            <td>${v.tipo}</td>
            <td><button class="borrar-button btn btn-danger" data-id="${v.id}">Borrar</button></td>
        `;

        tabla.appendChild(fila);
    });

    // Agregar eventos a los botones "Borrar"
    document.querySelectorAll(".borrar-button").forEach(button => {
        button.addEventListener("click", function() {
            let id = parseInt(this.getAttribute("data-id"));
            borrarVoluntariado(id);
        });
    });
}

// Función para borrar un voluntariado
window.borrarVoluntariado = function(id) {
    eliminarVoluntariado(id); // Elimina del array
    mostrarVoluntariados(); // Actualiza la tabla
}

// Capturar el evento del formulario para agregar un voluntariado
document.getElementById("formVoluntariado").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar recarga de la página

    let titulo = document.getElementById("titulo").value;
    let usuario = document.getElementById("usuario").value;
    let fecha = document.getElementById("fecha").value;
    let descripcion = document.getElementById("descripcion").value;
    let tipo = document.getElementById("tipo").value;

    // Agregar el nuevo voluntariado al array
    agregarVoluntariado(titulo, usuario, fecha, descripcion, tipo);

    // Actualizar la tabla
    mostrarVoluntariados();

    // Limpiar el formulario
    this.reset();
});

// Cargar los voluntariados al abrir la página
document.addEventListener("DOMContentLoaded", mostrarVoluntariados);
