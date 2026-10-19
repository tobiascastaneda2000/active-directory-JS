export const objectos = [
  { id: 1, type: "domain",    name: "empresa.local", parentId: null },
  { id: 2, type: "container", name: "Users",         parentId: 1 },
  { id: 3, type: "ou",        name: "Ventas",        parentId: 1 },
  { id: 4, type: "ou",        name: "IT",            parentId: 1 },
  {
    id: 5, type: "user", name: "Juan Pérez", parentId: 3,
    sam: "jperez", enabled: true, locked: false,
    mustChangePassword: false, passwordLastSet: "2024-05-10",
    memberOf: [8],
  },
  { id: 6, type: "computer", name: "PC-VENTAS-01", parentId: 3 },
    { id: 8, type: "group",    name: "Ventas-Todos", parentId: 3, members: [5, 14] },

    // Carpetas por defecto de un dominio de AD
  { id: 9,  type: "container", name: "Computers",          parentId: 1 },
  { id: 10, type: "ou",        name: "Domain Controllers", parentId: 1 },

  // Sub-OU dentro de IT: prueba de que la recursión anda en cualquier profundidad
  { id: 11, type: "ou",        name: "Soporte",            parentId: 4 },

  {
    id: 12, type: "user", name: "Ana Gómez", parentId: 4,
    sam: "agomez", enabled: true, locked: false,
    mustChangePassword: false, passwordLastSet: "2024-06-02",
    memberOf: [],
  },
  { id: 13, type: "computer", name: "DC-01", parentId: 10 },

    // Usuario bloqueada: sirve para probar "Desbloquear cuenta"
  {
    id: 14, type: "user", name: "Laura Díaz", parentId: 3,
    sam: "ldiaz", enabled: true, locked: true,
    mustChangePassword: false, passwordLastSet: "2024-03-15",
    memberOf: [8],
  },
  // Usuario deshabilitado: sirve para probar "Habilitar cuenta"
  {
    id: 15, type: "user", name: "Pedro Ruiz", parentId: 3,
    sam: "pruiz", enabled: false, locked: false,
    mustChangePassword: true, passwordLastSet: "2023-11-20",
    memberOf: [],
  },
];