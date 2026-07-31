Diseña un prototipo de alta fidelidad de un sistema web de monitoreo operacional llamado "NextGen Nutri" para la planta agroindustrial Maipú de NutriIndustria S.A. Es un piloto que monitorea 2 líneas de producción (Línea A y Línea B). El usuario objetivo del prototipo es un SUPERVISOR o GERENTE de planta.

CONTEXTO DEL PROYECTO:
- Stack tecnológico: Node-RED + Grafana (open source) sobre Node-RED Industrial.
- 2 líneas piloto en planta Maipú, sector alimentos líquidos y conservas.
- Indicadores meta del proyecto: OEE ≥ 72%, Disponibilidad ≥ 80%, Mermas ≤ 2,0%, MTTR ≤ 45 min (línea base: OEE 58%, Disp 65%, Mermas 4,5%, MTTR 120 min).
- Requisitos clave: dashboard en tiempo real (<5s), log de auditoría inalterable, alertas operativas, buffer local de 4h ante corte de conectividad, integración con ERP.
- Restricción ética: NO capturar datos biométricos ni vigilancia individual de operarios (RF-09).

PALETA Y ESTILO:
- Estilo: industrial limpio, profesional, denso en información pero legible.
- Paleta: fondo #F5F7FA, superficies blancas, primario #1E40AF (azul industrial), éxito #16A34A (verde), alerta #F59E0B (ámbar), crítico #DC2626 (rojo), texto #111827, texto secundario #6B7280.
- Tipografía: Inter o equivalente sans-serif moderna.
- Resolución desktop: 1440x900.
- Sombras suaves, bordes redondeados 8-12 px, mucho uso de badges y chips de estado.

ARQUITECTURA: Crea 11 pantallas conectadas como prototipo navegable con sidebar persistente a la izquierda.

SIDEBAR PERSISTENTE (presente en todas las pantallas, excepto Login):
- Logo "NextGen Nutri" arriba.
- Usuario activo: "C. Gloria Valdés - Gerente" (en prototipo de supervisor) con avatar.
- Ítems con íconos:
  🏠 Inicio (Dashboard Ejecutivo)
  🏭 Líneas
  📊 KPIs
  📋 Eventos
  ⏸️ Paradas
  🔔 Alertas (con badge rojo "3 críticas")
  🛠️ Mantenimiento
  📑 Reportes
  🛡️ Auditoría
  ⚙️ Configuración

LAS 11 PANTALLAS SON:

═══════════════════════════════════════════
PANTALLA 1: LOGIN
═══════════════════════════════════════════
- Fondo con imagen difuminada de planta industrial.
- Card central blanca (480px) con:
  - Logo NextGen Nutri.
  - Título: "Sistema de Monitoreo Operacional".
  - Subtítulo: "Planta Maipú · NutriIndustria S.A."
  - Campo RUT/Usuario, campo Contraseña.
  - Selector "Planta": Maipú.
  - Selector "Rol": Supervisor.
  - Botón primario "Iniciar sesión" → lleva a PANTALLA 2.

═══════════════════════════════════════════
PANTALLA 2: DASHBOARD EJECUTIVO (Home del supervisor)
═══════════════════════════════════════════
Header superior:
- Breadcrumb: Inicio
- Título: "Panel Ejecutivo · Planta Maipú"
- Derecha: selector de rango "Turno actual", botón "Exportar", avatar usuario.

Sección 1 — KPIs comparativos (4 cards en fila, cada card muestra Lado A vs Lado B lado a lado):
- OEE: Línea A 71,2% (🟢) | Línea B 68,4% (🟡) | Meta 72% | Δ vs meta.
- Disponibilidad: Línea A 82,1% (🟢) | Línea B 79,5% (🟡) | Meta 80%.
- Mermas: Línea A 2,3% (🟡) | Línea B 1,9% (🟢) | Meta 2,0%.
- MTTR: Línea A 42 min (🟢) | Línea B 51 min (🟡) | Meta 45 min.
Cada card con sparkline de tendencia 7 días y badge de estado (🟢/🟡/🔴).

Sección 2 — Estado de las 2 líneas (2 cards grandes lado a lado):
Card "Línea A — Envasado Líquidos":
- Estado: 🟢 Operando, velocidad 142 unid/min, producto "Jugo Naranja 1L", operador "R. Soto", tiempo en estado 1h 24m.
- Mini sparkline OEE últimas 4h.
- Botón "Ver detalle de línea" → lleva a PANTALLA 3 (con tab A activo).
Card "Línea B — Conservas Vegetales":
- Estado: 🟡 En pausa, velocidad 0, producto "Arvejas 340g", operador "P. Arancibia", tiempo en estado 6 min.
- Mini sparkline OEE.
- Misma estructura.

Sección 3 (lateral derecho o abajo) — Feed de alertas activas (5 cards con timestamp, línea, severidad):
- 🔴 10:42 — Línea A — Falla sensor temperatura cabezal.
- 🔴 10:18 — Línea B — Parada no planificada 12 min.
- 🟡 09:55 — Línea A — Merma sobre umbral meta.
- 🟡 09:30 — Línea B — Mantenimiento preventivo próximo.
- 🟢 08:50 — Línea A — Reconectada tras corte.
Cada alerta con botón "Reconocer" y "Ver evento" → PANTALLA 7.
Botón inferior "Ver todas las alertas" → PANTALLA 7.

Sección 4 — Gráficos resumen (2 abajo):
- Gráfico de barras comparativo OEE/Disp/Mermas/MTTR por línea.
- Gráfico de torta: distribución de motivos de parada últimas 24h.

Botones de acción rápida (sticky footer o debajo):
- "Generar reporte" → PANTALLA 9
- "Ir a Eventos" → PANTALLA 5
- "Ir a Paradas" → PANTALLA 6
- "Ir a Mantenimiento" → PANTALLA 8

═══════════════════════════════════════════
PANTALLA 3: DETALLE DE LÍNEA
═══════════════════════════════════════════
Tabs superiores: [● Línea A] [○ Línea B] (al cambiar de tab debe simular carga de datos de la otra línea y vincular al mismo template, solo cambia el contenido).

Header: "Línea A — Envasado Líquidos" + badge "🟢 Operando".

Bloque superior — Estado operativo:
- 6 mini-cards: Estado, Velocidad (142 unid/min), Producto, Turno (Mañana), Operador, Tiempo en estado (1h 24m).
- Botón "Pausar monitoreo" (secundario, gris).

Bloque KPIs detallados (grid 4x2 últimos 60 min):
OEE, Disponibilidad, Rendimiento, Calidad, Mermas, MTTR, MTBF, Unidades producidas.

Bloque Eventos en vivo:
- Tabla con scroll vertical, 8 filas de ejemplo:
  10:48 | Operación | Cambio de lote | Operador R. Soto | OK
  10:42 | Falla | Sensor temperatura cabezal | Sistema | 🔴 Crítica
  10:30 | Parada | Mantenimiento preventivo | Mantenedor | 🟡 Programada
  ...
- Filtros arriba: tipo, turno, severidad.
- Botón "Ver log completo" → PANTALLA 5

Bloque Paradas del turno:
- Timeline horizontal (Gantt de 8h): bloques verdes/rojos/ámbar.
- Mini tabla con 3 paradas más largas.
- Botón "Ver análisis de paradas" → PANTALLA 6

Bloque Mantenimiento:
- Card "Próximo mantenimiento preventivo: 14:00".
- Card "Última intervención: 28/05".
- Botón "Abrir vista de mantenimiento" → PANTALLA 8

Botón flotante inferior derecha: "🛡️ Ver bitácora de auditoría" → PANTALLA 10.

═══════════════════════════════════════════
PANTALLA 4: KPIs DETALLADOS (Análisis)
═══════════════════════════════════════════
Filtros superiores: rango fechas (Hoy), líneas (Ambas), turno (Todos), producto (Todos).

Tabla comparativa grande:
| KPI | Línea A | Línea B | Meta | Δ |
| OEE | 71,2% | 68,4% | 72% | ▼ |
| Disponibilidad | 82,1% | 79,5% | 80% | ▲ |
| Rendimiento | 88,4% | 84,1% | 85% | ▼ |
| Calidad | 96,8% | 95,2% | 97% | ▼ |
| Mermas | 2,3% | 1,9% | 2,0% | ▲ |
| MTTR | 42 min | 51 min | 45 min | ▼ |
| MTBF | 5h 12m | 4h 02m | 6h | ▲ |

Gráficos:
- Tendencia temporal (líneas) de OEE últimas 24h, ambas líneas superpuestas.
- Pareto de pérdidas de OEE (Disponibilidad / Rendimiento / Calidad).
- Heatmap hora vs disponibilidad (matriz 24x7).

Botón "Exportar análisis (Excel/PDF)".

═══════════════════════════════════════════
PANTALLA 5: EVENTOS (Log centralizado)
═══════════════════════════════════════════
Filtros: línea (Todas), tipo (Todos), fecha (Hoy), turno (Todos), severidad (Todas).

Tabla principal (12 filas) columnas:
| Timestamp | Línea | Tipo | Descripción | Severidad | Operador | Estado | Acción |
- 10:48:12 | A | Operación | Inicio lote L-2451 | 🟢 OK | R. Soto | Cerrado | 👁 Ver
- 10:42:03 | A | Falla | Sensor temperatura | 🔴 Crítica | Sistema | Abierto | 👁 Ver
- 10:30:00 | B | Parada | Mantenimiento programado | 🟡 Media | P. Arancibia | En curso | 👁 Ver
...

Click en 👁 Ver → modal con detalle del evento + botón "Ver log de auditoría" → PANTALLA 10.

Botones: "Exportar CSV", "Filtrar avanzado".

═══════════════════════════════════════════
PANTALLA 6: PARADAS (Análisis de Downtime)
═══════════════════════════════════════════
Header: "Análisis de paradas — Hoy"

KPIs superiores (4 cards):
- Paradas totales: 7 (Línea A: 3, Línea B: 4)
- Tiempo total parado: 48 min
- Parada más larga: 18 min (Línea B, falla mecánica)
- Disponibilidad promedio: 80,8%

Gráfico 1 (grande izquierda): Pareto de motivos:
- Falla mecánica 32%, Cambio formato 24%, Mantenimiento 18%, Falta material 14%, Otros 12%.

Gráfico 2 (grande derecha): Timeline de paradas del turno (Gantt horizontal con bandas de operación/paro).

Tabla detallada:
| Inicio | Fin | Duración | Motivo | Línea | Operador | MTTR |
| 10:18 | 10:30 | 12 min | Falla mecánica | B | P. Arancibia | 12 |
| 09:42 | 09:51 | 9 min | Cambio formato | A | R. Soto | 9 |
...

Botón por fila "🛠️ Asignar a mantenimiento" → PANTALLA 8 con ticket pre-cargado.

═══════════════════════════════════════════
PANTALLA 7: ALERTAS (Bandeja)
═══════════════════════════════════════════
Filtros: severidad (Todas con contadores), línea, estado (Activas / Reconocidas / Resueltas), tipo.

Resumen lateral: "12 activas · 3 críticas sin asignar · MTTA prom 4 min".

Lista de alertas (cards):
Card ejemplo crítica:
- 🔴 CRÍTICA · 10:42 · Línea A
- Título: "Sensor temperatura cabezal fuera de rango"
- Descripción: "Lectura > 85°C durante 4 min. Posible riesgo de producto."
- Estado: Activa
- Botones: "Reconocer" / "Asignar a mantenedor" / "Ver evento" → PANTALLA 5 / "Abrir en mantenimiento" → PANTALLA 8

Card media: misma estructura pero ámbar.
Card baja: misma estructura pero verde.
Card resuelta: muestra timestamp de resolución.

═══════════════════════════════════════════
PANTALLA 8: MANTENIMIENTO (Vista técnica)
═══════════════════════════════════════════
Tabs: [Pendientes (4)] [En curso (2)] [Cerradas (18)]

Por cada ticket:
- ID ticket: MT-2026-047
- Origen: 🔴 Alerta Línea A
- Máquina: "Envasadora ENV-01"
- Falla: "Sensor temperatura cabezal fuera de rango"
- Tiempo transcurrido (cronómetro en vivo: 00:08:32)
- Técnico asignado: "L. Rojas"
- Prioridad: 🔴 Alta
- Botones: "Cerrar ticket", "Adjuntar evidencia", "Ver evento origen" → PANTALLA 5

Lateral derecho:
- Calendario mensual de mantenimientos preventivos (puntos verdes/ámbar/rojos).
- Card "Historial ENV-01": tabla con últimas 5 intervenciones.

═══════════════════════════════════════════
PANTALLA 9: REPORTES
═══════════════════════════════════════════
Header: "Centro de reportes".

Sección izquierda — Tipos de reporte (cards seleccionables):
- 📄 Reporte diario de operación
- 📊 Reporte de OEE semanal
- ⏸️ Reporte de paradas y MTTR
- 📉 Reporte de mermas
- 🛡️ Reporte de auditoría (RF-08)

Sección derecha — Configurador:
- Rango fechas: [01/06/2026] a [29/06/2026]
- Líneas: ☑ Línea A ☑ Línea B
- KPIs a incluir: ☑ OEE ☑ Disponibilidad ☑ Mermas ☑ MTTR ☑ Eventos ☑ Alertas
- Formato: ⦿ PDF  ○ Excel  ○ CSV
- Botón primario "Generar reporte" → muestra preview modal con mini-vista del PDF.
- Botón "Descargar".

Sección inferior — Historial:
| Nombre | Fecha | Generado por | Formato | Acciones |
| Rep_OEE_Sem22 | 29/06 | C. Viera | PDF | ⬇ Re-descargar |
...

═══════════════════════════════════════════
PANTALLA 10: BITÁCORA DE AUDITORÍA (RF-08)
═══════════════════════════════════════════
Header: "Bitácora de auditoría — Log inalterable" con candado 🔒.

Filtros: usuario, fecha, tipo de acción, módulo.

Tabla (solo lectura):
| Timestamp | Usuario | Rol | Acción | Módulo | Registro | IP/Dispositivo |
| 10:48:12 | c.viera | QA | Modificar umbral | Configuración | KPI-MTTR-45 | 192.168.10.42 |
| 10:42:03 | sistema | IoT | Crear evento | Eventos | EV-2451 | Gateway-A |
| 10:30:00 | r.soto | Operador | Iniciar lote | Producción | L-2451 | Tablet-A03 |
| 09:15:22 | m.garcia | PM | Aprobar cambio | Cambios | CR-012 | 192.168.10.05 |
...

Banner superior: "🔒 Este registro no puede ser modificado. Exportable solo para auditoría externa."
Botón "Exportar log completo".

═══════════════════════════════════════════
PANTALLA 11: CONFIGURACIÓN (solo Gerente)
═══════════════════════════════════════════
Tabs internas:
👥 Usuarios | 🎯 Umbrales | 🏭 Líneas y productos | 🔗 Integración ERP

Tab Usuarios:
- Tabla de usuarios con rol (Operador/Supervisor/Gerente), planta asignada, estado, acciones.
- Botón "+ Nuevo usuario".
- Card lateral "Permisos por rol" con matriz de capacidades.

Tab Umbrales:
- Inputs editables: OEE meta 72%, Disponibilidad meta 80%, Mermas máx 2,0%, MTTR máx 45 min.
- Inputs de disparo de alerta: OEE < 65% → crítica, mermas > 3% → media, etc.
- Botón "Guardar cambios".

Tab Líneas y productos:
- Lista de 2 líneas configuradas con: nombre, tipo (Envasado/Conservas), productos asociados.
- Botón "+ Agregar producto".

Tab Integración ERP:
- Card de estado: "🟢 ERP sincronizado · última sync 10:48:12".
- Endpoint, frecuencia sync, botón "Forzar sincronización".
- Log de las últimas 10 sincronizaciones.

═══════════════════════════════════════════════════
INSTRUCCIONES DE PROTOTIPO Y SISTEMA DE DISEÑO
═══════════════════════════════════════════════════
- Usa la extensión "Smart Animate" entre transiciones para que el cambio de tabs y modales sea fluido.
- Conecta TODOS estos botones como hyperlinks de Figma entre frames:

Login "Iniciar sesión" → Dashboard (Pantalla 2)
Sidebar "Inicio" → Pantalla 2
Sidebar "Líneas" → Pantalla 3
Sidebar "KPIs" → Pantalla 4
Sidebar "Eventos" → Pantalla 5
Sidebar "Paradas" → Pantalla 6
Sidebar "Alertas" → Pantalla 7
Sidebar "Mantenimiento" → Pantalla 8
Sidebar "Reportes" → Pantalla 9
Sidebar "Auditoría" → Pantalla 10
Sidebar "Configuración" → Pantalla 11

Dashboard "Ver detalle de línea A" → Pantalla 3 (tab A)
Dashboard "Ver detalle de línea B" → Pantalla 3 (tab B)
Dashboard "Ver todas las alertas" → Pantalla 7
Dashboard "Generar reporte" → Pantalla 9
Dashboard "Ir a Eventos" → Pantalla 5
Dashboard "Ir a Paradas" → Pantalla 6
Dashboard "Ir a Mantenimiento" → Pantalla 8
Dashboard "Ver evento" (en cada alerta) → Pantalla 5

Detalle Línea "Ver log completo" → Pantalla 5
Detalle Línea "Ver análisis de paradas" → Pantalla 6
Detalle Línea "Abrir vista de mantenimiento" → Pantalla 8
Detalle Línea "Ver bitácora" → Pantalla 10
Detalle Línea tab A → tab B (manteniendo mismo layout)

Eventos "👁 Ver" → modal de detalle (overlay) que al cerrar vuelve a Pantalla 5
Eventos "Ver log de auditoría" (en modal) → Pantalla 10

Paradas "Asignar a mantenimiento" → Pantalla 8 con ticket pre-cargado

Alertas "Reconocer" / "Asignar" → actualizar estado inline en la card
Alertas "Ver evento" → Pantalla 5
Alertas "Abrir en mantenimiento" → Pantalla 8

Reportes "Generar" → modal preview → botón "Descargar" vuelve a Pantalla 9

- Crea componentes reutilizables (frames con Auto Layout):
  · KPI Card (variantes: OEE / Disponibilidad / Mermas / MTTR)
  · Status Badge (🟢 OK / 🟡 Alerta / 🔴 Crítico / ⚪ Inactivo)
  · Sidebar Item (variantes: activo / inactivo)
  · Data Table con header sticky
  · Alert Card (variantes: crítica / media / baja / resuelta)
  · Button (primario / secundario / ghost)

- Define variables de color y tipografía en "Variables / Styles" para mantener consistencia.

- Llena todas las tablas con datos realistas del contexto agroindustrial (jugo, conservas, arvejas, lotes L-2451, operarios con nombres chilenos, IPs 192.168.10.x, etc.).

- Añade micro-interacciones sutiles: skeleton loaders al cambiar tabs, hover en cards, badges con leve pulse en alertas críticas.

ENTREGABLE FINAL: 11 frames conectados como prototipo navegable, con sistema de diseño documentado en la primera página, paleta y tipografía en variables, y todos los enlaces de navegación funcionando.

CRITERIOS DE ACEPTACIÓN:
1. Las 11 pantallas existen y son coherentes visualmente.
2. La navegación entre pantallas funciona sin clics huérfanos.
3. Las dos líneas (A y B) muestran datos diferenciados y comparables.
4. Los 4 KPIs aparecen con meta, valor actual, línea base y delta en todas las vistas relevantes.
5. El log de auditoría es visualmente distinto (candado, fondo gris) para reforzar inalterabilidad.
6. La estética es industrial profesional, no consumer ni genérica.
