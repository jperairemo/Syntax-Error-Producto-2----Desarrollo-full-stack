import { initDB, obtenerVoluntariados } from "../Modelo/almacenaje.js";

const voluntariadosContainer = document.getElementById("voluntariadosContainer");
const seleccionContainer = document.getElementById("seleccionVoluntariadosContainer");

// --- Funciones de Drag and Drop ---

function handleDragStart(event) {
    // Al empezar a arrastrar, guarda el ID del elemento arrastrado
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
    // Previene el comportamiento por defecto para permitir el drop
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(cardId);

    if (draggedElement && event.target === seleccionContainer) {
        // Mueve el elemento arrastrado al contenedor de selección
        seleccionContainer.appendChild(draggedElement);

        // Elimina el texto placeholder si es el primer elemento
        const placeholder = seleccionContainer.querySelector('p');
        if (placeholder && seleccionContainer.children.length > 1) { // >1 porque el elemento recién añadido ya cuenta
             placeholder.remove();
        }
    }
}

// --- Función para mostrar las tarjetas ---

async function mostrarVoluntariadosHome() {
    if (!voluntariadosContainer) return; 

    voluntariadosContainer.innerHTML = ""; 

    try {
        const voluntariados = await obtenerVoluntariados(); 

        if (voluntariados.length === 0) {
            voluntariadosContainer.innerHTML = "<p>No hay voluntariados disponibles actualmente.</p>";
            return;
        }

        voluntariados.forEach(voluntariado => {
            const card = document.createElement("div");
            // Asignar ID único a la tarjeta para poder arrastrarla
            card.id = `voluntariado-card-${voluntariado.id}`; 
            card.classList.add("card");
            // Asignar color según tipo
            const tipoClase = voluntariado.tipo === "Oferta" ? "card-oferta" : "card-peticion";
            card.classList.add(tipoClase);

            // ¡Hacer la tarjeta arrastrable!
            card.draggable = true; 

            card.innerHTML = `
                <div class="card-image"></div>
                <h3>${voluntariado.titulo}</h3>
                <p><strong>Usuario:</strong> ${voluntariado.usuario}</p>
                <p><strong>Fecha:</strong> ${voluntariado.fecha}</p>
                <p><strong>Descripción:</strong> ${voluntariado.descripcion}</p>
                <p class="tipo">${voluntariado.tipo}</p>
            `;

            // Añadir el listener para iniciar el arrastre
            card.addEventListener('dragstart', handleDragStart);

            voluntariadosContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error al mostrar voluntariados en Home:", error);
        voluntariadosContainer.innerHTML = "<p>Error al cargar los voluntariados.</p>";
    }
}


// --- Inicialización ---

async function initHome() {
    try {
        await initDB(); 
        await mostrarVoluntariadosHome(); 

        // Configurar el contenedor de selección como zona de drop
        if (seleccionContainer) {
            seleccionContainer.addEventListener('dragover', handleDragOver);
            seleccionContainer.addEventListener('drop', handleDrop);
        }

    } catch (error) {
        console.error("Error inicializando la página Home:", error);
    }
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", initHome);