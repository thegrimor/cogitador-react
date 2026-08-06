# Cogitador Server

Backend de Cogitador React: usuarios, roles y datos de juego (fichas, séquito, proyectos) del usuario autenticado.

Stack: Node + Express + TypeScript + Prisma + PostgreSQL.

## Setup

```bash
cd server
npm install
cp .env.example .env   # editar DATABASE_URL / JWT_SECRET
npm run prisma:migrate # crea las tablas
npm run dev             # http://localhost:4000
```

## Autenticación

JWT por header `Authorization: Bearer <token>`. Login con username **o** email + contraseña.

- `POST /api/auth/register` — `{ username, email, password }`
- `POST /api/auth/login` — `{ identifier, password }`
- `GET /api/auth/me` — requiere token
- `POST /api/auth/forgot-password` — `{ email }`
- `POST /api/auth/reset-password` — `{ token, password }`

> **Nota:** el flujo de recuperación genera y persiste el token, pero no hay
> proveedor de email conectado todavía — el token se loguea por consola (y se
> devuelve en la respuesta fuera de `NODE_ENV=production`) para poder probar
> el flujo end-to-end. Cuando se quiera enviar el email real, conectar un
> proveedor (Resend, Nodemailer+SMTP, etc.) en `auth.service.ts`.

## Usuarios y roles

Roles: `USER` (por defecto) y `ADMIN`. Gestión en `/api/users` (requiere token):

- `GET /api/users` — solo ADMIN
- `GET /api/users/:id` — el propio usuario o ADMIN
- `PATCH /api/users/:id/role` — solo ADMIN, `{ role: 'ADMIN' | 'USER' }`
- `DELETE /api/users/:id` — solo ADMIN

## Datos de juego

Mismo CRUD en los tres recursos, cada registro pertenece al usuario que lo crea
(el dueño y un ADMIN pueden leer/editar/borrar; el resto de usuarios, no):

`/api/fichas`, `/api/sequito`, `/api/proyectos`

- `GET /` — lista lo propio
- `POST /` — `{ name, data }`
- `GET /:id`
- `PUT /:id` — `{ name?, data? }`
- `DELETE /:id`

`data` es JSON libre: ficha ya tiene su forma definida en el frontend
(`fichaTypes.ts`) pero se guarda tal cual llega, sin validar su estructura
en el backend — séquito y proyectos siguen siendo stubs en el frontend, así
que su forma queda abierta hasta que se definan esos módulos.

## Despliegue (Railway)

1. Nuevo servicio → deploy desde este repo → **Root Directory: `server`**.
   Railway detecta Node vía Nixpacks y usa `npm run build` / `npm start` (ya
   definidos en `railway.json`).
2. Añadir un plugin **PostgreSQL** al proyecto y enlazar su `DATABASE_URL`
   como variable de entorno del servicio (Railway lo ofrece como referencia,
   no hay que copiarlo a mano).
3. Variables de entorno del servicio: `JWT_SECRET`, `JWT_EXPIRES_IN`,
   `CORS_ORIGIN` (la URL del frontend desplegado). `PORT` la inyecta Railway
   solo.
4. Migraciones: `npm start` corre `prisma migrate deploy` automáticamente
   como hook `prestart` antes de arrancar — no hace falta un paso manual.
   `postinstall` corre `prisma generate` para que el cliente exista tras
   cada `npm install` del build.
5. Healthcheck configurado en `railway.json` contra `GET /health`.

Cualquier cambio de schema en local se genera con
`npm run prisma:migrate -- --name <nombre>` (esto sí requiere una Postgres
local, ver Setup) y el archivo de migración resultante se commitea — es lo
que `migrate deploy` aplica en Railway.
