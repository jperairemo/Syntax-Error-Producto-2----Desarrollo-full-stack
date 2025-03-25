import { obtenerVoluntariados } from './datos.js';

const voluntariados = [
    {
        titulo: "Ayuda con paseo de perro en horarios específicos",
        usuario: "Pedro",
        fecha: "2025-02-10",
        descripcion: "Mi jornada laboral me impide dedicar el tiempo necesario para pasear a mi perro.",
        tipo: "Oferta"
    },
    {
        titulo: "Se ofrece mujer jubilada para pasear perros",
        usuario: "María",
        fecha: "2025-03-15",
        descripcion: "Mujer jubilada amante de los animales desea pasear perros para mantenerse activa y disfrutar de su compañía. Disponibilidad total.",
        tipo: "Petición"
    },
    {
        titulo: "Ayuda y atención con mi perro",
        usuario: "Anya",
        fecha: "2025-04-01",
        descripcion: "Estoy en plena mudanza y con los compromisos profesionales o viajes, no tengo tiempo para pasear a mi perro.",
        tipo: "Oferta"
    }
];
// Función para mostrar dinámicamente las tarjetas de voluntariados
function mostrarVoluntariados() {
    let container = document.getElementById("voluntariadosContainer");
    container.innerHTML = ""; // Limpiar antes de cargar

    let voluntariados = obtenerVoluntariados(); // Obtener los voluntariados desde datos.js

    voluntariados.forEach(voluntariado => {
        let card = document.createElement("div");

        // Asignar color según tipo (Oferta o Petición)
        let tipoClase = voluntariado.tipo === "Oferta" ? "card-oferta" : "card-peticion";

        card.classList.add("card", tipoClase); // Ahora sí, después de definir tipoClase

        card.innerHTML = `
            <div class="card-image"></div>
            <h3>${voluntariado.titulo}</h3>
            <p><strong>Usuario:</strong> ${voluntariado.usuario}</p>
            <p><strong>Fecha:</strong> ${voluntariado.fecha}</p>
            <p><strong>Descripción:</strong> ${voluntariado.descripcion}</p>
            <p class="tipo">${voluntariado.tipo}</p>
        `;

        container.appendChild(card);
    });
}

// Cargar los voluntariados al abrir la página
document.addEventListener("DOMContentLoaded", mostrarVoluntariados);

