# Changelog - BetterDice Mod By SenyuDev

Todas las novedades y cambios notables de este proyecto están documentados en este archivo.

---

## [2.1.0] - 2026-09-08

### Añadido
- **Resultados en el Historial de Tiradas**:
  - Ahora cada entrada del historial muestra el resultado numérico total (`= X`) obtenido tras la simulación física 3D.
  - Sincronización automática del resultado en cuanto los dados terminan de rodar.
- **Mecánica de Bendición (Bless) con Previsualización 3D**:
  - Control de activación y contador de dados de Bless (d4) en la pestaña de modificadores y controles rápidos.
  - Los dados de bendición caen físicamente en la bandeja 3D y se visualizan antes de realizar el lanzamiento.
  - Soporte completo para Ventaja y Desventaja (duplica los dados de Bless según la regla correspondiente).
- **Acción de Daño / Ignorar Bless**:
  - Nuevo interruptor en el formulario de guardar y editar tiradas ("Ignorar Bless / Tirada de daño").
  - Al cargar una tirada marcada como daño, Bless se desactiva de forma automática para evitar sumarlo accidentalmente al daño.
- **Preservación de Estilos y Colores de Dados**:
  - Al cargar tiradas guardadas o de acceso rápido, se restauran los estilos, materiales y colores originales con los que se configuraron.
- **Exportación e Importación de Personajes (.json)**:
  - Capacidad de exportar grupos completos de tiradas a archivos `.json` descargables.
  - Importación de archivos `.json` con asignación automática de nombres sin colisiones.
- **Compendio con Soporte Homebrew**:
  - Integración con colecciones de TheGiddyLimit (`creature/`, `item/`, `collection/`).
  - Cálculo automático de habilidades (`skills`) y salvaciones (`saves`) de criaturas.
- **Efectos de Audio de Crítico y Pifia**:
  - Fanfarria sintetizada con Web Audio API para éxitos críticos (20 natural en d20).
  - Sonido descendente sintetizado para pifias (1 natural en d20).
- **Modo Rendimiento (Simplificar 3D)**:
  - Opción global sincronizada mediante metadatos de OBR para desactivar la bandeja 3D de otros jugadores y mostrar solo notificaciones compactas de texto con el desglose del resultado (`Nombre | Total (Dado + Mod)`).
- **Modal de Novedades y Cambios**:
  - Modal actualizado en la barra lateral con la lista detallada de todas las adiciones recientes.

---

## [2.0.0] - 2026-07-28

### Añadido
- **Organización por Categorías**:
  - Clasificación automática y personalizada de tiradas (`Ataques`, `Daño`, `Salvación`, `Habilidades`, `Atributos`, etc.).
  - Visualización estructurada de categorías en el panel lateral de acceso rápido (`QuickRollPanel`).
- **Navegación por Pestañas en la Barra Lateral**:
  - Reestructuración de la barra lateral en pestañas independientes para Dados y Modificadores.
- **Diseño Flotante Glassmorphism**:
  - Paneles laterales flotantes con transparencia para mantener la bandeja 3D completamente visible.
- **Carga de Tiradas a la Bandeja**:
  - Las tiradas guardadas ahora limpian la mesa y cargan los dados en la bandeja para permitir ajustes previos al lanzamiento.
- **Volver a tirar desde el historial**:
  - Botón de repetir (↻) en las entradas del historial de dados.
- **Restar dados con clic derecho**:
  - Clic derecho para decrementar la cantidad de un dado directamente en la barra lateral.
