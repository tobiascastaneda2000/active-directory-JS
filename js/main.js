// main.js: arranca la app y conecta datos, reglas (state.js) y dibujo (ui.js)
import { objectos } from "./data.js";
import {
  buscarPorId,
  deshabilitarUsuario,
  habilitarUsuario,
  desbloquearUsuario,
  validarContrasena,
  resetearContrasena,
} from "./state.js";
import {
  renderizarArbol,
  marcarSeleccionado,
  renderizarLista,
  renderizarDetalles,
  abrirModalContrasena,
  cerrarModalContrasena,
  mostrarErrorContrasena,
  iniciarModalContrasena,
} from "./ui.js";

// Los tres paneles de la pantalla
const arbol = document.querySelector("#arbol");
const lista = document.querySelector("#lista");
const detalles = document.querySelector("#detalles");

// La raíz es el único objeto sin padre (el dominio)
const raiz = objectos.find((obj) => obj.parentId === null);

// Usuario al que se le está cambiando la contraseña (let porque se reasigna)
let usuarioEnModal = null;

// Clic en una carpeta: la resalta, llena la tabla y vacía el panel derecho
function alSeleccionarCarpeta(id) {
  marcarSeleccionado(arbol, id);
  renderizarLista(objectos, id, lista, alSeleccionarObjeto);
  renderizarDetalles(objectos, null, detalles, alAccionar);
}

// Clic en una fila de la tabla: muestra las propiedades de ese objeto
function alSeleccionarObjeto(id) {
  const objeto = buscarPorId(objectos, id);
  renderizarDetalles(objectos, objeto, detalles, alAccionar);
}

// Clic en un botón del panel: aplica la acción y redibuja el panel derecho
function alAccionar(accion, id) {
  const usuario = buscarPorId(objectos, id);

  switch (accion) {
    case "deshabilitar":
      deshabilitarUsuario(usuario);
      break;
    case "habilitar":
      habilitarUsuario(usuario);
      break;
    case "desbloquear":
      desbloquearUsuario(usuario);
      break;
    case "resetear":
      // No cambia datos todavía: guarda el usuario y abre el modal
      usuarioEnModal = usuario;
      abrirModalContrasena(usuario);
      break;
  }

  renderizarDetalles(objectos, usuario, detalles, alAccionar);
}

// Se ejecuta al enviar el formulario del modal
function alEnviarContrasena(datos) {
  const errores = validarContrasena(datos.contrasena, datos.confirmacion, usuarioEnModal);

  // Con errores: los muestra en rojo y deja el modal abierto
  if (errores.length > 0) {
    mostrarErrorContrasena(errores.join(" "));
    return;
  }

  // Sin errores: aplica el reseteo, cierra el modal y actualiza el panel
  resetearContrasena(usuarioEnModal, datos.debeCambiar, datos.desbloquear);
  cerrarModalContrasena();
  renderizarDetalles(objectos, usuarioEnModal, detalles, alAccionar);
}

// Arranque: dibuja el árbol (parentId null = empieza por la raíz)...
renderizarArbol(objectos, raiz.parentId, arbol, alSeleccionarCarpeta);
// ...conecta el modal...
iniciarModalContrasena(alEnviarContrasena);
// ...y deja el dominio seleccionado al abrir la página
alSeleccionarCarpeta(raiz.id);