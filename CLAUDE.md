# CLAUDE.md — Cogitador React

Reglas y convenciones para el agente en este proyecto.

---

## Contexto del proyecto

**Dark Heresy Cogitator** — conjunto de herramientas web para el juego de rol Dark Heresy (Warhammer 40K).

El proyecto nació como 3 HTMLs standalone con estética Adeptus Mechanicus (grimdark). El objetivo es migrarlos a React manteniendo el diseño y añadiendo interactividad.

### Módulos planificados

| Módulo | Descripción | Estado |
|---|---|---|
| `ficha` | Ficha del agente/personaje | En progreso (estructura base + AtributosTab funcional) |
| `proyectos` | Gestor de proyectos de campaña | Stub (placeholder) |
| `sequito` | Gestión del séquito (acólitos y aliados) | Stub (placeholder) |

Cada módulo existe como HTML funcional previo que sirve de referencia para la migración.

### Diseño — Sistema visual

Estética Adeptus Mechanicus. El sistema de diseño está definido en `src/index.css` como tema Tailwind v4 (`@theme`):

- **Colores clave:** `crimson` (#c41e1e), `crimson-bright` (#ff2222), `crimson-dim` (#7a0f0f), `gold` (#c8962a), `neon` (azul-verde)
- **Superficies:** `surface` (#080808), `surface-2` (#0f0f0f), `surface-3` (#161616), `surface-4` (#1e1e1e)
- **Texto:** `parchment` (#e8dcc8), `parchment-dim`
- **Bordes:** `rim` (#2a2218), `rim-2` (#4a3a28)
- **Fuentes:** Orbitron (display/títulos), Share Tech Mono (mono/body), Rajdhani (descripciones)
- **Animaciones:** `scan` (scanline), `shimmer`, `spin-slow` (20s), `pulse-mech`

### Sistema de temas (selector de estilos)

25 temas de facción (`Cogitador` por defecto + 24 de Warhammer 40K) definidos en `src/core/theme/themes.ts`. Cada uno es un set de valores CSS custom properties (`--color-*`, `--scanline-rgb`, `--vignette-rgb`, `--grid-h-rgb`, `--grid-v-rgb`). `useTheme` (`src/shared/hooks/useTheme.ts`) escribe el `data-theme` elegido en `<html>`, activando el override correspondiente en `src/index.css` (bloques `:root[data-theme="<id>"]`); persiste en `localStorage` (clave `cogitador-react-theme`). Las clases Tailwind (`bg-crimson`, `text-parchment-dim`, etc.) referencian esas variables vía `@theme` y se actualizan solas al cambiar de tema. `ThemePicker` (`src/shared/components/ThemePicker/`) es el desplegable de selección, montado en el header de `App.tsx` — replica el mismo sistema de `cogitador-consulta`.

Nota de stacking: el `<header>` usa `z-20` (por encima del `z-10` de `<main>`) para que el dropdown del `ThemePicker`, que vive dentro del header, no quede tapado por el contenido de las vistas.

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
- **Redux Toolkit 2** + `react-redux` (sin RTK Query aún)
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
      darkheresy/         # Datos del sistema de juego (atributos, skills, talentos, poderes)
        attributes.ts     # 9 atributos base (WS, BS, S, T, Ag, Int, Per, WP, Fel)
        skills.ts         # (vacío, pendiente)
        talents.ts        # (vacío, pendiente)
        psychicPowers.ts  # (vacío, pendiente)
        index.ts
    store/
      store.ts            # Redux store (reducer: ficha)
      hooks.ts            # useAppDispatch, useAppSelector (tipados)
    theme/
      themes.ts           # 25 temas de facción (Cogitador + 24 de WH40K), THEMES/DEFAULT_THEME_ID/GROUP_LABELS
  modules/
    ficha/
      components/
        FichaView.tsx           # Contenedor principal con tabs internos
        CharacterHeader.tsx     # Selector de personaje + botón crear
        CharacterCreateModal.tsx# Formulario de creación de personaje
        ExperiencePanel.tsx     # Visualización y gestión de XP
        tabs/
          AtributosTab.tsx      # Tab atributos (funcional)
          HabilidadesTab.tsx    # (vacío)
          TalentosTab.tsx       # (vacío)
          ArmeriaTab.tsx        # (vacío)
          EquipoTab.tsx         # (vacío)
          MejorasTab.tsx        # (vacío)
          PoderesPsiquicosTab.tsx # (vacío)
          XpTab.tsx             # (vacío)
          atributos/
            AttributeCard.tsx   # Card de atributo individual
            CharInfoGrid.tsx    # Grid de info del personaje
            WoundsPanel.tsx     # Panel de heridas/vida
      services/
        fichaSlice.ts     # Redux slice: addCharacter, selectCharacter,
                          # updateCharInfo, updateAttribute, updateWounds,
                          # updateFate, addXpEntry, removeXpEntry
      types/
        fichaTypes.ts     # Character, CharacterInfo, AttributeValues,
                          # VitalState, XpLogEntry
      index.ts            # Barrel export: FichaView
    proyectos/
      components/
        ProyectosView.tsx # Placeholder "HOLA MUNDO — PROYECTOS"
      index.ts
    sequito/
      components/
        SequitoView.tsx   # Placeholder "HOLA MUNDO — SÉQUITO"
      index.ts
  shared/
    components/
      TabBar/
        TabBar.tsx        # Barra de navegación inferior (ficha / proyectos / séquito)
        index.ts          # Barrel export: TabBar, TabId
      ThemePicker/
        ThemePicker.tsx   # Dropdown selector de tema visual (agrupado por Imperium/Caos/Xenos/Otros)
        index.ts          # Barrel export: ThemePicker
    hooks/
      useTheme.ts         # Estado del tema activo + persistencia en localStorage
  App.tsx                 # Tab state (useState), renderiza vista activa + TabBar + ThemePicker en header
  main.tsx                # Entry point: <Provider store><App /></Provider>
  index.css               # Tema Tailwind v4 + estilos base
```

Los módulos son independientes entre sí. Solo se importa desde el `index.ts` de cada módulo, nunca directamente desde sus carpetas internas.

### Estado actual del módulo `ficha`

- **Redux state funcional**: CRUD de personajes, gestión de atributos, heridas, puntos de destino, log de XP
- **CharacterHeader**: selector con lista desplegable + modal de creación
- **AtributosTab**: completamente funcional (CharInfoGrid + 9 AttributeCards + WoundsPanel)
- **Todos los demás tabs**: vacíos (componentes scaffold sin contenido)
- **Datos del sistema** (`skills.ts`, `talents.ts`, `psychicPowers.ts`): vacíos, pendientes de implementar

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
configureStore({
  reducer: {
    ficha: fichaReducer   // único slice actual
  }
})
```

- Usar siempre `useAppDispatch` y `useAppSelector` de `src/core/store/hooks.ts` (tipados)
- Cuando se añadan nuevos módulos con estado, añadir su reducer aquí

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
