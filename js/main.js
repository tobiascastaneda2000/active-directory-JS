// main.js: arranca la app y conecta datos, reglas (state.js) y dibujo (ui.js)
import { objectos as datosIniciales } from "./data.js";
import { cargarObjetos, guardarObjetos, borrarGuardado } from "./storage.js";
import {
  buscarPorId,
  buscarObjetos,
  obtenerRuta,
  listarCarpetas,
  listarGrupos,
  deshabilitarUsuario,
  habilitarUsuario,
  desbloquearUsuario,
  validarContrasena,
  resetearContrasena,
  validarNuevoUsuario,
  crearUsuario,
  establecerGrupos,
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
  abrirModalNuevoUsuario,
  cerrarModalNuevoUsuario,
  mostrarErrorNuevoUsuario,
  iniciarModalNuevoUsuario,
  abrirModalGrupos,
  cerrarModalGrupos,
  iniciarModalGrupos,
} from "./ui.js";

// Datos de trabajo: los guardados en el navegador o, si no hay, los iniciales
const objectos = cargarObjetos(datosIniciales);

// Los tres paneles, el buscador y los botones del header
const arbol = document.querySelector("#arbol");
const lista = document.querySelector("#lista");
const detalles = document.querySelector("#detalles");
const buscador = document.querySelector("#buscador");
const botonNuevoUsuario = document.querySelector("#nuevo-usuario");
const botonRestablecer = document.querySelector("#restablecer-datos");

// La raíz es el único objeto sin padre (el dominio)
const raiz = objectos.find((obj) => obj.parentId === null);

// Usuarios con un modal abierto (let porque se reasignan)
let usuarioEnModal = null;
let usuarioEnGrupos = null;
// Última carpeta elegida, para volver a ella al borrar la búsqueda
let carpetaActual = raiz.id;

// Clic en una carpeta: la resalta, llena la tabla y vacía el panel derecho
function alSeleccionarCarpeta(id) {
  carpetaActual = id;
  buscador.value = ""; // al navegar el árbol se limpia la búsqueda
  marcarSeleccionado(arbol, id);
  renderizarLista(objectos, id, lista, alSeleccionarObjeto);
  renderizarDetalles(objectos, null, detalles, alAccionar);
}

// Clic en una fila de la tabla: muestra las propiedades de ese objeto
function alSeleccionarObjeto(id) {
  const objeto = buscarPorId(objectos, id);
  renderizarDetalles(objectos, objeto, detalles, alAccionar);
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
  const resultados = buscarObjetos(objectos, consulta).map((obj) => ({
    objeto: obj,
    ubicacion: obtenerRuta(objectos, obj),
  }));

  renderizarResultados(resultados, consulta, lista, alSeleccionarObjeto);
  renderizarDetalles(objectos, null, detalles, alAccionar);
}

// Clic en un botón del panel: aplica la acción, guarda y redibuja el panel derecho
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
    case "grupos":
      // Abre el modal con todos los grupos del dominio
      usuarioEnGrupos = usuario;
      abrirModalGrupos(usuario, listarGrupos(objectos));
      break;
  }

  guardarObjetos(objectos); // persiste cualquier cambio en el navegador
  renderizarDetalles(objectos, usuario, detalles, alAccionar);
}

// Se ejecuta al enviar el formulario de restablecer contraseña
function alEnviarContrasena(datos) {
  const errores = validarContrasena(datos.contrasena, datos.confirmacion, usuarioEnModal);

  // Con errores: los muestra en rojo y deja el modal abierto
  if (errores.length > 0) {
    mostrarErrorContrasena(errores.join(" "));
    return;
  }

  // Sin errores: aplica el reseteo, lo guarda, cierra el modal y actualiza el panel
  resetearContrasena(usuarioEnModal, datos.debeCambiar, datos.desbloquear);
  guardarObjetos(objectos);
  cerrarModalContrasena();
  renderizarDetalles(objectos, usuarioEnModal, detalles, alAccionar);
}

// Se ejecuta al guardar el modal de grupos; recibe los ids de los grupos marcados
function alEnviarGrupos(idsGrupos) {
  establecerGrupos(objectos, usuarioEnGrupos, idsGrupos);
  guardarObjetos(objectos);
  cerrarModalGrupos();
  renderizarDetalles(objectos, usuarioEnGrupos, detalles, alAccionar);
}

// Clic en "Nuevo usuario": abre el modal con la carpeta actual preseleccionada
function alAbrirNuevoUsuario() {
  abrirModalNuevoUsuario(listarCarpetas(objectos), carpetaActual);
}

// Se ejecuta al enviar el formulario de nuevo usuario
function alEnviarNuevoUsuario(datos) {
  const errores = validarNuevoUsuario(objectos, datos);

  // Con errores: los muestra y deja el modal abierto
  if (errores.length > 0) {
    mostrarErrorNuevoUsuario(errores.join(" "));
    return;
  }

  // Crea el usuario, lo guarda y cierra el modal
  const nuevo = crearUsuario(objectos, datos);
  guardarObjetos(objectos);
  cerrarModalNuevoUsuario();

  // Muestra su carpeta, resalta la fila del usuario nuevo y abre su detalle
  alSeleccionarCarpeta(nuevo.parentId);
  lista.querySelector(`tr[data-id="${nuevo.id}"]`)?.classList.add("fila-seleccionada");
  alSeleccionarObjeto(nuevo.id);
}

// Borra lo guardado y recarga la página con los datos iniciales
function alRestablecerDatos() {
  // confirm() alcanza para una demo; en una app real sería un modal propio
  if (!confirm("¿Restablecer los datos de ejemplo? Se pierden los cambios hechos.")) return;
  borrarGuardado();
  location.reload();
}

// Arranque: dibuja el árbol (parentId null = empieza por la raíz)...
renderizarArbol(objectos, raiz.parentId, arbol, alSeleccionarCarpeta);
// ...conecta modales, buscador y botones...
iniciarModalContrasena(alEnviarContrasena);
iniciarModalNuevoUsuario(alEnviarNuevoUsuario);
iniciarModalGrupos(alEnviarGrupos);
buscador.addEventListener("input", alBuscar);
botonNuevoUsuario.addEventListener("click", alAbrirNuevoUsuario);
botonRestablecer.addEventListener("click", alRestablecerDatos);
// ...y deja el dominio seleccionado al abrir la página
alSeleccionarCarpeta(raiz.id);