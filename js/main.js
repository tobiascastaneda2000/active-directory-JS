// main.js: arranca la app y conecta datos, reglas (state.js) y dibujo (ui.js)
import { objectos } from "./data.js";
import {
  buscarPorId,
  deshabilitarUsuario,
  habilitarUsuario,
  desbloquearUsuario,
} from "./state.js";
import {
  renderizarArbol,
  marcarSeleccionado,
  renderizarLista,
  renderizarDetalles,
} from "./ui.js";

// Los tres paneles de la pantalla
const arbol = document.querySelector("#arbol");
const lista = document.querySelector("#lista");
const detalles = document.querySelector("#detalles");

// La raíz es el único objeto sin padre (el dominio)
const raiz = objectos.find((obj) => obj.parentId === null);

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

  // Cada acción llama a su función de state.js
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
  }

  // La tabla del medio no muestra el estado, solo se redibuja el detalle
  renderizarDetalles(objectos, usuario, detalles, alAccionar);
}

// Arranque: dibuja el árbol (parentId null = empieza por la raíz)...
renderizarArbol(objectos, raiz.parentId, arbol, alSeleccionarCarpeta);
// ...y deja el dominio seleccionado al abrir la página
alSeleccionarCarpeta(raiz.id);