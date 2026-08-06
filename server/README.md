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
