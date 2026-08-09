# Fuentes verificadas contra el manual (Dark Heresy 1ª ed.)

Notas de referencia para no depender de volver a subir los PDFs. Solo datos de juego
(nombres, costes, requisitos) — no se guarda el texto de ambientación ni los PDFs originales.

## Libros usados

- **Manual Básico** (core rulebook, ES) — carreras (cap. II, pág. 40-94), habilidades (cap. III,
  pág. 96-108), talentos (cap. IV), arsenal (cap. V), poderes psíquicos (cap. VI).
- **Profesiones del sector Calixis** — carrera Adepta Sororitas completa (pág. 42-51).
- **Ascension** — progresión de Inquisidor rango 9-16 (cap. III, pág. 95-98), Habilidades
  Maestras (cap. IV, pág. 101-103), Talentos de Prestigio (pág. 104-109), Talentos de Influencia
  — Protocolo/Buena Reputación/Rival/Enemigo (pág. 110-113) y Talentos de Reputación y Poder
  (pág. 114-122, mejoras nombradas tipo Belicista/Conciliador/Red de Acólitos/etc.).

## Verificado contra el código

- `src/core/data/darkheresy/skills.ts` — lista completa de Saber académico (14)/popular (10)/
  prohibido (12) según Manual Básico pág. 106-107.
- `src/core/data/darkheresy/careers.ts` `CAREER_RANKS_DATA` — Tecnosacerdote, Adepto, Clérigo,
  Guardia Imperial (Manual Básico) y Adepta Sororitas (Profesiones del sector Calixis)
  verificadas rango por rango.
- `src/core/data/darkheresy/careers.ts` `ROBUSTO_RANK_CAP_EXCEPTIONS` — tope de compras de
  Robusto/Robusta por rango, de las mismas 5 carreras.
- `src/core/data/darkheresy/inquisidorRanks.ts` — rango 9 a 16 verificado íntegro contra
  Ascension pág. 95-98 (naming "Organización Reincidente (Específica)" corregido). Las 143
  mejoras tienen descripción: Habilidades Maestras y las mejoras nombradas con texto literal del
  libro (pág. 101-122); Protocolo/Buena Reputación/Rival/Enemigo con la regla genérica de
  "Talentos de Influencia" (pág. 112-113) — el nombre del grupo entre paréntesis ya identifica a
  cuál se aplica. Se corrigió además el tipo de "Tirador Sin Igual" (es Talento de Prestigio, no
  de Influencia — estaba mal en los datos).

### Talentos de Prestigio y de Influencia — cómo funcionan (Ascension, pág. 104 y 110-113)

- **Talento de Prestigio** que "sustituye" varios talentos: comprarlo con PE cuesta el precio
  íntegro **aunque ya tengas** alguno de los talentos que sustituye (no hay descuento/reembolso).
  Solo si ya tienes **todos** los que sustituye, puedes cambiarlos por el de Prestigio **gratis**
  (sin gastar PE) — mismo mecanismo que las Habilidades Maestras.
- **Protocolo (Grupo)** — Em 30: +10 Empatía con ese grupo.
- **Buena Reputación (Grupo)** — Em 50 + Protocolo del mismo grupo: se acumula con Protocolo
  hasta +20 Empatía; también se aplica a pruebas de Influencia.
- **Rival (Grupo)**: -10 Empatía con ese grupo.
- **Enemigo (Grupo)** — requiere Rival del mismo grupo: se acumula hasta -20 Empatía.
- Ninguno de estos 4 está implementado mecánicamente en la app (solo como mejora comprable con
  su descripción) — no hay pruebas de Empatía/Influencia automatizadas.

## Pendiente de verificar (sin fuente disponible todavía)

- Arbitrador, Asesino, Granuja, Psíquico Imperial: sin `CAREER_RANKS_DATA` en la app —
  necesitarían sus tablas de carrera completas del Manual Básico (no solo Robusto).
- Adepta Sororitas: `Saber prohibido (Ordo Hereticus)` en `careers.ts` no tiene una habilidad
  exacta en `skills.ts` (solo el genérico `Ordos`) — sin confirmar si el libro usa uno más
  específico ahí.

## Tabla 4-1: Habilidades Maestras (Ascension, pág. 102-103)

Referencia para una futura implementación — no usada aún en la app.

| Habilidad Maestra | Sustituye |
|---|---|
| Maestría Académica | Lógica, Saber Académico (Todos) |
| Maestría Actuando en las Sombras | Disfraz, Engañar, Seguridad, Trucos de Manos |
| Maestría Atlética | Acrobacias, Contorsionismo, Esquivar, Nadar, Trepar |
| Maestría en Carisma | Carisma, Charlatanería, Mando |
| Maestría en Comercio | Negociar, Oficio (Mercader), Tasar |
| Maestría en Conducir | Conducir (Todos) |
| Maestría en Conocimiento de la Disformidad | Invocación, Psinisciencia, Saber Prohibido (Disformidad) |
| Maestría en Conocimiento Tecnológico | Competencia Química, Competencia Tecnológica, Demolición, Medicae |
| Maestría Criptológica | Código (Todos), Lenguaje Secreto (Todos) |
| Maestría en Decadencia | Actuar (Todos), Aguante, Jugar |
| Maestría en Investigación | Indagar, Interrogación, Intimidar |
| Maestría Lingüística | Hablar Idioma (Dialecto Nave, Dialecto Tribal, Gótico Clásico, Gótico Vulgar), Leer/Escribir, Leer Labios |
| Maestría en Maniobras | Navegación (Superficie), Rastrear, Supervivencia, Trato Animal |
| Maestría en Observación | Buscar, Escrutinio, Perspicacia |
| Maestría en Pilotar | Navegación (Estelar), Pilotar (Todos) |
| Maestría en Saber Popular | Saber Popular (Todos) |
| Maestría en Saber Prohibido | Saber Prohibido (Todos) |
| Maestría en Sigilo | Esconderse, Movimiento Silencioso, Seguimiento |

Nuevas habilidades introducidas por Ascension: `Código (Agente del Trono)` (sustituye/actualiza
`Código (Acólito)`), `Saber Prohibido (Oficio Asesinorum)`, `Lenguaje Secreto (Agente del Trono)`
(sustituye/actualiza `Lenguaje Secreto (Acólito)`) — ninguna está en `skills.ts` todavía.
