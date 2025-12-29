# ASCII Art Tracer

Un editor de arte ASCII moderno y completo que te permite crear arte ASCII de forma manual o automática a partir de imágenes.

## Características Principales

### Herramientas de Dibujo
- **Lápiz (D)**: Dibuja caracteres individualmente
- **Borrador (E)**: Borra caracteres del canvas
- **Relleno (F)**: Rellena áreas con el carácter seleccionado
- **Línea (L)**: Dibuja líneas rectas
- **Rectángulo (R)**: Dibuja rectángulos
- **Gotero (I)**: Captura un carácter del canvas haciendo click

### Gestión de Imágenes
- Carga imágenes de referencia arrastrándolas o haciendo click
- Ajusta la opacidad de la imagen de referencia (5-80%)
- Escala la imagen (25-200%)
- Posiciona la imagen con controles X e Y
- Resetea la posición y escala de la imagen
- Remueve la imagen para volver al estado inicial
- Conversión automática de imagen a ASCII con diferentes sets de caracteres
  - La conversión respeta la escala y posición actual de la imagen

### Paleta de Caracteres
- Paleta rápida con 24 caracteres comunes
- Selector de caracteres completo con categorías:
  - **Basic**: Caracteres alfanuméricos y símbolos básicos
  - **Box**: Caracteres para dibujar cajas y bordes
  - **Blocks**: Bloques de diferentes densidades
  - **Shapes**: Formas geométricas y símbolos
  - **Arrows**: Flechas en todas direcciones
  - **Math**: Símbolos matemáticos
  - **Misc**: Símbolos misceláneos
- Búsqueda de caracteres
- Input de carácter personalizado

### Configuración del Canvas
- Tamaño ajustable (20-150 columnas × 10-80 filas)
- Tamaño de fuente ajustable (6-24px)
- Selección de fuentes monoespaciadas:
  - IBM Plex Mono
  - Courier New
  - Consolas
  - Fira Code
  - JetBrains Mono
  - Y más...

### Sistema de Grilla
- Grilla ajustable para facilitar el dibujo preciso
- Control de opacidad de la grilla (10-100%)
- Grosor de línea ajustable (0.5-3px)
- Activar/desactivar grilla

### Conversión Automática
- **Sets de caracteres predefinidos**:
  - Detailed: `@%#*+=-:. `
  - Blocks: `█▓▒░ `
  - Simple: `#*+- `
  - Dots: `●◐○· `
  - Custom: Define tu propio set
- Control de contraste (50-200%)
- Opción de invertir colores

### Historial y Deshacer
- Sistema de undo/redo (Ctrl+Z / Ctrl+Y)
- Hasta 50 estados en el historial

### Temas Visuales
- **Monodraw**: Tema oscuro minimalista (por defecto)
- **Terminal**: Estilo terminal verde sobre negro
- **Amber**: CRT ámbar retro
- **Paper**: Tema claro estilo papel
- **Blueprint**: Estilo plano arquitectónico
- **Cyber**: Tema cyberpunk con efectos de brillo

### Guardar y Exportar
- **Guardar proyecto**: Guarda el canvas, configuración y imagen de referencia (`.ascii`)
  - Te permite elegir el nombre del archivo antes de guardar
- **Abrir proyecto**: Carga proyectos previamente guardados
- **Exportar**: Vista previa y opciones de descarga
  - **Download .txt**: Descarga como archivo de texto plano (puedes elegir el nombre)
  - **Download .png**: Descarga como imagen PNG transparente con los caracteres en el color del tema actual (puedes elegir el nombre)
- **Copiar**: Copia el arte ASCII al portapapeles

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `D` | Seleccionar herramienta de dibujo |
| `E` | Seleccionar borrador |
| `F` | Seleccionar relleno |
| `L` | Seleccionar línea |
| `R` | Seleccionar rectángulo |
| `I` | Seleccionar gotero |
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` | Rehacer |
| `Ctrl + S` | Guardar proyecto |
| `Ctrl + O` | Abrir proyecto |
| `Ctrl + C` | Copiar al portapapeles |

## Cómo Usar

### Dibujo Manual
1. Carga una imagen de referencia (opcional)
2. Ajusta la opacidad y posición de la imagen
3. Selecciona una herramienta de dibujo
4. Elige un carácter de la paleta o escribe uno personalizado
5. Haz click o arrastra sobre el canvas para dibujar
6. Usa el gotero para capturar caracteres existentes

### Conversión Automática
1. Carga una imagen
2. Ajusta el tamaño del canvas según necesites
3. Posiciona y escala la imagen como quieras (la conversión respetará estos ajustes)
4. Selecciona un set de caracteres
5. Ajusta el contraste si es necesario
6. Haz click en "⚡ Auto" o "⚡ Convert Now"
7. Refina manualmente con las herramientas de dibujo

**Nota**: La conversión automática ahora toma en cuenta la escala y posición de la imagen, por lo que puedes hacer zoom y mover la imagen antes de convertir para enfocarte en una parte específica.

### Guardar tu Trabajo
1. Haz click en "💾 Save" para guardar el proyecto completo (incluye configuración e imagen)
   - Se te pedirá que ingreses un nombre para el proyecto
2. Haz click en "Export" para ver las opciones de exportación:
   - **Download .txt**: Descarga el ASCII como texto plano (te pide el nombre del archivo)
   - **Download .png**: Descarga como imagen PNG transparente con los colores del tema (te pide el nombre del archivo)
   - **Copy**: Copia el texto al portapapeles
3. Usa "Copy" en el header para copiar directamente sin abrir el modal

**Nota sobre PNG**: El fondo de la imagen es transparente, ideal para usar en diseños, redes sociales, o cualquier aplicación donde quieras superponer el ASCII art sobre otros elementos.

## Compatibilidad

- Funciona en navegadores modernos (Chrome, Firefox, Safari, Edge)
- Optimizado para iPad y tablets
- Soporte táctil completo
- Diseño responsive para móviles

## Tecnologías

- HTML5
- CSS3 con variables CSS para temas
- JavaScript vanilla (sin dependencias)
- Canvas API para conversión de imágenes

## Características Técnicas

- Sin dependencias externas
- Almacenamiento local para preferencias de tema
- Sistema de grilla SVG dinámico
- Algoritmo de Bresenham para dibujo de líneas
- Flood fill para la herramienta de relleno
- Conversión de imagen usando análisis de luminancia

---

Desarrollado con ❤️ para M
