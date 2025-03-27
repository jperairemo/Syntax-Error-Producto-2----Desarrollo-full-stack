// Archivo que se utilizará para en caso de que haya un usuario logueado, mostrar su correo.

document.addEventListener("DOMContentLoaded", function () {
    let usuarioGuardado = sessionStorage.getItem("usuarioLogueado");

    if (usuarioGuardado) {
        let usuario = JSON.parse(usuarioGuardado);

        // Actualizar menú estándar
        let navUsuario = document.getElementById("navUsuario");
        if (navUsuario) {
            navUsuario.innerHTML = `
                <a href="#">${usuario.correo}</a> 
                <a href="#" id="cerrarSesion">(Cerrar sesión)</a>
            `;
        }

        // Agregar evento para cerrar sesión
        let cerrarSesion = document.getElementById("cerrarSesion");
        if (cerrarSesion) {
            cerrarSesion.addEventListener("click", function () {
                sessionStorage.removeItem("usuarioLogueado");
                window.location.href = "inicioSesion.html"; // Redirigir al login
            });
        }

        // Actualizar menú en usuarios.html (ícono de usuario)
        let iconoUsuario = document.querySelector(".icono-usuario");
        if (iconoUsuario) {
            iconoUsuario.innerHTML = `<a href="#">${usuario.correo}</a>`;
        }
        
    }
});
