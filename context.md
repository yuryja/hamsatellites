# 📡 HamBands Architecture & Lessons Learned (AI Context File)

Este archivo sirve como memoria técnica para futuros proyectos de Pebble (especialmente para el **Satellite Tracker**). 

## 🛡️ Estabilidad y Memoria (C)
- **Buffer de AppMessage**: Siempre abrir con al menos `512 bytes` (in/out) si se envían múltiples cadenas de texto para evitar que los mensajes se pierdan.
  - `app_message_open(512, 512);`
- **Manejo de Cadenas**: EVITAR `strtok`. En el SDK de Pebble es inestable con múltiples hilos o estados. Usar `strchr` para parsear pipes (`|`) o delimitadores.
- **Protección de Nulos**: Siempre verificar `text_layer_get_text()` antes de pasar el resultado a funciones como `strstr` o `strlen` para prevenir el error `App fault!`.
- **Tipos de Datos**: Usar comprobaciones explícitas de tipo en los Tuples recibidos (`lang_t->type == TUPLE_CSTRING`) para evitar lecturas de memoria inválidas.

## ⚙️ Configuración y JS (PKJS)
- **Clay Integration**: Para evitar errores de "Loading watchapp", inyectar el JSON de configuración directamente en `index.js` en lugar de cargarlo como archivo externo.
- **XMLHttpRequest**: Añadir siempre un `timeout` (ej: 10s) para que el hilo de JS no muera esperando al servidor solar o satelital.
- **Compatibilidad**: Usar `var` en lugar de `const`/`let` para asegurar que el código funcione en los firmwares más antiguos de Pebble (ej. Pebble original/Classic).

## 🎨 Layout y Diseño
- **Alineación de Columnas**: No usar una sola cadena de texto con espacios. Crear `TextLayers` independientes para cada columna (`Banda`, `Día`, `Noche`) para asegurar que todo se vea derecho en todas las pantallas.
- **Tipografía**: Usar una función helper `set_layer_style` para mantener el código C limpio y reutilizable.
- **Regionalización**: Implementar lógica de fecha dinámica. Detectar `en_US` para usar el formato `Month Day, Year`, y el resto del mundo `Day Month Year`.

## 🛠️ Build & Toolchain
- **Plataformas**: Al usar `pebble-clay`, las plataformas `gabbro` y `flint` deben ser eliminadas de `targetPlatforms` en `package.json` ya que no son compatibles y rompen el proceso de compilación.