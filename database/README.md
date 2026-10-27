# FleetCore database

The API reads database settings from `.env`. For local development, TypeORM
creates the schema at startup because `synchronize: true` is enabled.

Run `npm run seed` to insert sample users, mechanics, workshops, vehicles, and
maintenance records. The equivalent schema and sample records are documented in
[fleetcore.sql](./fleetcore.sql).

# Base de datos FleetCore

La API obtiene la configuración de la base de datos desde `.env`. Para el
desarrollo local, TypeORM crea el esquema al iniciar porque está habilitado
`synchronize: true`.

Ejecuta `npm run seed` para insertar usuarios, mecánicos, talleres, vehículos y
mantenimientos de ejemplo. El esquema y los datos de ejemplo también están en
[fleetcore.sql](./fleetcore.sql).
