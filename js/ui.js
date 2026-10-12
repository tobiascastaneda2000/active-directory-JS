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

export function renderizarLista(objetos, idPadre, contenedor) {

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
    tbody.appendChild(fila);
  });

  // PASO G: armar la tabla y mostrar.
  //   Crear <table>, meterle thead y tbody (.append acepta varios argumentos),
  //   y reemplazar el contenido del panel con título + tabla (replaceChildren).
  //   TU CÓDIGO:

  let tabla = document.createElement("table");
  tabla.append(thead, tbody);
  contenedor.replaceChildren(titulo, tabla);
}