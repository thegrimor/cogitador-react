# CLAUDE.md — Cogitador React

Reglas y convenciones para el agente en este proyecto.

---

## Contexto del proyecto

**Dark Heresy Cogitator** — conjunto de herramientas web para el juego de rol Dark Heresy (Warhammer 40K).

El proyecto nació como 3 HTMLs standalone con estética Adeptus Mechanicus (grimdark). El objetivo es migrarlos a React manteniendo el diseño y añadiendo interactividad.

### Módulos planificados

| Módulo | Descripción | Estado |
|---|---|---|
| `ficha` | Ficha del agente/personaje | Funcional, 8 tabs + Caídos. Pendiente: tab Inquisidor, catálogos de reglas incompletos (ver "Pendientes de migración") |
| `proyectos` | Gestor de proyectos de campaña | Funcional, casi 1:1 con el HTML de referencia |
| `sequito` | Gestión del séquito (acólitos y aliados) | Funcional (capas, drag&drop, equipo). Pendiente: flujo "+ del libro" (ver "Pendientes de migración") |

Cada módulo existe como HTML funcional previo (`gestionproyectos.html`, `gestionsequito.html`, `cogitadorpersonajes.html`) que sirve de referencia para la migración. Evaluación de fidelidad realizada el 2026-08-05.

### Diseño — Sistema visual

Estética Adeptus Mechanicus. El sistema de diseño está definido en `src/index.css` como tema Tailwind v4 (`@theme`):

- **Colores clave:** `crimson` (#c41e1e), `crimson-bright` (#ff2222), `crimson-dim` (#7a0f0f), `gold` (#c8962a), `neon` (azul-verde)
- **Superficies:** `surface` (#080808), `surface-2` (#0f0f0f), `surface-3` (#161616), `surface-4` (#1e1e1e)
- **Texto:** `parchment` (#e8dcc8), `parchment-dim`
- **Bordes:** `rim` (#2a2218), `rim-2` (#4a3a28)
- **Fuentes:** Orbitron (display/títulos), Share Tech Mono (mono/body), Rajdhani (descripciones)
- **Animaciones:** `scan` (scanline), `shimmer`, `spin-slow` (20s), `pulse-mech`

### Perfil del desarrollador

- Perfil principalmente **backend**, acostumbrado a DDD y arquitectura por bounded contexts
- Nuevo en React/frontend — cuando sea útil, explicar conceptos frontend en términos de backend
- Puede y quiere hacer cambios manuales en el código sin necesidad de pedirlo al agente

---

## Diseño — Mobile First

- El proyecto está pensado **principalmente para móvil**
- Diseñar siempre mobile-first: pantallas pequeñas primero, luego adaptar a desktop
- Respetar el responsive en todo momento — nunca romper el layout en móvil
- PWA se implementará más adelante; tenerlo en mente al estructurar (sin bloquearlo)

---

## Stack

- **React 19** + **Vite 8** + **TypeScript 6** (strict mode)
- **Tailwind CSS v4** (config via `@theme` en `index.css`, plugin `@tailwindcss/vite`)
- **Redux Toolkit 2** + `react-redux` + **redux-persist** (persistencia en localStorage, key `cogitador-root`)
- **@dnd-kit/core + @dnd-kit/sortable** — drag & drop (usado en `sequito`)
- **Sin React Router** — navegación actual con tab state en `App.tsx`
- **Sin Jest/RTL configurado** — pendiente de añadir
- **ESLint v9** (flat config) con plugins: typescript-eslint, react-hooks, react-refresh
- Sin Prettier configurado explícitamente (pendiente)

---

## Estructura de proyecto

Arquitectura modular inspirada en DDD. Cada módulo representa un bounded context independiente.

```
src/
  core/
    data/
      darkheresy/         # Datos del sistema de juego — compartidos entre ficha y sequito
        attributes.ts     # 9 atributos base (WS, BS, S, T, Ag, Int, Per, WP, Fel)
        skills.ts         # Habilidades del libro
        talents.ts        # Talentos del libro (contenido incompleto, ver pendientes)
        psychicPowers.ts  # Poderes psíquicos (contenido incompleto, ver pendientes)
        careers.ts        # Carreras, rangos, coste de avance de atributos
        weapons.ts        # Armas (contenido incompleto, ver pendientes)
        armor.ts          # Armaduras (contenido incompleto, ver pendientes)
        gear.ts           # Equipo general (contenido incompleto, ver pendientes)
        augmentations.ts  # Implantes cibernéticos
        mechadendrites.ts # Mecadendrites
        index.ts
    store/
      store.ts            # Redux store persistido (redux-persist), reducers: ficha, proyectos, sequito
      hooks.ts            # useAppDispatch, useAppSelector (tipados)
  modules/
    ficha/
      components/
        FichaView.tsx           # Contenedor principal con tabs internos
        CharacterHeader.tsx     # Selector de personaje + export/import + botón crear
        CharacterCreateModal.tsx# Formulario de creación de personaje
        ExperiencePanel.tsx     # Visualización y gestión de XP
        tabs/
          AtributosTab.tsx        # Atributos (funcional)
          HabilidadesTab.tsx      # Habilidades (funcional)
          TalentosTab.tsx         # Talentos (funcional, catálogo incompleto)
          ArmeriaTab.tsx          # Armas/armaduras/gear (funcional, sin filtro por grupo)
          EquipoTab.tsx           # Tesoro/notas/influencia (funcional)
          MejorasTab.tsx          # Implantes/mecadendrites (funcional)
          PoderesPsiquicosTab.tsx # Poderes psíquicos (funcional, catálogo incompleto)
          XpTab.tsx               # Tabla de coste de atributos + log XP (funcional)
          CaidosTab.tsx           # Personajes caídos en combate (funcional)
          atributos/
            AttributeCard.tsx   # Card de atributo individual
            CharInfoGrid.tsx    # Grid de info del personaje
            WoundsPanel.tsx     # Panel de heridas/destino/vida
      services/
        fichaSlice.ts          # CRUD personajes, atributos, heridas, destino, XP, killCharacter
        fichaComputed.ts       # Cálculos derivados (PE gastado, rango, movimiento)
        fichaImportMapper.ts   # Import de fichas legacy (HTML) a formato React
      types/
        fichaTypes.ts     # Character, CharacterInfo, AttributeValues, VitalState, XpLogEntry
      index.ts            # Barrel export: FichaView
    proyectos/
      components/
        ProyectosView.tsx    # Vista contenedora
        StatsBar.tsx         # Stats (total/activos/completados/en espera)
        TimePanel.tsx        # Avanzar tiempo + export/import
        AddProjectForm.tsx   # Alta de proyecto
        ProjectsGrid.tsx     # Grid filtrable + empty state
        ProjectCard.tsx      # Card de proyecto individual
      services/
        proyectosSlice.ts    # advanceTime, addProject, deleteProject, setProjectStatus, etc.
      types/
        proyectosTypes.ts    # Project, ProjectStatus, ProjectCategory
      index.ts             # Barrel export: ProyectosView
    sequito/
      components/
        SequitoView.tsx      # Contenedor con tabs (séquito/armas/implantes/mecadendrites/equipo/armaduras)
        LayerBoard.tsx        # Tablero de capas con dnd-kit
        LayerRow.tsx           # Capa individual (renombrar, reordenar, eliminar)
        SequitoCard.tsx         # Card de séquito individual
        AddSeqModal.tsx        # Alta individual / en masa
        SeqEditModal.tsx       # Edición de séquito: stats, equipo, vivo/muerto
        tabs/
          ArmoryTab.tsx        # Armas (stock/equipados/disponibles)
          InventoryTab.tsx     # Implantes/mecadendrites/equipo/armaduras (mismo patrón)
      services/
        sequitoSlice.ts      # Capas, séquito, inventario, asignación de equipo
      types/
        sequitoTypes.ts      # Layer, Sequito, InventoryItem
      index.ts              # Barrel export: SequitoView
  shared/
    components/
      TabBar/
        TabBar.tsx        # Barra de navegación inferior (ficha / proyectos / séquito)
        index.ts          # Barrel export: TabBar, TabId
      ConfirmModal/       # Modal de confirmación genérico
      Toast/              # Sistema de notificaciones toast
    hooks/
      useConfirm.ts       # Hook para ConfirmModal
      useToast.ts         # Hook para Toast
  App.tsx                 # Tab state (useState), renderiza vista activa + TabBar
  main.tsx                # Entry point: <Provider store><PersistGate><App /></PersistGate></Provider>
  index.css               # Tema Tailwind v4 + estilos base
```

Los módulos son independientes entre sí. Solo se importa desde el `index.ts` de cada módulo, nunca directamente desde sus carpetas internas.

### Estado actual de los módulos

Los 3 módulos están funcionales end-to-end (CRUD, persistencia, UI). Lo que queda pendiente es fidelidad de contenido/reglas frente a los HTML de referencia — ver siguiente sección.

### Pendientes de migración (evaluación 2026-08-05 vs HTML de referencia)

Decisiones ya tomadas con el usuario, pendientes de implementar:

- **`ficha` — modelo de personajes**: recrear el modelo original de 2 slots fijos (Inquisidor / Séquito) con tab "Inquisidor" exclusivo (rangos 9-16), sustituyendo la lista abierta actual. Solo el Séquito puede "caer en combate".
- **`ficha` — herencia de PE al morir**: al marcar caído en combate, heredar el 100% del PE al nuevo acólito y crearlo automáticamente (hoy hereda 50% y no crea reemplazo).
- **`ficha` — compra de atributos**: mantener el input libre actual (no se implementan los "dots" del HTML), pero corregir `computeXpSpent` para que calcule el coste PE real a partir del valor introducido (hoy el cálculo asume el sistema de dots del HTML y queda desacoplado).
- **Catálogos de datos incompletos** (`core/data/darkheresy/`), compartidos por `ficha` y `sequito`: `talents.ts` (25 de 155 canónicos, con nombres inventados que rompen el filtro "solo carrera"), `psychicPowers.ts` (25 de 82), `weapons.ts` (20 de 55, falta campo de grupo), `armor.ts` (8 de 15), `gear.ts` (19 de 29, notas vacías), `mechadendrites.ts`/`augmentations.ts` (nº correcto pero contenido reinventado).
- **`ficha` — Armería**: falta filtro por grupo de armas/armaduras/gear (bloqueado por el campo "grupo" que falta en `weapons.ts`).
- **`ficha` — selector de rama de carrera**: cuando dos rangos comparten tramo de PE, el HTML deja elegir rama; React se queda con el último de la lista.
- **`sequito` — flujo "+ del libro"**: no existe modal de catálogo en `ArmoryTab`/`InventoryTab`; alta de items es solo manual. Bloqueado también por los catálogos incompletos de arriba.
- **`sequito` — edición de item existente**: el reducer `updateInventoryItem` existe pero no está conectado a ningún formulario.
- Pendientes menores: import sin confirmación en `proyectos`, contador de "activos" en header, UI heridas/destino como iconos clicables en vez de inputs, bug en `fichaImportMapper.ts` (`acolito` fallback nunca se dispara), abreviaturas de atributos en español.

### Plan de implementación

Orden de trabajo acordado para abordar los pendientes de migración:

- **Fase 0 — Catálogos de datos compartidos**: reescribir `talents.ts` (155), `psychicPowers.ts` (82), `weapons.ts` (55 + campo grupo), `armor.ts` (15), `gear.ts` (29), `mechadendrites.ts`, `augmentations.ts` con contenido canónico del libro. Es la base que necesitan tanto `ficha` como `sequito`, va primero.
- **Fase 1 — `ficha`: modelo de roles y mecánica**: volver a 2 slots fijos Inquisidor/Séquito (`fichaTypes.ts`/`fichaSlice.ts`), nuevo tab Inquisidor (rangos 9-16), restricción "solo el Séquito puede caer en combate" + auto-creación de reemplazo con herencia del 100% de PE (`killCharacter`), fix de `computeXpSpent`, filtro por grupo en Armería, selector de rama de carrera.
- **Fase 2 — `sequito`: conectar catálogo**: modal "+ del libro" en `ArmoryTab`/`InventoryTab`, conectar el reducer `updateInventoryItem` (ya existe, sin usar) a un formulario de edición, extraer la lógica duplicada de "equipados" a un selector compartido.
- **Fase 3 — pulido cross-módulo**: import con confirmación en `proyectos`, contador de "activos" en header, UI heridas/destino tipo barra clicable + botón "nueva sesión", fix del bug de import legado, abreviaturas de atributos en español, estado XP "warn" intermedio.

### Tests

Los tests seguirán la misma estructura que el código (pendiente de configurar Jest/RTL):

```
src/
  modules/
    [feature]/
      __tests__/
        components/
        hooks/
        services/
```

---

## Convenciones de código

- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Hooks, utils, services, types**: camelCase (`useAppSelector.ts`, `formatDate.ts`)
- **Imports**: usar siempre path aliases con `@/` (ej: `@/modules/ficha/components/FichaView`)
- **Estilos**: Tailwind utility classes estándar — sin CSS modules, sin CSS-in-JS
- **Formato**: seguir configuración ESLint del proyecto; Prettier pendiente de configurar
- **Exports desde módulos**: solo a través del `index.ts` del módulo — nunca imports directos a carpetas internas

---

## Navegación actual

No hay React Router configurado. La navegación funciona así:
- `App.tsx` mantiene `activeTab: 'ficha' | 'proyectos' | 'sequito'` con `useState`
- `TabBar` emite el tab seleccionado vía prop `onChange`
- `App.tsx` renderiza el componente de vista correspondiente al tab activo
- React Router se añadirá en el futuro; la estructura de módulos está pensada para facilitar esa migración

---

## Redux Store

```typescript
// src/core/store/store.ts
const rootReducer = combineReducers({
  ficha: fichaReducer,
  proyectos: proyectosReducer,
  sequito: sequitoReducer,
})
// persistido con redux-persist (key: 'cogitador-root', storage: localStorage)
```

- Usar siempre `useAppDispatch` y `useAppSelector` de `src/core/store/hooks.ts` (tipados)
- Cuando se añadan nuevos módulos con estado, añadir su reducer aquí
- El estado persiste automáticamente en localStorage vía redux-persist — no hace falta guardar manualmente

---

## Git

### Commits — Conventional Commits

```
feat: descripción
fix: descripción
chore: descripción
refactor: descripción
test: descripción
docs: descripción
```

### Ramas

Una rama por feature, siguiendo la misma convención:

```
feature/nombre-feature
fix/nombre-bug
chore/nombre-tarea
```

---

## Comportamiento del agente

### Cambio de contexto entre módulos
**Antes de tocar archivos de un módulo diferente al que se está trabajando, el agente debe pausar y consultar al usuario.** Aunque el cambio parezca necesario, hay que confirmarlo explícitamente.

### Errores de build o TypeScript
Si aparece un error de build, TypeScript o lint, el agente **notifica al usuario con el error y los posibles pasos** antes de actuar. No corrige de forma autónoma.

### Decisiones autónomas permitidas
- Crear archivos dentro del módulo en curso
- Añadir barrel exports al `index.ts` del módulo en curso
- Formatear con Prettier/ESLint
- Escribir tests del módulo en curso

### Git — esperar confirmación explícita
**El agente nunca hace `git add`, `git commit`, `git push` ni ninguna operación git sin que el usuario lo pida explícitamente.** Esto incluye commits de documentación, configuración o cualquier otro tipo.

---

## Output Rules
- Respuestas concisas. Sin explicaciones no solicitadas.
- No repitas código ya mostrado, solo los cambios.
- Sin preámbulos ni confirmaciones ("Claro!", "Por supuesto", etc.).
- Formato: solo lo necesario. Sin markdown decorativo.
- Si la tarea es clara, ejecuta directamente sin preguntar.

## Code Output
- Muestra solo el bloque modificado, no el archivo completo.
- Sin comentarios obvios en el código.
- TypeScript estricto, sin `any`.
