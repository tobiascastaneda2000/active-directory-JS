// tema.js: alterna entre tema claro y oscuro; la primera vez respeta el del sistema
const CLAVE = "ad-simulator:tema";

// Lee el tema guardado (null si no hay o si localStorage no está disponible)
function leerGuardado() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

// El CSS reacciona al atributo data-tema del <html>
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
}

export function iniciarTema(boton) {
  // Sin tema guardado, usa el que prefiere el sistema operativo
  const delSistema = matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro";
  aplicarTema(leerGuardado() ?? delSistema);

  // El botón muestra a qué tema se va a cambiar
  const actualizarTexto = () => {
    boton.textContent = document.documentElement.dataset.tema === "claro" ? "Modo oscuro" : "Modo claro";
  };
  actualizarTexto();

  boton.addEventListener("click", () => {
    const nuevo = document.documentElement.dataset.tema === "claro" ? "oscuro" : "claro";
    aplicarTema(nuevo);
    try {
      localStorage.setItem(CLAVE, nuevo);
    } catch {
      // Sin almacenamiento: el cambio dura hasta recargar
    }
    actualizarTexto();
  });
}