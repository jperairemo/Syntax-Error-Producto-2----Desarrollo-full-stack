// controlador/voluntariadosControlador.js

// Importamos la clase Voluntariado (modelo de datos)
import { Voluntariado } from "../Modelo/Voluntariado.js";

// Importamos funciones del modelo para manejar los datos de los voluntariados en IndexedDB
import {
    initDB,
    obtenerVoluntariados,
    guardarVoluntariado,
    eliminarVoluntariado
} from "../Modelo/datos.js";

// -------------------------------
// FUNCIÓN PARA MOSTRAR VOLUNTARIADOS EN LA TABLA
// -------------------------------
async function mostrarVoluntariados() {
    const tabla = document.getElementById("tablaVoluntariados");
    tabla.innerHTML = ""; // Limpiamos la tabla antes de rellenarla

    try {
        const voluntariados = await obtenerVoluntariados(); // Obtenemos la lista desde IndexedDB

        voluntariados.forEach(voluntariado => {
            // Creamos una fila por cada voluntariado
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${voluntariado.titulo}</td>
                <td>${voluntariado.usuario}</td>
                <td>${voluntariado.fecha}</td>
                <td>${voluntariado.descripcion}</td>
                <td>${voluntariado.tipo}</td>
                <td><button class="borrar-button btn btn-danger" data-id="${voluntariado.id}">Borrar</button></td>
            `;
            tabla.appendChild(fila);
        });

        // Asignamos eventos a los botones de borrar
        document.querySelectorAll(".borrar-button").forEach(btn => {
            btn.addEventListener("click", async e => {
                const id = Number(e.target.getAttribute("data-id")); // Obtener ID del voluntariado
                await eliminarVoluntariado(id); // Eliminar voluntariado en IndexedDB
                mostrarVoluntariados(); // Refrescamos la tabla
            });
        });

    } catch (error) {
        console.error("Error al mostrar voluntariados:", error);
    }
}

// -------------------------------
// FUNCIÓN PARA DAR DE ALTA UN VOLUNTARIADO
// -------------------------------
async function DarAltaVoluntariado(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Capturamos los valores del formulario
    const titulo = document.getElementById("titulo").value;
    const usuario = document.getElementById("usuario").value;
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value;
    const tipo = document.getElementById("tipo").value;

    // Creamos un ID único basado en la fecha actual
    const id = new Date().getTime();

    // Creamos un nuevo objeto Voluntariado
    const nuevoVoluntariado = new Voluntariado(id, titulo, usuario, fecha, descripcion, tipo);

    // Guardamos el voluntariado en IndexedDB
    try {
        await guardarVoluntariado(nuevoVoluntariado);
        mostrarVoluntariados(); // Refrescamos la tabla con el nuevo voluntariado
        document.getElementById("formVoluntariado").reset(); // Limpiamos el formulario
    } catch (error) {
        console.error("Error al guardar el voluntariado:", error);
    }
}

// -------------------------------
// FUNCIÓN PRINCIPAL PARA INICIAR EL CONTROLADOR
// -------------------------------
async function iniciarVoluntariados() {
    await initDB(); // Inicializar IndexedDB antes de cualquier operación
    mostrarVoluntariados(); // Cargamos los voluntariados al abrir la vista

    const form = document.getElementById("formVoluntariado");
    if (form) {
        form.addEventListener("submit", DarAltaVoluntariado); // Asociamos el evento al botón de alta
    }
}

// Lanzamos el controlador cuando el DOM está listo
document.addEventListener("DOMContentLoaded", iniciarVoluntariados);
