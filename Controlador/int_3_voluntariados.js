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

// -------------------------------
// FUNCIÓN PARA MOSTRAR VOLUNTARIADOS EN LA TABLA
// -------------------------------
async function mostrarVoluntariados() {
    const tabla = document.getElementById("tablaVoluntariados").querySelector("tbody");
    tabla.innerHTML = ""; // Limpiamos la tabla antes de rellenarla

    try {
        const voluntariados = await obtenerVoluntariados(); // Obtenemos la lista desde IndexedDB

        voluntariados.forEach(voluntariado => {
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

        document.querySelectorAll(".borrar-button").forEach(btn => {
            btn.addEventListener("click", async e => {
                const id = Number(e.target.getAttribute("data-id"));
                await eliminarVoluntariado(id);
                await mostrarVoluntariados();
                generarGraficoVoluntariados(); // Actualiza el gráfico
            });
        });

        generarGraficoVoluntariados(); // Al final, actualizar gráfico

    } catch (error) {
        console.error("Error al mostrar voluntariados:", error);
    }
}

// -------------------------------
// FUNCIÓN PARA DAR DE ALTA UN VOLUNTARIADO
// -------------------------------
async function DarAltaVoluntariado(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const usuario = document.getElementById("usuario").value;
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value;
    const tipo = document.getElementById("tipo").value;

    const id = new Date().getTime();
    const nuevoVoluntariado = new Voluntariado(id, titulo, usuario, fecha, descripcion, tipo);

    try {
        await guardarVoluntariado(nuevoVoluntariado);
        await mostrarVoluntariados();
        generarGraficoVoluntariados();
        document.getElementById("formVoluntariado").reset();
    } catch (error) {
        console.error("Error al guardar el voluntariado:", error);
    }
}

// -------------------------------
// FUNCIÓN PARA GENERAR EL GRÁFICO DE VOLUNTARIADOS POR USUARIO
// -------------------------------
async function generarGraficoVoluntariados() {
    const voluntariados = await obtenerVoluntariados();

    const conteoPorUsuario = {};
    voluntariados.forEach(voluntariado => {
        const usuario = voluntariado.usuario;
        if (!conteoPorUsuario[usuario]) {
            conteoPorUsuario[usuario] = { Petición: 0, Oferta: 0 };
        }
        conteoPorUsuario[usuario][voluntariado.tipo]++;
    });

    const usuarios = Object.keys(conteoPorUsuario);
    const peticiones = usuarios.map(usuario => conteoPorUsuario[usuario]["Petición"] || 0);
    const ofertas = usuarios.map(usuario => conteoPorUsuario[usuario]["Oferta"] || 0);

    const canvas = document.getElementById("graficoVoluntariados");
    const ctx = canvas.getContext("2d");

    // Limpiar gráfico anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración visual
    const anchoBarra = 30;
    const espacioEntreGrupos = 40;
    const espacioEntreBarras = 10;
    const escala = 30;
    const alturaMax = 200;
    const offsetX = 80;
    const offsetY = canvas.height - 50;

    
    // Dibujar barras por usuario (primero)
    
    usuarios.forEach((usuario, i) => {
        const xBase = offsetX + i * (anchoBarra * 2 + espacioEntreGrupos) + espacioEntreBarras;

        const alturaPeticion = peticiones[i] * escala;
        ctx.fillStyle = "#ff6b6b";
        ctx.fillRect(xBase, offsetY - alturaPeticion, anchoBarra, alturaPeticion);

        const alturaOferta = ofertas[i] * escala;
        ctx.fillStyle = "#4d96ff";
        ctx.fillRect(xBase + anchoBarra + espacioEntreBarras, offsetY - alturaOferta, anchoBarra, alturaOferta);
    });

    
    // Dibujar ejes encima de las barras
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX + usuarios.length * (anchoBarra * 2 + espacioEntreGrupos), offsetY);
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY - alturaMax - 20);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    ctx.stroke();

    
    // Etiquetas de usuario 
    
    usuarios.forEach((usuario, i) => {
        const xBase = offsetX + i * (anchoBarra * 2 + espacioEntreGrupos) + espacioEntreBarras;
        const etiquetaX = xBase + anchoBarra + espacioEntreBarras / 2;
        ctx.fillStyle = "#000";
        ctx.font = "13px 'Quicksand', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(usuario, etiquetaX, offsetY + 15);
    });

    
    // Dibujar valores del eje Y
    
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= alturaMax; i += escala) {
        const y = offsetY - i;
        ctx.fillText(i / escala, offsetX - 10, y + 5);
        ctx.beginPath();
        ctx.moveTo(offsetX - 5, y);
        ctx.lineTo(offsetX, y);
        ctx.stroke();
    }

    
    // Leyenda
    // 
    const leyendaX = offsetX + 50;
    const leyendaY = 20;

    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(leyendaX, leyendaY, 12, 12);
    ctx.fillStyle = "#000";
    ctx.font = "13px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Peticiones", leyendaX + 18, leyendaY + 10);

    ctx.fillStyle = "#4d96ff";
    ctx.fillRect(leyendaX + 100, leyendaY, 12, 12);
    ctx.fillStyle = "#000";
    ctx.fillText("Ofertas", leyendaX + 118, leyendaY + 10);
}



// -------------------------------
// FUNCIÓN PRINCIPAL PARA INICIAR EL CONTROLADOR
// -------------------------------
async function iniciarVoluntariados() {
    await initDB();
    await mostrarVoluntariados();

    const form = document.getElementById("formVoluntariado");
    if (form) {
        form.addEventListener("submit", DarAltaVoluntariado);
    }
}

document.addEventListener("DOMContentLoaded", iniciarVoluntariados);
