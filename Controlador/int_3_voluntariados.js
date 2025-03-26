// controlador/int_3_voluntariados.js

// Importamos la clase Voluntariado (modelo de datos)
import { Voluntariado } from "../Modelo/Voluntariado.js";

// Importamos funciones del modelo para manejar los datos de los voluntariados en IndexedDB
import {
    initDB,
    obtenerVoluntariados,
    guardarVoluntariado,
    eliminarVoluntariado
} from "../Modelo/almacenaje.js";

// Importamos Chart.js desde CDN
import "https://cdn.jsdelivr.net/npm/chart.js";

// Variable global para almacenar la referencia al gráfico
let graficoVoluntariados;

// -------------------------------
// FUNCIÓN PARA MOSTRAR VOLUNTARIADOS EN LA TABLA
// -------------------------------
async function mostrarVoluntariados() {
    const tabla = document.getElementById("tablaVoluntariados").querySelector("tbody");
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
                await mostrarVoluntariados(); // Refrescamos la tabla
                generarGraficoVoluntariados(); // Actualizamos el gráfico
            });
        });

        // Generamos el gráfico con los nuevos datos
        generarGraficoVoluntariados();

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
        await mostrarVoluntariados(); // Refrescamos la tabla con el nuevo voluntariado
        generarGraficoVoluntariados(); // Actualizamos el gráfico
        document.getElementById("formVoluntariado").reset(); // Limpiamos el formulario
    } catch (error) {
        console.error("Error al guardar el voluntariado:", error);
    }
}

// -------------------------------
// FUNCIÓN PARA GENERAR EL GRÁFICO DE VOLUNTARIADOS
// -------------------------------
async function generarGraficoVoluntariados() {
    const voluntariados = await obtenerVoluntariados(); // Obtener los voluntariados desde IndexedDB

    // Contar la cantidad de cada tipo (Petición / Oferta)
    const conteo = { Petición: 0, Oferta: 0 };
    voluntariados.forEach(voluntariado => {
        if (conteo[voluntariado.tipo] !== undefined) {
            conteo[voluntariado.tipo]++;
        }
    });

    // Obtener el contexto del canvas
    const ctx = document.getElementById("graficoVoluntariados").getContext("2d");

    // Destruir gráfico anterior si existe para evitar errores
    if (graficoVoluntariados) {
        graficoVoluntariados.destroy();
    }

    // Crear el nuevo gráfico
    graficoVoluntariados = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Petición", "Oferta"],
            datasets: [{
                label: "Voluntariados",
                data: [conteo["Petición"], conteo["Oferta"]],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
}

// -------------------------------
// FUNCIÓN PRINCIPAL PARA INICIAR EL CONTROLADOR
// -------------------------------
async function iniciarVoluntariados() {
    await initDB(); // Inicializar IndexedDB antes de cualquier operación
    await mostrarVoluntariados(); // Cargamos los voluntariados al abrir la vista

    const form = document.getElementById("formVoluntariado");
    if (form) {
        form.addEventListener("submit", DarAltaVoluntariado); // Asociamos el evento al botón de alta
    }
}

// Lanzamos el controlador cuando el DOM está listo
document.addEventListener("DOMContentLoaded", iniciarVoluntariados);
