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