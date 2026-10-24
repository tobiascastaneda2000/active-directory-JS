// main.js: arranca la app y conecta datos, reglas (state.js) y dibujo (ui.js)
import { objectos as datosIniciales } from "./data.js";
import { cargarObjetos, guardarObjetos, borrarGuardado } from "./storage.js";
import {
  buscarPorId,
  buscarObjetos,
  obtenerRuta,
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
  renderizarResultados,
  renderizarDetalles,
  abrirModalContrasena,
  cerrarModalContrasena,
  mostrarErrorContrasena,
  iniciarModalContrasena,
} from "./ui.js";

// Datos de trabajo: los guardados en el navegador o, si no hay, los iniciales
const o = cargarObjetos(datosIniciales);

// Los tres paneles, el buscador y el botón de restablecer
const arbol = document.querySelector("#arbol");
const lista = document.querySelector("#lista");
const detalles = document.querySelector("#detalles");
const buscador = document.querySelector("#buscador");
const botonRestablecer = document.querySelector("#restablecer-datos");

// La raíz es el único objeto sin padre (el dominio)
const raiz = o.find((obj) => obj.parentId === null);

// Usuario al que se le está cambiando la contraseña (let porque se reasigna)
let usuarioEnModal = null;
// Última carpeta elegida, para volver a ella al borrar la búsqueda
let carpetaActual = raiz.id;

// Clic en una carpeta: la resalta, llena la tabla y vacía el panel derecho
function alSeleccionarCarpeta(id) {
  carpetaActual = id;
  buscador.value = ""; // al navegar el árbol se limpia la búsqueda
  marcarSeleccionado(arbol, id);
  renderizarLista(o, id, lista, alSeleccionarObjeto);
  renderizarDetalles(o, null, detalles, alAccionar);
}

// Clic en una fila de la tabla: muestra las propiedades de ese objeto
function alSeleccionarObjeto(id) {
  const objeto = buscarPorId(o, id);
  renderizarDetalles(o, objeto, detalles, alAccionar);
}

// Cada vez que se escribe en el buscador (evento "input")
function alBuscar() {
  const consulta = buscador.value.trim();

  // Campo vacío: vuelve a la carpeta que estaba abierta
  if (consulta === "") {
    alSeleccionarCarpeta(carpetaActual);
    return;
  }

  // Cada resultado lleva su ubicación ya calculada para que ui.js solo dibuje
  const resultados = buscarObjetos(o, consulta).map((obj) => ({
    objeto: obj,
    ubicacion: obtenerRuta(o, obj),
  }));

  renderizarResultados(resultados, consulta, lista, alSeleccionarObjeto);
  renderizarDetalles(o, null, detalles, alAccionar);
}

// Clic en un botón del panel: aplica la acción, guarda y redibuja el panel derecho
function alAccionar(accion, id) {
  const usuario = buscarPorId(o, id);

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

  guardarObjetos(o); // persiste cualquier cambio en el navegador
  renderizarDetalles(o, usuario, detalles, alAccionar);
}

// Se ejecuta al enviar el formulario del modal
function alEnviarContrasena(datos) {
  const errores = validarContrasena(datos.contrasena, datos.confirmacion, usuarioEnModal);

  // Con errores: los muestra en rojo y deja el modal abierto
  if (errores.length > 0) {
    mostrarErrorContrasena(errores.join(" "));
    return;
  }

  // Sin errores: aplica el reseteo, lo guarda, cierra el modal y actualiza el panel
  resetearContrasena(usuarioEnModal, datos.debeCambiar, datos.desbloquear);
  guardarObjetos(o);
  cerrarModalContrasena();
  renderizarDetalles(o, usuarioEnModal, detalles, alAccionar);
}

// Borra lo guardado y recarga la página con los datos iniciales
function alRestablecerDatos() {
  // confirm() alcanza para una demo; en una app real sería un modal propio
  if (!confirm("¿Restablecer los datos de ejemplo? Se pierden los cambios hechos.")) return;
  borrarGuardado();
  location.reload();
}

// Arranque: dibuja el árbol (parentId null = empieza por la raíz)...
renderizarArbol(o, raiz.parentId, arbol, alSeleccionarCarpeta);
// ...conecta modal, buscador y botón de restablecer...
iniciarModalContrasena(alEnviarContrasena);
buscador.addEventListener("input", alBuscar);
botonRestablecer.addEventListener("click", alRestablecerDatos);
// ...y deja el dominio seleccionado al abrir la página
alSeleccionarCarpeta(raiz.id);