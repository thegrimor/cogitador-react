# CLAUDE.md — Cogitador React

Reglas y convenciones para el agente en este proyecto.

---

## Contexto del proyecto

**Dark Heresy Cogitator** — conjunto de herramientas web para el juego de rol Dark Heresy (Warhammer 40K).

El proyecto nació como 3 HTMLs standalone con estética Adeptus Mechanicus (grimdark). El objetivo es migrarlos a React manteniendo el diseño y añadiendo interactividad.

### Módulos planificados

| Módulo | Descripción | Estado |
|---|---|---|
| `ficha` | Ficha del agente/personaje | En progreso (11 tabs, la mayoría funcionales — ver detalle abajo) |
| `proyectos` | Gestor de proyectos de campaña | Funcional (grid de proyectos, panel de tiempo, stats) |
| `sequito` | Gestión del séquito (acólitos y aliados) | Funcional (layers, armería, inventario) |
| `notas` | Notas temáticas por sección (Grupo o personaje) | Funcional (persistencia backend propia) |
| `auth` | Login/registro y sesión | Funcional (backend propio en `server/`) |
| `campana` | Partidas: master (dueño) + jugadores, con vista de solo lectura de la ficha/séquito/proyectos de cada jugador | En progreso (Jugadores funcional; Mi perfil funcional; Notas grupales placeholder) |
| `admin` | Administración mínima de usuarios (rol, borrado) — solo visible para `ADMIN` | Funcional (mínimo) |

Cada módulo existe como HTML funcional previo que sirve de referencia para la migración.

### Roles y partidas

El backend maneja un `Role` global por cuenta: `ADMIN | MASTER | USER`. `MASTER` y `ADMIN` pueden crear partidas (`campana`) e incluir jugadores existentes por username/email; `ADMIN` gestiona todas las partidas, `MASTER` solo las suyas. Dentro de una partida, la ficha/séquito/proyectos de cada jugador se comparten en modo solo lectura con el resto de la partida (master incluido); la información del propio master **nunca** se comparte — no es miembro de su propia partida. La entrada "Ver la campaña" vive en el `AccountMenu` del header (junto a tema y logout), visible para cualquier rol; "Usuarios" (módulo `admin`) solo aparece para `ADMIN`.

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
    api/
      client.ts           # Cliente fetch al backend (server/), maneja token de auth
    data/
      darkheresy/         # Datos del sistema de juego (atributos, skills, talentos, carreras, poderes, equipo)
        attributes.ts     # 9 atributos base (WS, BS, S, T, Ag, Int, Per, WP, Fel)
        skills.ts         # Habilidades (Saber académico/popular/prohibido, etc.)
        talents.ts        # Talentos del libro
        careers.ts        # Carreras, rangos por PE, ítems desbloqueados por rango
        psychicPowers.ts  # Poderes psíquicos
        weapons.ts / armor.ts / gear.ts / mechadendrites.ts / augmentations.ts
        inquisidorRanks.ts
        index.ts
    store/
      store.ts            # Redux store persistido (redux-persist) — reducers: auth, ficha, proyectos, sequito, notas, campana
      hooks.ts            # useAppDispatch, useAppSelector (tipados)
      logoutFully.ts / loginFully.ts # Reset/hidratación completa de slices al cerrar/abrir sesión
    sync/
      CloudSync.tsx        # Sincroniza slices de juego con el backend tras login
      useCloudSyncResource.ts
    theme/
      themes.ts           # 25 temas de facción (Cogitador + 24 de WH40K), THEMES/DEFAULT_THEME_ID/GROUP_LABELS
  modules/
    auth/
      components/
        AuthView.tsx       # Login / registro / recuperación de contraseña
      services/
        authSlice.ts       # login, register, forgotPassword, resetPassword
        authApi.ts
      index.ts
    ficha/
      components/
        FichaView.tsx           # Contenedor principal, 11 tabs internos
        CharacterHeader.tsx     # Selector Inquisidor/Séquito (2 slots fijos) + exportar/importar
        ExperiencePanel.tsx     # Visualización y gestión de XP
        KillConfirmModal.tsx    # Confirmación de "Caído en combate"
        tabs/
          PersonajeTab.tsx        # Carrera, rango, datos de identificación
          CaracteristicasTab.tsx  # 9 atributos (antes AtributosTab)
          EstadoTab.tsx           # Heridas, destino, insania, corrupción
          HabilidadesTab.tsx      # Habilidades
          TalentosTab.tsx         # Talentos — ver TalentPickerModal
          ArmeriaTab.tsx          # Armas y armaduras
          MejorasTab.tsx          # Mecadendritas y augmentaciones
          PoderesPsiquicosTab.tsx # Poderes psíquicos
          XpTab.tsx               # Log de experiencia
          InquisidorTab.tsx       # Mejoras exclusivas de rol Inquisidor
          CaidosTab.tsx           # Historial de personajes caídos
          atributos/
            AttributeCard.tsx   # Card de atributo individual
            AttrCostTable.tsx   # Tabla de coste de mejora por atributo
            CharInfoGrid.tsx    # Grid de info del personaje
            WoundsPanel.tsx     # Panel de heridas/vida
          talentos/
            TalentPickerModal.tsx # Catálogo de talentos a pantalla completa (buscador,
                                   # secciones por rango de carrera, PE editable por fila)
      services/
        fichaSlice.ts       # Redux slice: personajes, atributos, heridas, talentos, habilidades, etc.
        fichaComputed.ts    # computeXpSpent y derivados
        fichaImportMapper.ts# Mapeo de export legacy (HTML) a Character
      types/
        fichaTypes.ts       # Character y sub-tipos (Skill, Talent, Weapon, Armor, PsychicPower, ...)
      index.ts              # Barrel export: FichaView
    proyectos/
      components/
        ProyectosView.tsx, ProjectsGrid.tsx, ProjectCard.tsx, AddProjectForm.tsx, StatsBar.tsx, TimePanel.tsx
      services/
        proyectosSlice.ts
      types/
        proyectosTypes.ts
      index.ts
    sequito/
      components/
        SequitoView.tsx, SequitoCard.tsx, LayerBoard.tsx, LayerRow.tsx, AddSeqModal.tsx, SeqEditModal.tsx,
        ItemFormModal.tsx, ItemDetailModal.tsx, BookCatalogModal.tsx
        tabs/
          ArmoryTab.tsx, InventoryTab.tsx
      services/
        sequitoSlice.ts, equipped.ts
      types/
        sequitoTypes.ts
      index.ts
    campana/
      components/
        CampanaView.tsx        # Contenedor: listado de partidas o partida activa con tabs
        CampaignList.tsx       # Listado de mis partidas + alta (solo ADMIN/MASTER)
        MemberSummaryCard.tsx  # Cabecera (username + quitar) + ProfileSections de un jugador
        ProfileSections.tsx    # Bloque solo-lectura reutilizado: ficha (personajes con nombre
                                # real, no los 2 slots vacíos) + séquito + proyectos + notas
        tabs/
          JugadoresTab.tsx     # Lista de jugadores (alta/baja si master/admin) + detalle al
                                # pinchar uno (MemberSummaryCard de ese jugador)
          MiPerfilTab.tsx      # ProfileSections con mi propio estado (lo que ven los demás)
          NotasGrupalesTab.tsx # Placeholder — sin modelo/API todavía
      services/
        campanaApi.ts     # Llamadas a /api/campaigns
        campanaSlice.ts   # Redux slice: campaigns, current, status, error
      types/
        campanaTypes.ts   # CampaignSummary, CampaignDetail, CampaignMember (subconjuntos de solo lectura)
      index.ts            # Barrel export: CampanaView, campanaReducer, resetCampana
    admin/
      components/
        UsersAdminView.tsx # Tabla de usuarios: cambiar rol / eliminar (solo ADMIN)
      services/
        adminApi.ts        # Llamadas a /api/users
      types/
        adminTypes.ts
      index.ts             # Barrel export: UsersAdminView
  shared/
    components/
      TabBar/
        TabBar.tsx        # Barra de navegación inferior (ficha / proyectos / séquito)
        index.ts          # Barrel export: TabBar, TabId
      ThemePicker/
        ThemePicker.tsx   # Dropdown selector de tema visual (agrupado por Imperium/Caos/Xenos/Otros)
        index.ts          # Barrel export: ThemePicker
      AccountMenu/         # Menú de cuenta desplegable (tema + cerrar sesión)
      Modal/                # Portal a document.body — usado por todos los modales
      ConfirmModal/ / Toast/
    hooks/
      useTheme.ts         # Estado del tema activo + persistencia en localStorage
  App.tsx                 # Tab state + screen state ('app'|'campana'|'admin'), gate de auth (token), renderiza vista activa + TabBar + ThemePicker/AccountMenu en header
  main.tsx                # Entry point: <Provider store><App /></Provider>
  index.css               # Tema Tailwind v4 + estilos base
server/                   # Backend propio (Express + Prisma) — usuarios, roles, datos de ficha/séquito/proyectos
```

Los módulos son independientes entre sí. Solo se importa desde el `index.ts` de cada módulo, nunca directamente desde sus carpetas internas.

### Estado actual del módulo `ficha`

- **Redux state funcional**: CRUD de personajes (modelo de 2 slots fijos, Inquisidor/Séquito), atributos, heridas,
  destino, insania/corrupción, habilidades, talentos, armería, mejoras, poderes psíquicos, log de XP, caídos
- **CharacterHeader**: selector de los 2 slots fijos + exportar/importar JSON (con mapeo desde export legacy)
- **11 tabs**, la mayoría funcionales: Personaje, Características, Estado, Habilidades, Talentos, Armería,
  Mejoras, Poderes Psíquicos, XP, Inquisidor, Caídos
- **TalentosTab**: listado ordenado alfabéticamente + `TalentPickerModal` (catálogo a pantalla completa,
  agrupado por rango de carrera cuando el filtro "Solo carrera" está activo) + alta manual
- **Datos del sistema** (`skills.ts`, `talents.ts`, `careers.ts`, `psychicPowers.ts`, equipo): poblados
- **Sincronización con backend**: vía `CloudSync` tras login (requiere `auth.token`)

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
- `App.tsx` también mantiene `screen: 'app' | 'campana' | 'admin'` con `useState`: cuando no es `'app'`, se oculta la `TabBar` y se renderiza `CampanaView`/`UsersAdminView` en su lugar. Se entra a esas pantallas desde el `AccountMenu` del header (`onOpenCampana`/`onOpenAdmin`), con un botón "Volver" propio de cada vista para restaurar `screen: 'app'`.
- `App.tsx` renderiza el componente de vista correspondiente al tab/screen activo
- React Router se añadirá en el futuro; la estructura de módulos está pensada para facilitar esa migración

---

## Redux Store

```typescript
// src/core/store/store.ts (persistido con redux-persist, key 'cogitador-root')
configureStore({
  reducer: {
    auth: authReducer,
    ficha: fichaReducer,
    proyectos: proyectosReducer,
    sequito: sequitoReducer,
    notas: notasReducer,
    campana: campanaReducer,
  }
})
```

- Usar siempre `useAppDispatch` y `useAppSelector` de `src/core/store/hooks.ts` (tipados)
- Cuando se añadan nuevos módulos con estado, añadir su reducer aquí
- **Todo slice nuevo necesita persistencia en backend**, no solo `redux-persist` local. Patrón "owned resource" (ver `server/src/core/factories/ownedResource.ts`): modelo Prisma `{id, userId, name, data: Json, createdAt, updatedAt}` + `service.ts`/`routes.ts` que envuelven `createOwnedResourceRouter` + registrar en `server/src/app.ts` (`/api/<recurso>`) + `hydrateX`/`resetX` en el slice + enganchar en `src/core/sync/CloudSync.tsx` vía `useCloudSyncResource`. Ver `modules/notas` como referencia completa (frontend + backend) de un slice nuevo.

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
