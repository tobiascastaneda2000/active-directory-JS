// ============================================================
// ui.js: todo lo que DIBUJA en pantalla. No decide reglas.
// ============================================================

// Tipos que se muestran en el árbol (solo los que contienen cosas)
const TIPOS_ARBOL = ["domain", "container", "ou"];

// Ícono de cada tipo de objeto
const ICONOS_POR_TIPO = {
  domain: "📁",
  container: "📦",
  ou: "🗂️",
  user: "👤",
  group: "👥",
  computer: "💻",
};

// Nombre legible de cada tipo, para la columna "Tipo" y el detalle
const NOMBRES_DE_TIPO = {
  domain: "Dominio",
  container: "Container",
  ou: "Unidad organizativa",
  user: "Usuario",
  group: "Grupo",
  computer: "Equipo",
};

// ---------- HELPERS ----------

// <td> con texto
function crearCelda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

// <td> con un botón adentro: permite elegir la fila con el teclado (Tab y Enter)
function crearCeldaBoton(texto) {
  const td = document.createElement("td");
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "enlace-fila";
  boton.textContent = texto;
  td.appendChild(boton);
  return td;
}

// <thead> con una fila de títulos de columna
function crearEncabezado(columnas) {
  const fila = document.createElement("tr");
  columnas.forEach((texto) => {
    const th = document.createElement("th");
    th.scope = "col"; // accesibilidad: "esta celda es título de columna"
    th.textContent = texto;
    fila.appendChild(th);
  });

  const thead = document.createElement("thead");
  thead.appendChild(fila);
  return thead;
}

// Resalta una fila y le saca el resaltado a la anterior
function marcarFila(tbody, fila) {
  tbody.querySelector(".fila-seleccionada")?.classList.remove("fila-seleccionada");
  fila.classList.add("fila-seleccionada");
}

// Una <option> por carpeta: value guarda el id y el texto muestra la ruta
function crearOpcionesCarpetas(carpetas) {
  return carpetas.map(({ id, ruta }) => {
    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = ruta;
    return opcion;
  });
}

// <button> con texto que ejecuta alHacerClic
function crearBoton(texto, alHacerClic) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.addEventListener("click", alHacerClic);
  return boton;
}

// Agrega un par <dt>/<dd> a la lista; devuelve el <dd> para poder sumarle una clase de color
function agregarDato(dl, etiqueta, valor) {
  const dt = document.createElement("dt");
  dt.textContent = etiqueta;
  const dd = document.createElement("dd");
  dd.textContent = valor;
  dl.append(dt, dd);
  return dd;
}

// Convierte una lista de ids en los nombres de esos objetos, separados por coma
function nombresDe(objetos, ids) {
  return ids
    .map((id) => objetos.find((obj) => obj.id === id)?.name)
    .filter(Boolean) // descarta los ids que ya no existen
    .join(", ");
}

// ---------- ÁRBOL (panel izquierdo) ----------

/**
 * Dibuja los hijos de `idPadre` dentro de `contenedor` y se llama a sí misma
 * para dibujar los hijos de cada hijo (recursión). `alSeleccionar` es un callback:
 * ui.js avisa "hicieron clic acá" y quien la llama decide qué hacer.
 */
export function renderizarArbol(objetos, idPadre, contenedor, alSeleccionar) {
  const hijos = objetos.filter(
    (obj) => obj.parentId === idPadre && TIPOS_ARBOL.includes(obj.type)
  );

  // Caso base: sin hijos no hay nada que dibujar
  if (hijos.length === 0) return;

  const ul = document.createElement("ul");

  hijos.forEach((hijo) => {
    const li = document.createElement("li");
    li.dataset.id = hijo.id;

    // Botón nativo: se enfoca con Tab y se activa con Enter
    const boton = document.createElement("button");
    boton.type = "button";
    boton.classList.add("nodo");
    boton.textContent = `${ICONOS_POR_TIPO[hijo.type]} ${hijo.name}`;
    boton.addEventListener("click", () => alSeleccionar(hijo.id));
    li.append(boton);

    // Recursión: dibuja los hijos de este nodo adentro de su <li>
    renderizarArbol(objetos, hijo.id, li, alSeleccionar);

    ul.appendChild(li);
  });

  contenedor.appendChild(ul);
}

// Resalta el nodo con ese id y le saca el resaltado al anterior
export function marcarSeleccionado(arbol, id) {
  arbol.querySelector(".seleccionado")?.classList.remove("seleccionado");
  // Busca el .nodo que es hijo directo del <li> con ese data-id
  arbol.querySelector(`li[data-id="${id}"] > .nodo`)?.classList.add("seleccionado");
}

// ---------- LISTA (panel del medio) ----------

// Muestra todos los hijos de `idPadre` (de cualquier tipo) en una tabla
export function renderizarLista(objetos, idPadre, contenedor, alSeleccionarObjeto) {
  const padre = objetos.find((obj) => obj.id === idPadre);
  const hijos = objetos.filter((obj) => obj.parentId === idPadre);

  const titulo = document.createElement("h2");
  titulo.textContent = padre ? padre.name : "Objetos";

  // Carpeta vacía: mensaje en lugar de una tabla sin filas
  if (hijos.length === 0) {
    const vacio = document.createElement("p");
    vacio.textContent = "Este contenedor no tiene objetos.";
    contenedor.replaceChildren(titulo, vacio);
    return;
  }

  // Una fila por objeto: nombre (con botón para el teclado) y tipo
  const tbody = document.createElement("tbody");
  hijos.forEach((hijo) => {
    const fila = document.createElement("tr");
    fila.dataset.id = hijo.id; // main.js lo usa para resaltar el objeto recién creado o movido
    fila.append(
      crearCeldaBoton(`${ICONOS_POR_TIPO[hijo.type]} ${hijo.name}`),
      crearCelda(NOMBRES_DE_TIPO[hijo.type])
    );

    // Clic (o Enter sobre el botón): resalta la fila y muestra el detalle
    fila.addEventListener("click", () => {
      marcarFila(tbody, fila);
      alSeleccionarObjeto(hijo.id);
    });
    tbody.appendChild(fila);
  });

  const tabla = document.createElement("table");
  tabla.append(crearEncabezado(["Nombre", "Tipo"]), tbody);
  contenedor.replaceChildren(titulo, tabla);
}

// Muestra los resultados de la búsqueda; cada uno llega como { objeto, ubicacion }
export function renderizarResultados(resultados, consulta, contenedor, alSeleccionarObjeto) {
  const titulo = document.createElement("h2");
  titulo.textContent = `Resultados para "${consulta}"`;

  // Sin coincidencias: mensaje en lugar de una tabla vacía
  if (resultados.length === 0) {
    const vacio = document.createElement("p");
    vacio.textContent = "No se encontraron objetos.";
    contenedor.replaceChildren(titulo, vacio);
    return;
  }

  const tbody = document.createElement("tbody");
  resultados.forEach(({ objeto, ubicacion }) => {
    const fila = document.createElement("tr");
    fila.append(
      crearCeldaBoton(`${ICONOS_POR_TIPO[objeto.type]} ${objeto.name}`),
      crearCelda(NOMBRES_DE_TIPO[objeto.type]),
      crearCelda(ubicacion || "—") // el dominio no tiene ubicación
    );

    fila.addEventListener("click", () => {
      marcarFila(tbody, fila);
      alSeleccionarObjeto(objeto.id);
    });
    tbody.appendChild(fila);
  });

  const tabla = document.createElement("table");
  tabla.append(crearEncabezado(["Nombre", "Tipo", "Ubicación"]), tbody);
  contenedor.replaceChildren(titulo, tabla);
}

// ---------- DETALLES (panel derecho) ----------

/**
 * Muestra las propiedades de `objeto` (o un mensaje si es null) y sus acciones.
 * `alAccionar(accion, id)` es un callback: ui.js avisa "pidieron esta acción".
 */
export function renderizarDetalles(objetos, objeto, contenedor, alAccionar) {
  // Sin objeto seleccionado: mensaje por defecto
  if (!objeto) {
    const tituloVacio = document.createElement("h2");
    tituloVacio.textContent = "Detalles";
    const aviso = document.createElement("p");
    aviso.textContent = "Seleccioná un objeto";
    contenedor.replaceChildren(tituloVacio, aviso);
    return;
  }

  const titulo = document.createElement("h2");
  titulo.textContent = objeto.name;
  const dl = document.createElement("dl");
  agregarDato(dl, "Tipo", NOMBRES_DE_TIPO[objeto.type]);

  // Los grupos muestran los nombres de sus miembros
  if (objeto.type === "group") {
    // `||` usa "Ninguno" cuando el texto queda vacío
    agregarDato(dl, "Miembros", nombresDe(objetos, objeto.members ?? []) || "Ninguno");
  }

  // Equipos y grupos solo se pueden mover; dominio, OUs y containers no tienen acciones
  if (objeto.type !== "user") {
    const botonesMover = ["group", "computer"].includes(objeto.type)
      ? [crearBoton("Mover a otra carpeta", () => alAccionar("mover", objeto.id))]
      : [];
    contenedor.replaceChildren(titulo, dl, ...botonesMover);
    return;
  }

  // Datos de la cuenta; el <dd> devuelto recibe color verde o rojo
  agregarDato(dl, "Nombre de inicio de sesión", objeto.sam);
  agregarDato(dl, "Cuenta", objeto.enabled ? "Habilitada" : "Deshabilitada")
    .classList.add(objeto.enabled ? "estado-ok" : "estado-alerta");
  agregarDato(dl, "Bloqueo", objeto.locked ? "Bloqueada" : "No bloqueada")
    .classList.add(objeto.locked ? "estado-alerta" : "estado-ok");
  agregarDato(dl, "Contraseña cambiada", objeto.passwordLastSet);
  agregarDato(dl, "Debe cambiar contraseña", objeto.mustChangePassword ? "Sí" : "No");
  agregarDato(dl, "Miembro de", nombresDe(objetos, objeto.memberOf ?? []) || "Ninguno");

  // Acciones fijas, y después las que dependen del estado de la cuenta
  const botones = [
    crearBoton("Restablecer contraseña", () => alAccionar("resetear", objeto.id)),
    crearBoton("Administrar grupos", () => alAccionar("grupos", objeto.id)),
    crearBoton("Mover a otra carpeta", () => alAccionar("mover", objeto.id)),
  ];

  if (objeto.enabled) {
    botones.push(crearBoton("Deshabilitar cuenta", () => alAccionar("deshabilitar", objeto.id)));
  } else {
    botones.push(crearBoton("Habilitar cuenta", () => alAccionar("habilitar", objeto.id)));
  }

  if (objeto.locked) {
    botones.push(crearBoton("Desbloquear cuenta", () => alAccionar("desbloquear", objeto.id)));
  }

  contenedor.replaceChildren(titulo, dl, ...botones);
}

// ---------- MODAL: restablecer contraseña ----------
const modalContrasena = document.querySelector("#modal-contrasena");
const formularioContrasena = document.querySelector("#form-contrasena");
const textoUsuarioContrasena = document.querySelector("#modal-usuario");
const textoErrorContrasena = document.querySelector("#error-contrasena");

// Abre el modal con el formulario limpio y el nombre del usuario
export function abrirModalContrasena(usuario) {
  formularioContrasena.reset(); // vacía los campos y restaura las casillas iniciales
  textoErrorContrasena.textContent = "";
  textoUsuarioContrasena.textContent = `Usuario: ${usuario.name} (${usuario.sam})`;
  modalContrasena.showModal(); // fondo oscurecido y foco atrapado dentro del modal
}

export function cerrarModalContrasena() {
  modalContrasena.close();
}

export function mostrarErrorContrasena(mensaje) {
  textoErrorContrasena.textContent = mensaje;
}

// Conecta el envío del formulario y el botón Cancelar
export function iniciarModalContrasena(alEnviar) {
  formularioContrasena.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue
    alEnviar({
      contrasena: document.querySelector("#contrasena-nueva").value,
      confirmacion: document.querySelector("#contrasena-confirmar").value,
      debeCambiar: document.querySelector("#debe-cambiar").checked,
      desbloquear: document.querySelector("#desbloquear").checked,
    });
  });

  document
    .querySelector("#cancelar-contrasena")
    .addEventListener("click", cerrarModalContrasena);
}

// ---------- MODAL: nuevo usuario ----------
const modalNuevoUsuario = document.querySelector("#modal-nuevo-usuario");
const formularioNuevoUsuario = document.querySelector("#form-nuevo-usuario");
const selectorCarpeta = document.querySelector("#nuevo-carpeta");
const textoErrorNuevoUsuario = document.querySelector("#error-nuevo-usuario");

// Abre el modal con las carpetas disponibles y una preseleccionada
export function abrirModalNuevoUsuario(carpetas, idPreseleccionada) {
  formularioNuevoUsuario.reset();
  textoErrorNuevoUsuario.textContent = "";
  selectorCarpeta.replaceChildren(...crearOpcionesCarpetas(carpetas));

  // Si la carpeta actual no está en la lista (por ejemplo el dominio), queda la primera
  selectorCarpeta.value = idPreseleccionada;
  if (selectorCarpeta.value === "") selectorCarpeta.selectedIndex = 0;

  modalNuevoUsuario.showModal();
}

export function cerrarModalNuevoUsuario() {
  modalNuevoUsuario.close();
}

export function mostrarErrorNuevoUsuario(mensaje) {
  textoErrorNuevoUsuario.textContent = mensaje;
}

// Conecta el envío del formulario y el botón Cancelar
export function iniciarModalNuevoUsuario(alEnviar) {
  formularioNuevoUsuario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alEnviar({
      // select.value siempre es texto: Number() lo pasa a número para comparar con los ids
      idCarpeta: Number(selectorCarpeta.value),
      nombre: document.querySelector("#nuevo-nombre").value,
      sam: document.querySelector("#nuevo-sam").value,
      contrasena: document.querySelector("#nuevo-contrasena").value,
      confirmacion: document.querySelector("#nuevo-confirmar").value,
      debeCambiar: document.querySelector("#nuevo-debe-cambiar").checked,
      deshabilitada: document.querySelector("#nuevo-deshabilitada").checked,
    });
  });

  document
    .querySelector("#cancelar-nuevo-usuario")
    .addEventListener("click", cerrarModalNuevoUsuario);
}

// ---------- MODAL: administrar grupos ----------
const modalGrupos = document.querySelector("#modal-grupos");
const formularioGrupos = document.querySelector("#form-grupos");
const textoUsuarioGrupos = document.querySelector("#grupos-usuario");
const contenedorGrupos = document.querySelector("#lista-grupos");

// Abre el modal con una casilla por grupo, marcada si el usuario ya es miembro
export function abrirModalGrupos(usuario, grupos) {
  textoUsuarioGrupos.textContent = `Usuario: ${usuario.name} (${usuario.sam})`;

  // Sin grupos en el dominio: solo un aviso
  if (grupos.length === 0) {
    const vacio = document.createElement("p");
    vacio.textContent = "No hay grupos en el dominio.";
    contenedorGrupos.replaceChildren(vacio);
  } else {
    const filas = grupos.map((grupo) => {
      const etiqueta = document.createElement("label");
      etiqueta.className = "opcion";

      const casilla = document.createElement("input");
      casilla.type = "checkbox";
      casilla.value = grupo.id;
      casilla.checked = (usuario.memberOf ?? []).includes(grupo.id);

      etiqueta.append(casilla, grupo.name); // append acepta elementos y texto
      return etiqueta;
    });
    contenedorGrupos.replaceChildren(...filas);
  }

  modalGrupos.showModal();
}

export function cerrarModalGrupos() {
  modalGrupos.close();
}

// Conecta el envío del formulario y el botón Cancelar
export function iniciarModalGrupos(alEnviar) {
  formularioGrupos.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Solo las casillas marcadas; [...] pasa la lista a array y Number() convierte el value a número
    const marcados = [...contenedorGrupos.querySelectorAll("input:checked")].map((casilla) =>
      Number(casilla.value)
    );
    alEnviar(marcados);
  });

  document.querySelector("#cancelar-grupos").addEventListener("click", cerrarModalGrupos);
}

// ---------- MODAL: mover objeto ----------
const modalMover = document.querySelector("#modal-mover");
const formularioMover = document.querySelector("#form-mover");
const textoObjetoMover = document.querySelector("#mover-objeto");
const selectorDestino = document.querySelector("#mover-destino");
const textoErrorMover = document.querySelector("#error-mover");

// Abre el modal con las carpetas posibles como opciones del desplegable
export function abrirModalMover(objeto, carpetas) {
  textoErrorMover.textContent = "";
  textoObjetoMover.textContent = `Objeto: ${objeto.name}`;
  selectorDestino.replaceChildren(...crearOpcionesCarpetas(carpetas));
  modalMover.showModal();
}

export function cerrarModalMover() {
  modalMover.close();
}

export function mostrarErrorMover(mensaje) {
  textoErrorMover.textContent = mensaje;
}

// Conecta el envío del formulario y el botón Cancelar
export function iniciarModalMover(alEnviar) {
  formularioMover.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alEnviar(Number(selectorDestino.value)); // el value del select es texto
  });

  document.querySelector("#cancelar-mover").addEventListener("click", cerrarModalMover);
}