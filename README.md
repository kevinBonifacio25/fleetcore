# FleetCore API

FleetCore is a REST API for managing vehicles, mechanics, workshops, and maintenance.
It is built with NestJS, TypeScript, PostgreSQL, TypeORM, JWT, and Swagger.

## Run with Docker (recommended)

Docker Desktop (Windows/macOS) or Docker Engine with the Compose plugin (Linux) is
the only requirement. These commands work in PowerShell, Command Prompt, macOS
Terminal, Linux terminals, and WSL:

```sh
docker compose up --build
```

The first run builds the API image and starts PostgreSQL. TypeORM creates the
tables when the API connects. Open Swagger at <http://localhost:3000/docs>.

To load the sample accounts and records, open another terminal and run:

```sh
docker compose exec api npm run seed
```

Stop the services with `Ctrl+C`, or run `docker compose down`. The database is
kept in the `fleetcore-data` Docker volume. To remove the containers and that
data, run `docker compose down -v`.

Optional settings can be placed in a root `.env` file. Start from `.env.example`.
For example, set `PORT` to change the host port and set database/JWT values for
your local environment. The defaults in Compose are for local development only.

## Run without Docker

Requirements: Node.js 20 or newer and PostgreSQL.

1. Create a PostgreSQL database named `fleetcore`.
2. Copy `.env.example` to `.env` and set the database connection values.
3. Install dependencies with `npm install`.
4. Start the API in development mode with `npm run start:dev`.
5. In another terminal, insert the sample records with `npm run seed`.
6. Open Swagger at <http://localhost:3000/docs>.

## Sample accounts

The seeder creates these local test accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fleetcore.test` | `Admin123!` |
| Technician | `tecnico1@fleetcore.test` | `Tecnico123!` |
| Technician | `tecnico2@fleetcore.test` | `Tecnico123!` |

These are development credentials; do not use them in a public or production
environment.

## API overview

- `POST /api/auth/register` and `POST /api/auth/login`
- `/api/vehicles`
- `/api/mechanics`
- `/api/workshops`
- `/api/maintenances`
- `GET /api/maintenances/my-schedule`
- `GET /api/integration/fleet-summary` (requires the `x-api-key` header)

The mechanic creation endpoint is `POST /api/mechanics` and requires an admin
Bearer token. Provide `name`, `email`, and `specialty`; `status` and `userId` are
optional. Duplicate mechanic emails or linked users return a conflict response,
and an unknown `userId` returns not found.

## Database and tests

The entity definitions and an SQL snapshot with the schema and example records
are in `src/modules` and [database/fleetcore.sql](database/fleetcore.sql).
`synchronize: true` is enabled for local development. Use migrations rather than
automatic synchronization in production.

Run unit tests with:

```sh
npm test
```

## Developer

- **Name:** Kevin Bonifacio
- **Clan:** Node/NestJs/AM

---

# FleetCore API (Español)

FleetCore es una API REST para administrar vehículos, mecánicos, talleres y
mantenimientos. Está construida con NestJS, TypeScript, PostgreSQL, TypeORM, JWT
y Swagger.

## Ejecutar con Docker (recomendado)

Solo necesitas Docker Desktop (Windows/macOS) o Docker Engine con el complemento
Compose (Linux). Estos comandos funcionan en PowerShell, Símbolo del sistema,
Terminal de macOS, terminales de Linux y WSL:

```sh
docker compose up --build
```

La primera ejecución construye la imagen de la API e inicia PostgreSQL. TypeORM
crea las tablas al conectar la API. Abre Swagger en
<http://localhost:3000/docs>.

Para cargar las cuentas y registros de ejemplo, abre otra terminal y ejecuta:

```sh
docker compose exec api npm run seed
```

Detén los servicios con `Ctrl+C` o ejecuta `docker compose down`. La base de
datos se conserva en el volumen Docker `fleetcore-data`. Para eliminar los
contenedores y esos datos, ejecuta `docker compose down -v`.

Puedes configurar valores opcionales en un archivo `.env` en la raíz. Usa
`.env.example` como punto de partida. Por ejemplo, cambia `PORT` para cambiar el
puerto visible en el equipo, o configura la conexión a la base de datos y JWT.
Los valores predeterminados de Compose son solo para desarrollo local.

## Ejecutar sin Docker

Requisitos: Node.js 20 o superior y PostgreSQL.

1. Crea una base de datos PostgreSQL llamada `fleetcore`.
2. Copia `.env.example` como `.env` y configura la conexión a la base de datos.
3. Instala las dependencias con `npm install`.
4. Inicia la API en modo desarrollo con `npm run start:dev`.
5. En otra terminal, carga los datos de ejemplo con `npm run seed`.
6. Abre Swagger en <http://localhost:3000/docs>.

## Cuentas de ejemplo

El seeder crea estas cuentas locales de prueba:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@fleetcore.test` | `Admin123!` |
| Técnico | `tecnico1@fleetcore.test` | `Tecnico123!` |
| Técnico | `tecnico2@fleetcore.test` | `Tecnico123!` |

Son credenciales de desarrollo; no las uses en un entorno público o productivo.

## Resumen de la API

- `POST /api/auth/register` y `POST /api/auth/login`
- `/api/vehicles`
- `/api/mechanics`
- `/api/workshops`
- `/api/maintenances`
- `GET /api/maintenances/my-schedule`
- `GET /api/integration/fleet-summary` (requiere la cabecera `x-api-key`)

El endpoint para crear mecánicos es `POST /api/mechanics` y requiere un token
Bearer de administrador. Envía `name`, `email` y `specialty`; `status` y `userId`
son opcionales. Un correo de mecánico o usuario ya vinculado devuelve un
conflicto, y un `userId` inexistente devuelve no encontrado.

## Base de datos y pruebas

Las entidades y un archivo SQL con el esquema y datos de ejemplo están en
`src/modules` y [database/fleetcore.sql](database/fleetcore.sql). La opción
`synchronize: true` está activa para desarrollo local. En producción se
recomienda usar migraciones en lugar de la sincronización automática.

Ejecuta las pruebas unitarias con:

```sh
npm test
```

## Desarrollador

- **Nombre:** Kevin Bonifacio
- **Clan:** Node/NestJs/AM
