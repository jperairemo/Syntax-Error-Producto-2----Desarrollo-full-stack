// modelo/almacenaje.js

// IndexedDB config pàra voluntariados
// --------------------------- Usuarios (WebStorage) ---------------------------

// -----------------------------------------
// Configuración para usuarios (WebStorage)
// -----------------------------------------

// Claves utilizadas en localStorage
const USUARIOS_KEY = "usuarios";             // Clave para almacenar todos los usuarios
const USUARIO_ACTIVO_KEY = "usuarioActivo";  // Clave para saber quién ha iniciado sesión

// Guardar un usuario en localStorage
// Devuelve `true` si el usuario se guarda correctamente.
// Devuelve `false` si el correo ya está registrado.
export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();

  // Comprobamos si ya existe un usuario con ese correo
  const correoYaExiste = usuarios.some(function (u) {
    return u.correo == usuario.correo;
  });

  if (correoYaExiste) {
    return false; // No se puede guardar porque ya existe
  }

  usuarios.push(usuario); // Añadimos el nuevo usuario
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios)); // Guardamos en formato JSON
  return true;
}

// Obtener todos los usuarios
// Devuelve un array con los usuarios existentes, o un array vacío si no hay ninguno.
export function obtenerUsuarios() {
  const almacenaje = localStorage.getItem(USUARIOS_KEY);
  if (almacenaje != null) {
    return JSON.parse(almacenaje); // Convertimos de texto a array de objetos
  } else {
    return []; // Si no hay usuarios guardados
  }
}

// Eliminar un usuario por correo
export function eliminarUsuario(correo) {
  const usuarios = obtenerUsuarios();

  // Filtramos y eliminamos el usuario con ese correo
  const usuariosFiltrados = usuarios.filter(function (u) {
    return u.correo != correo;
  });

  // Guardamos el nuevo array en localStorage
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosFiltrados));
}

// Verificar usuario (login)
// Si el correo y la contraseña son correctos, guarda el usuario activo.
export function loguearUsuario(correo, password) {
  const usuarios = obtenerUsuarios();

  // Buscamos el usuario con correo y contraseña coincidente
  const usuario = usuarios.find(function (u) {
    return u.correo == correo && u.password == password;
  });

  if (usuario != null) {
    // Guardamos el correo como "usuario activo"
    localStorage.setItem(USUARIO_ACTIVO_KEY, correo);
    return true;
  } else {
    return false;
  }
}

// Obtener el usuario activo actual
export function obtenerUsuarioActivo() {
  const usuario = localStorage.getItem(USUARIO_ACTIVO_KEY);
  if (usuario != null) {
    return usuario;
  } else {
    return null;
  }
}

// Cerrar la sesión
export function cerrarSesion() {
  localStorage.removeItem(USUARIO_ACTIVO_KEY);
}










// --------------------------------------------------------------
// MODELO DE DATOS: VOLUNTARIADOS (IndexedDB - almacenamiento local)
// --------------------------------------------------------------


// -------------------------------
// CONFIGURACIÓN INICIAL INDEXEDDB
// -------------------------------

const NOMBRE_BD = "voluntariadosDB";        // Nombre de la base de datos
const VERSION_BD = 1;                       // Versión de la base de datos
const NOMBRE_ALMACEN = "voluntariados";     // Nombre del almacén de objetos (store)

let db; // Aquí se guarda la conexión abierta con la base de datos

// -------------------------------
// FUNCIÓN PARA INICIALIZAR INDEXEDDB
// -------------------------------
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(NOMBRE_BD, VERSION_BD);

        // Evento que se ejecuta si la base de datos no existe o es nueva versión
        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Si no existe el almacén de objetos, lo creamos
            if (!db.objectStoreNames.contains(NOMBRE_ALMACEN)) {
                db.createObjectStore(NOMBRE_ALMACEN, { keyPath: "id" }); // Clave primaria: id
            }
        };

        // Si se abre correctamente, guardamos la conexión
        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(true);
        };

        // Si hay un error, lo rechazamos
        request.onerror = function (event) {
            reject("Error al abrir la base de datos: " + event.target.errorCode);
        };
    });
}

// -------------------------------
// FUNCIÓN PARA GUARDAR UN VOLUNTARIADO
// -------------------------------
export function guardarVoluntariado(voluntariado) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([NOMBRE_ALMACEN], "readwrite");
        const store = transaction.objectStore(NOMBRE_ALMACEN);
        const request = store.add(voluntariado);

        request.onsuccess = function () {
            resolve(true); // Éxito al guardar
        };

        request.onerror = function () {
            reject("Error al guardar el voluntariado");
        };
    });
}

// -------------------------------
// FUNCIÓN PARA OBTENER TODOS LOS VOLUNTARIADOS
// -------------------------------
export function obtenerVoluntariados() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([NOMBRE_ALMACEN], "readonly");
        const store = transaction.objectStore(NOMBRE_ALMACEN);
        const request = store.getAll();

        request.onsuccess = function (event) {
            resolve(event.target.result); // Retornamos el array de voluntariados
        };

        request.onerror = function () {
            reject("Error al obtener voluntariados");
        };
    });
}

// -------------------------------
// FUNCIÓN PARA ELIMINAR UN VOLUNTARIADO POR ID
// -------------------------------
export function eliminarVoluntariado(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([NOMBRE_ALMACEN], "readwrite");
        const store = transaction.objectStore(NOMBRE_ALMACEN);
        const request = store.delete(id);

        request.onsuccess = function () {
            resolve(true); // Éxito al eliminar
        };

        request.onerror = function () {
            reject("Error al eliminar voluntariado");
        };
    });
}
