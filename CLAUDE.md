# CLAUDE.md — Cogitador React

Reglas y convenciones para el agente en este proyecto.

---

## Contexto del proyecto

**Dark Heresy Cogitator** — conjunto de herramientas web para el juego de rol Dark Heresy (Warhammer 40K).

El proyecto nació como 3 HTMLs standalone con estética Adeptus Mechanicus (grimdark). El objetivo es migrarlos a React manteniendo el diseño y añadiendo interactividad.

### Módulos planificados

| Módulo | Descripción | Estado |
|---|---|---|
| `ficha` | Ficha del agente/personaje | Pendiente de migrar |
| `proyectos` | Gestor de proyectos de campaña | Pendiente de migrar |
| `sequito` | Gestión del séquito (acólitos y aliados) | Pendiente de migrar |

Cada módulo existe como HTML funcional previo que sirve de referencia para la migración.

### Diseño — Sistema visual

Estética Adeptus Mechanicus. El sistema de diseño está definido en `src/index.css` como tema Tailwind v4:

- **Colores clave:** `crimson` (#c41e1e), `gold` (#c8962a), `surface` (#080808), `parchment` (#e8dcc8)
- **Fuentes:** Orbitron (display/títulos), Share Tech Mono (mono/body), Rajdhani (descripciones)
- **Efectos:** scanline animado, grid de fondo, halo rojo superior, shimmer

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

- React 19 + Vite + TypeScript
- Tailwind CSS (utility classes estándar)
- Redux Toolkit + Redux Toolkit Query
- React Router v7
- Jest + React Testing Library
- ESLint + Prettier

---

## Estructura de proyecto

Arquitectura modular inspirada en DDD. Cada módulo representa un bounded context independiente.

```
src/
  modules/
    [feature]/
      components/     # UI del módulo (PascalCase)
      hooks/          # Custom hooks (camelCase)
      services/       # Lógica de negocio
      types/          # Interfaces y tipos TypeScript
      utils/          # Helpers
      index.ts        # API pública del módulo (barrel export)
  shared/
    components/       # UI reutilizable entre módulos
    hooks/
    utils/
    types/
  core/
    config/
    constants/
  App.tsx
  main.tsx
```

Los módulos son independientes entre sí. Solo se importa desde el `index.ts` de cada módulo, nunca directamente desde sus carpetas internas.

### Tests

Los tests siguen la misma estructura que el código:

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
- **Hooks, utils, services, types**: camelCase (`useAuthStore.ts`, `formatDate.ts`)
- **Imports**: usar siempre path aliases con `@/` (ej: `@/modules/auth/components/Login`)
- **Estilos**: Tailwind utility classes estándar
- **Formato**: Prettier con la configuración del proyecto

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
- Formatear con Prettier
- Escribir tests del módulo en curso

### Git — esperar confirmación explícita
**El agente nunca hace `git add`, `git commit`, `git push` ni ninguna operación git sin que el usuario lo pida explícitamente.** Esto incluye commits de documentación, configuración o cualquier otro tipo.
