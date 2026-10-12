import { objects } from "./data.js";
import { renderizarArbol, marcarSeleccionado, renderizarLista } from "./ui.js";

console.log(objects);

const arbol = document.querySelector("#arbol");
const lista = document.querySelector("#lista");



const raiz = objects.find(obj => obj.parentId === null);

// Qué pasa cuando el usuario elige un nodo del árbol
function alSeleccionar(id) {
  // 1. Marcar el nodo en el árbol          -> marcarSeleccionado(?, ?)
  addEventListener("click", () => marcarSeleccionado(arbol, id));

  // 2. Mostrar el contenido de ese id      -> renderizarLista(?, ?, ?)
  //    (revisá el orden de los parámetros en ui.js)
  addEventListener("click", () => renderizarLista(objects, id, lista));
}

// Al llamar a renderizarArbol, pasale la función SIN paréntesis: alSeleccionar
renderizarArbol(objects, raiz.parentId, arbol, alSeleccionar);

// Paso F: arrancar con la raíz seleccionada
alSeleccionar(raiz.id);
