// ============================================================
// ui.js: todo lo que DIBUJA en pantalla. No decide reglas.
// ============================================================

// Tipos que se muestran en el ÁRBOL (solo los que contienen cosas)
const TIPOS_ARBOL = ["domain", "container", "ou"];

// Ícono por tipo. Ahora incluye también los objetos, para el panel del medio
const ICONOS_POR_TIPO = {
  domain: "📁",
  container: "📦",
  ou: "🗂️",
  user: "👤",
  group: "👥",
  computer: "💻",
};

// Nombre legible del tipo, para la columna "Tipo" de la lista
const NOMBRES_DE_TIPO = {
  domain: "Dominio",
  container: "Container",
  ou: "Unidad organizativa",
  user: "Usuario",
  group: "Grupo",
  computer: "Equipo",
};

// ---------- ÁRBOL (panel izquierdo) ----------

/**
 * Dibuja los hijos de `idPadre` dentro de `contenedor`, y se llama
 * a sí misma para dibujar los hijos de cada hijo (recursión).
 * `alSeleccionar` es un callback: ui.js avisa "hicieron clic acá"
 * y quien la llame decide qué hacer.
 */

export function renderizarArbol(objetos, idPadre, contenedor, alSeleccionar) {
    const hijos = objetos.filter(ob => ob.parentId === idPadre 
        && TIPOS_ARBOL.includes(ob.type)
    );

    if(hijos.length === 0) return; // No hay nada que dibujar

    const ul = document.createElement("ul");
    
    
    hijos.forEach(hijo => {

        const li = document.createElement("li");

        li.dataset.id = hijo.id; // Guardar el id en data-id

        const fila = document.createElement("span");

        fila.classList.add("nodo");
        
        fila.textContent = `${ICONOS_POR_TIPO[hijo.type]} ${hijo.name}`;
        
        //“el callback es una arrow function que llama a alSeleccionar”. Falta esa arrow function.
        fila.addEventListener("click", () => alSeleccionar(hijo.id));
        
        li.append(fila);
        renderizarArbol(objetos, hijo.id, li, alSeleccionar);
        ul.appendChild(li);
    });
    
    contenedor.appendChild(ul);

}


export function marcarSeleccionado(arbol, id) {
  // PASO A: sacar la clase "seleccionado" del nodo que la tenga ahora.
  //   Buscarlo: arbol.querySelector(".seleccionado")
  //   Ojo: la primera vez NO hay ninguno y querySelector devuelve null.
  //   Para no romperse: encadená con ?.  (optional chaining, tema nuevo)
  //   Sacar clase: .classList.remove("...")
  //   TU CÓDIGO:
  arbol.querySelector(".seleccionado")?.classList.remove("seleccionado");


  // PASO B: ponerle la clase "seleccionado" al .nodo del li con ese id.
  //   El selector CSS que necesitás: el elemento .nodo que es hijo directo
  //   de un li cuyo data-id sea el id recibido.
  //   Sintaxis: li[data-id="..."] > .nodo   (el id va con template string)
  //   También con ?.  y  .classList.add("...")
  //   TU CÓDIGO:

  arbol.querySelector(`li[data-id="${id}"] > .nodo`)?.classList.add("seleccionado");
}

function crearCelda(texto) {
  // Devuelve un <td> con ese texto adentro.
  //   Funciones: createElement("td"), textContent, return
  //   TU CÓDIGO:
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}



export function renderizarLista(objetos, idPadre, contenedor,alSeleccionarObjeto) {

  let objetoPadre = objetos.find(obj => obj.id === idPadre); 

  let hijosDelPadre = objetos.filter(obj => obj.parentId === idPadre);

  const titulo = document.createElement("h2");
  titulo.textContent = objetoPadre ? objetoPadre.name : "Objetos";

  // PASO D: caso especial, carpeta sin hijos.
  //   Si no hay hijos: crear un <p> con el texto "Este contenedor no tiene objetos.",
  //   mostrar título + párrafo en el contenedor y cortar la función (return).
  //   Mostrar: contenedor.replaceChildren(a, b)  (limpia el panel y pone esos elementos)
  //   TU CÓDIGO:

  if(hijosDelPadre.length === 0) {
      let parrafoSinHijos = document.createElement("p");
      parrafoSinHijos.textContent = "Este contenedor no tiene objetos.";
      contenedor.replaceChildren(titulo, parrafoSinHijos);
      return
    }

  // PASO E: encabezado de la tabla.
  //   Crear un <tr>. Por cada texto de ["Nombre", "Tipo"] (forEach):
  //     crear un <th>, ponerle th.scope = "col", su textContent, y agregarlo al <tr>.
  //   Después crear un <thead> y meterle el <tr>.
  //   TU CÓDIGO:
        const filaEncabezado  = document.createElement("tr");
        ["Nombre", "Tipo"].forEach(texto => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = texto;
            filaEncabezado.appendChild(th);
        });

        const thead = document.createElement("thead");
        thead.appendChild(filaEncabezado );
  

  // PASO F: cuerpo de la tabla.
  //   Crear un <tbody>. Por cada hijo (forEach):
  //     crear un <tr>
  //     agregarle DOS celdas con crearCelda(...):
  //        1. ícono + nombre   (igual que en el árbol)
  //        2. NOMBRES_DE_TIPO[hijo.type]
  //     agregar el <tr> al <tbody>
  //   TU CÓDIGO:

  let tbody = document.createElement("tbody");
  hijosDelPadre.forEach(hijo => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(`${ICONOS_POR_TIPO[hijo.type]} ${hijo.name}`));
    fila.appendChild(crearCelda(NOMBRES_DE_TIPO[hijo.type]));
    

    // Hacer la fila clickeable:
    //   1. Guardar el id en la fila (dataset), igual que en el árbol.
    //   2. addEventListener("click", ...) con una arrow function que:
    //        a. le saque la clase "fila-seleccionada" a la fila que la tenga
    //           (buscala dentro de tbody con querySelector y ?., como en marcarSeleccionado)
    //        b. se la ponga a ESTA fila (classList.add)
    //        c. llame a alSeleccionarObjeto(hijo.id)
    //   Ojo: el orden importa. Esto va ANTES de tbody.appendChild(fila)? ¿o da igual? Probalo.
    //   TU CÓDIGO:
    fila.dataset.id = hijo.id;
    fila.addEventListener("click", () => {
        tbody.querySelector(".fila-seleccionada")?.classList.remove("fila-seleccionada");
        fila.classList.add("fila-seleccionada");
        alSeleccionarObjeto(hijo.id);
    });

    tbody.appendChild(fila);
  });

  // PASO G: armar la tabla y mostrar.
  //   Crear <table>, meterle thead y tbody (.append acepta varios argumentos),
  //   y reemplazar el contenido del panel con título + tabla (replaceChildren).

  let tabla = document.createElement("table");
  tabla.append(thead, tbody);
  contenedor.replaceChildren(titulo, tabla);
}

// ---------- DETALLES (panel derecho) ----------

// Agrega al <dl> un par etiqueta/valor:  <dt>etiqueta</dt><dd>valor</dd>
//   (dl = lista de definiciones, dt = término, dd = descripción. Tags nuevos.)
//   Devolver el <dd>, así quien llame puede ponerle una clase de color si quiere.
//   TU CÓDIGO:
function agregarDato(dl, etiqueta, valor) {
  dl.appendChild(document.createElement("dt")).textContent = etiqueta;
  dl.appendChild(document.createElement("dd")).textContent = valor;
  return dl.lastChild;
}

// Crea un <button> con ese texto, type="button", que ejecuta alHacerClic al hacerle clic.
//   TU CÓDIGO:
function crearBoton(texto, alHacerClic) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.addEventListener("click", alHacerClic);
  return boton;
}

/**
 * Muestra las propiedades de `objeto` (o un mensaje si es null) en `contenedor`.
 * `alAccionar(accion, id)` es un callback: ui.js avisa "pidieron esta acción".
 */
export function renderizarDetalles(objetos, objeto, contenedor, alAccionar) {
  // Sin objeto: muestra "Detalles / Seleccioná un objeto" y termina
  if (!objeto) {
    const mensajeDetalles = document.createElement("h2");
    mensajeDetalles.textContent = "Detalles";
    const mensajeSeleccionarObjeto = document.createElement("p");
    mensajeSeleccionarObjeto.textContent = "Seleccioná un objeto";
    contenedor.replaceChildren(mensajeDetalles, mensajeSeleccionarObjeto);
    return;
  }

  // Título con el nombre del objeto y la lista de propiedades vacía
  const titulo = document.createElement("h2");
  titulo.textContent = objeto.name;
  const dl = document.createElement("dl");
  agregarDato(dl, "Tipo", NOMBRES_DE_TIPO[objeto.type]);

  // Si no es usuario (OU, equipo, grupo) solo se ve el tipo, sin botones
  if (objeto.type !== "user") {
    contenedor.replaceChildren(titulo, dl);
    return;
  }

  // Datos de la cuenta; el <dd> que devuelve agregarDato recibe verde o rojo
  agregarDato(dl, "Nombre de inicio de sesión", objeto.sam);
  agregarDato(dl, "Cuenta", objeto.enabled ? "Habilitada" : "Deshabilitada")
    .classList.add(objeto.enabled ? "estado-ok" : "estado-alerta");
  agregarDato(dl, "Bloqueo", objeto.locked ? "Bloqueada" : "No bloqueada")
    .classList.add(objeto.locked ? "estado-alerta" : "estado-ok");
  agregarDato(dl, "Contraseña cambiada", objeto.passwordLastSet);
  agregarDato(dl, "Debe cambiar contraseña", objeto.mustChangePassword ? "Sí" : "No");

  // `??` usa [] solo si memberOf es null o undefined
  const idsGrupos = objeto.memberOf ?? [];

  if (idsGrupos.length === 0) {
    agregarDato(dl, "Miembro de", "Ninguno");
  } else {
    // Convierte cada id de grupo en su nombre y descarta los que no existan
    const nombres = idsGrupos
      .map((id) => objetos.find((o) => o.id === id)?.name)
      .filter(Boolean);
    agregarDato(dl, "Miembro de", nombres.join(", "));
  }

  // Los botones dependen del estado actual de la cuenta
  const botones = [];

    // Siempre disponible para un usuario: abre el modal de reset
  botones.push(crearBoton("Restablecer contraseña", () => alAccionar("resetear", objeto.id)));

  if (objeto.enabled) {
    botones.push(crearBoton("Deshabilitar cuenta", () => alAccionar("deshabilitar", objeto.id)));
  } else {
    botones.push(crearBoton("Habilitar cuenta", () => alAccionar("habilitar", objeto.id)));
  }

  if (objeto.locked) {
    botones.push(crearBoton("Desbloquear cuenta", () => alAccionar("desbloquear", objeto.id)));
  }

  // Dibuja título, propiedades y botones en el panel derecho
  contenedor.replaceChildren(titulo, dl, ...botones);
}

// ---------- MODAL: restablecer contraseña ----------
const modal = document.querySelector("#modal-contrasena");
const formulario = document.querySelector("#form-contrasena");
const textoUsuario = document.querySelector("#modal-usuario");
const textoError = document.querySelector("#error-contrasena");

// Abre el modal con el formulario limpio y el nombre del usuario
export function abrirModalContrasena(usuario) {
  formulario.reset(); // vacía los campos y restaura las casillas iniciales
  textoError.textContent = "";
  textoUsuario.textContent = `Usuario: ${usuario.name} (${usuario.sam})`;
  modal.showModal(); // abre el modal con fondo oscurecido y foco atrapado
}

export function cerrarModalContrasena() {
  modal.close();
}

export function mostrarErrorContrasena(mensaje) {
  textoError.textContent = mensaje;
}

// Conecta el envío del formulario y el botón Cancelar
export function iniciarModalContrasena(alEnviar) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue al enviar
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

// ---------- RESULTADOS DE BÚSQUEDA (panel del medio) ----------

// Cada resultado llega como { objeto, ubicacion }; se dibuja una tabla de 3 columnas
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

  // Encabezado de la tabla
  const encabezado = document.createElement("tr");
  ["Nombre", "Tipo", "Ubicación"].forEach((texto) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = texto;
    encabezado.appendChild(th);
  });
  const thead = document.createElement("thead");
  thead.appendChild(encabezado);

  // Una fila por resultado; ({ objeto, ubicacion }) saca esas dos propiedades del parámetro
  const tbody = document.createElement("tbody");
  resultados.forEach(({ objeto, ubicacion }) => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(`${ICONOS_POR_TIPO[objeto.type]} ${objeto.name}`));
    fila.appendChild(crearCelda(NOMBRES_DE_TIPO[objeto.type]));
    fila.appendChild(crearCelda(ubicacion || "—")); // el dominio no tiene ubicación

    // Clic: resalta la fila y muestra el detalle
    fila.addEventListener("click", () => {
      tbody.querySelector(".fila-seleccionada")?.classList.remove("fila-seleccionada");
      fila.classList.add("fila-seleccionada");
      alSeleccionarObjeto(objeto.id);
    });
    tbody.appendChild(fila);
  });

  const tabla = document.createElement("table");
  tabla.append(thead, tbody);
  contenedor.replaceChildren(titulo, tabla);
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

  // Una <option> por carpeta: value guarda el id y el texto muestra la ruta
  const opciones = carpetas.map(({ id, ruta }) => {
    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = ruta;
    return opcion;
  });
  selectorCarpeta.replaceChildren(...opciones);

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
    evento.preventDefault(); // evita que la página se recargue
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