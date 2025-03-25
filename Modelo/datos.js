// modelo/datos.js

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
  const datos = localStorage.getItem(USUARIOS_KEY);
  if (datos != null) {
    return JSON.parse(datos); // Convertimos de texto a array de objetos
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

// --------------------------------------------------------------
// FUNCIONALIDADES QUE SE IMPLEMENTARÁN EN ESTE MÓDULO
// --------------------------------------------------------------

// - initDB(): Inicializa la base de datos y crea el almacén si no existe.
// - guardarVoluntariado(): Guarda un nuevo voluntariado.
// - obtenerVoluntariados(): Devuelve todos los voluntariados almacenados.
// - eliminarVoluntariado(): Borra un voluntariado por ID.

// La base de datos se llama: 'voluntariadosDB'
// El almacén de objetos se llama: 'voluntariados'
// La clave primaria será autoincremental y se llamará 'id'

// Este módulo representa la parte **Modelo** del patrón MVC.
// Lo usarán los controladores para acceder y manipular los datos reales
// desde el navegador, con persistencia a través de IndexedDB.
