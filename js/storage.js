// storage.js: guarda y recupera los datos en el navegador (localStorage)
const CLAVE = "ad-simulator:objetos";
// Subir este número cuando cambie la estructura de data.js: descarta lo guardado
const VERSION = 2;

// Devuelve los objetos guardados o, si no hay (o están dañados), los iniciales
export function cargarObjetos(datosIniciales) {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (texto === null) return structuredClone(datosIniciales);

    const guardado = JSON.parse(texto); // convierte el texto guardado en objetos
    if (guardado.version !== VERSION || !Array.isArray(guardado.objetos)) {
      return structuredClone(datosIniciales);
    }
    return guardado.objetos;
  } catch {
    // JSON dañado o localStorage bloqueado: arranca con los datos iniciales
    return structuredClone(datosIniciales);
  }
}

// Guarda todos los objetos como texto JSON
export function guardarObjetos(objetos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ version: VERSION, objetos }));
  } catch {
    // Sin espacio o bloqueado: la app sigue funcionando, solo que sin guardar
    console.warn("No se pudo guardar en localStorage");
  }
}

// Borra lo guardado (vuelve a los datos iniciales en la próxima carga)
export function borrarGuardado() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar si localStorage no está disponible
  }
}