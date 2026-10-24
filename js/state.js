// state.js: reglas y acciones sobre los datos. NO toca el DOM.

// Devuelve el objeto con ese id (o undefined si no existe).
export function buscarPorId(objetos, id) {
    return objetos.find(obj => obj.id === id);
}

// Deshabilita la cuenta de un usuario.
export function deshabilitarUsuario(usuario) {
    if(usuario.type !== "user") {
        return;
    }
    else{
        usuario.enabled = false;
    }
}

// Igual que la anterior, pero deja enabled en true.
export function habilitarUsuario(usuario) {
    if (usuario.type !== "user") {
        return;
        }
        usuario.enabled = true;
}

// Desbloquea la cuenta: la propiedad locked pasa a false.
export function desbloquearUsuario(usuario) {
    if(usuario.type !== "user") {
        return;
    }
    usuario.locked = false;
}

// Valida la política de contraseña; devuelve la lista de errores (vacía = válida)
export function validarContrasena(contrasena, confirmacion, usuario) {
  const errores = [];

  if (contrasena.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!/[A-Z]/.test(contrasena)) errores.push("Debe incluir una mayúscula.");
  if (!/[a-z]/.test(contrasena)) errores.push("Debe incluir una minúscula.");
  if (!/\d/.test(contrasena)) errores.push("Debe incluir un número.");
  // Símbolo = cualquier carácter que no sea letra ni número (la ñ y las tildes cuentan como símbolo)
  if (!/[^A-Za-z0-9]/.test(contrasena)) errores.push("Debe incluir un símbolo.");
  // No puede contener el nombre de usuario, sin distinguir mayúsculas
  if (contrasena.toLowerCase().includes(usuario.sam.toLowerCase())) {
    errores.push("No puede contener el nombre de usuario.");
  }
  if (contrasena !== confirmacion) errores.push("Las contraseñas no coinciden.");

  return errores;
}

// Registra el reseteo; la contraseña NO se guarda (es una simulación)
export function resetearContrasena(usuario, debeCambiar, desbloquear) {
  if (usuario.type !== "user") return;

  // Fecha de hoy como AAAA-MM-DD en hora local ("sv-SE" da ese formato)
  usuario.passwordLastSet = new Date().toLocaleDateString("sv-SE");
  usuario.mustChangePassword = debeCambiar;
  if (desbloquear) usuario.locked = false;
}


// Quita tildes y pasa a minúsculas para comparar sin importar acentos
function normalizar(texto) {
  // NFD separa la letra de su tilde ("é" -> "e" + marca) y \p{M} borra las marcas
  return texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

// Devuelve los objetos cuyo nombre o usuario (sam) contienen el texto buscado
export function buscarObjetos(objetos, consulta) {
  const buscado = normalizar(consulta.trim());
  if (buscado === "") return [];

  return objetos.filter((obj) => {
    // `?? ""` evita buscar "undefined" en los objetos que no tienen sam
    const texto = normalizar(`${obj.name} ${obj.sam ?? ""}`);
    return texto.includes(buscado);
  });
}

// Arma la ubicación de un objeto, por ejemplo "empresa.local / Ventas"
export function obtenerRuta(objetos, objeto) {
  const partes = [];
  let actual = buscarPorId(objetos, objeto.parentId);

  // Sube de padre en padre hasta la raíz; unshift agrega al principio
  while (actual) {
    partes.unshift(actual.name);
    actual = buscarPorId(objetos, actual.parentId);
  }
  return partes.join(" / ");
}