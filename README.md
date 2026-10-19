# AD Simulator

Simulador de Active Directory hecho con HTML, CSS y JavaScript (módulos ES, sin librerías).
Recrea la consola "Usuarios y equipos de Active Directory" para practicar tareas de soporte técnico.

![Captura](capturas/panel.png)

## Qué permite hacer
- Navegar el árbol del dominio (containers y unidades organizativas anidadas).
- Ver los objetos de cada carpeta: usuarios, grupos y equipos.
- Consultar las propiedades de un usuario (estado, bloqueo, contraseña, grupos).
- Habilitar, deshabilitar y desbloquear cuentas.

## Conceptos de AD que cubre
Dominio, containers, OUs y sub-OUs, usuarios, grupos, equipos, bloqueo de cuentas.

## Estructura
- `js/data.js`: datos del dominio.
- `js/state.js`: reglas y acciones (no toca el DOM).
- `js/ui.js`: todo lo que se dibuja en pantalla.
- `js/main.js`: conecta todo.

## Cómo correrlo
Abrir la carpeta en VS Code y usar la extensión Live Server sobre `index.html`.

## Próximos pasos
Restablecer contraseña con validación de política, búsqueda y persistencia.