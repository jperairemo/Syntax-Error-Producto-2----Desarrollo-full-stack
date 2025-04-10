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
    seleccionContainer.appendChild(draggedElement);

    const placeholder = seleccionContainer.querySelector('p');
    if (placeholder && seleccionContainer.children.length > 1) {
      placeholder.remove();
    }

    // 🔽 Guardar selección en localStorage
    const seleccion = JSON.parse(localStorage.getItem("seleccionVoluntariados")) || [];
    if (!seleccion.includes(cardId)) {
      seleccion.push(cardId);
      localStorage.setItem("seleccionVoluntariados", JSON.stringify(seleccion));
    }
  }
}


// --- Función para mostrar las tarjetas ---

async function mostrarVoluntariadosHome() {
  if (!voluntariadosContainer) return;

  voluntariadosContainer.innerHTML = "";
  seleccionContainer.innerHTML = '<p>Aquí se mostraría una selección de voluntariados.</p>'; // reinicia por defecto

  try {
    const voluntariados = await obtenerVoluntariados();
    const seleccion = JSON.parse(localStorage.getItem("seleccionVoluntariados")) || [];

    if (voluntariados.length === 0) {
      voluntariadosContainer.innerHTML = "<p>No hay voluntariados disponibles actualmente.</p>";
      return;
    }

    console.log("Seleccion guardada:", seleccion);


    voluntariados.forEach(voluntariado => {
      const card = document.createElement("div");
      const cardId = `voluntariado-card-${voluntariado.id}`;
      card.id = cardId;
      card.classList.add("card");

      const tipoClase = voluntariado.tipo === "Oferta" ? "card-oferta" : "card-peticion";
      card.classList.add(tipoClase);
      card.draggable = true;

      card.innerHTML = `
              <div class="card-image"></div>
              <h3>${voluntariado.titulo}</h3>
              <p><strong>Usuario:</strong> ${voluntariado.usuario}</p>
              <p><strong>Fecha:</strong> ${voluntariado.fecha}</p>
              <p><strong>Descripción:</strong> ${voluntariado.descripcion}</p>
              <p class="tipo">${voluntariado.tipo}</p>
          `;

      card.addEventListener('dragstart', handleDragStart);

      // 🔁 Si está en la selección, agregarlo al contenedor correspondiente
      if (seleccion.includes(cardId)) {
        if (seleccionContainer.querySelector('p')) {
          seleccionContainer.querySelector('p').remove(); // quitar placeholder
        }
        seleccionContainer.appendChild(card);
      } else {
        voluntariadosContainer.appendChild(card);
      }
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

document.addEventListener("DOMContentLoaded", () => {
  // Ejecutar toda la lógica de inicio
  initHome();

  // Activar botón para vaciar selección
  const botonVaciar = document.getElementById("vaciarSeleccion");
  if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
      localStorage.removeItem("seleccionVoluntariados");
      location.reload();
    });
  }
});
