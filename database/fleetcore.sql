-- FleetCore PostgreSQL schema and sample data.
-- Sample account passwords are stored as bcrypt hashes.

CREATE TYPE "users_role_enum" AS ENUM ('ADMIN', 'TECHNICIAN');
CREATE TYPE "vehicles_status_enum" AS ENUM ('AVAILABLE', 'IN_MAINTENANCE', 'INACTIVE');
CREATE TYPE "mechanics_status_enum" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "workshops_status_enum" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "maintenances_type_enum" AS ENUM ('PREVENTIVE', 'CORRECTIVE');
CREATE TYPE "maintenances_status_enum" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  "role" "users_role_enum" NOT NULL DEFAULT 'TECHNICIAN'
);

CREATE TABLE "vehicles" (
  "id" SERIAL PRIMARY KEY,
  "plate" varchar NOT NULL UNIQUE,
  "brand" varchar NOT NULL,
  "model" varchar NOT NULL,
  "year" integer NOT NULL,
  "mileage" integer NOT NULL DEFAULT 0,
  "status" "vehicles_status_enum" NOT NULL DEFAULT 'AVAILABLE'
);

CREATE TABLE "mechanics" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "email" varchar NOT NULL UNIQUE,
  "specialty" varchar NOT NULL,
  "status" "mechanics_status_enum" NOT NULL DEFAULT 'ACTIVE',
  "userId" integer UNIQUE REFERENCES "users" ("id")
);

CREATE TABLE "workshops" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "address" varchar NOT NULL,
  "status" "workshops_status_enum" NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE "maintenances" (
  "id" SERIAL PRIMARY KEY,
  "type" "maintenances_type_enum" NOT NULL,
  "description" varchar NOT NULL,
  "mileage" integer NOT NULL,
  "scheduledDate" timestamp NOT NULL,
  "status" "maintenances_status_enum" NOT NULL DEFAULT 'SCHEDULED',
  "workDone" text,
  "finalCost" numeric(12, 2),
  "finishedAt" timestamp,
  "finalMileage" integer,
  "vehicleId" integer NOT NULL REFERENCES "vehicles" ("id"),
  "mechanicId" integer NOT NULL REFERENCES "mechanics" ("id"),
  "workshopId" integer NOT NULL REFERENCES "workshops" ("id")
);

-- Example users created by the project seeder.
INSERT INTO "users" ("id", "email", "password", "role") VALUES
  (1, 'admin@fleetcore.test', '$2b$10$CL0DQOby4mA7YOB1JzfFTOD4EUecm6NMV6rNqiK9Z/qjc4bwXhdlq', 'ADMIN'),
  (2, 'tecnico1@fleetcore.test', '$2b$10$yDHopO6cEev8YPwGE/TXo.wPcdyQDb6Tu0gUuxrpgchAaSE7JdsnC', 'TECHNICIAN'),
  (3, 'tecnico2@fleetcore.test', '$2b$10$yDHopO6cEev8YPwGE/TXo.wPcdyQDb6Tu0gUuxrpgchAaSE7JdsnC', 'TECHNICIAN');

INSERT INTO "mechanics" ("id", "name", "email", "specialty", "status", "userId") VALUES
  (1, 'Carlos Pérez', 'mecanico1@fleetcore.test', 'Motor', 'ACTIVE', 2),
  (2, 'Laura Gómez', 'mecanico2@fleetcore.test', 'Frenos', 'ACTIVE', 3),
  (3, 'Andrés Díaz', 'mecanico3@fleetcore.test', 'Electricidad', 'INACTIVE', NULL);

INSERT INTO "workshops" ("id", "name", "address", "status") VALUES
  (1, 'Taller Central', 'Calle 10 #20-30', 'ACTIVE'),
  (2, 'Taller Norte', 'Carrera 45 #80-20', 'INACTIVE');

INSERT INTO "vehicles" ("id", "plate", "brand", "model", "year", "mileage", "status") VALUES
  (1, 'FLC001', 'Toyota', 'Hiace', 2022, 25000, 'AVAILABLE'),
  (2, 'FLC002', 'Chevrolet', 'NPR', 2021, 40000, 'AVAILABLE'),
  (3, 'FLC003', 'Hino', '300', 2020, 60000, 'IN_MAINTENANCE'),
  (4, 'FLC004', 'Ford', 'Transit', 2019, 85000, 'INACTIVE');

INSERT INTO "maintenances" (
  "id", "type", "description", "mileage", "scheduledDate", "status",
  "workDone", "finalCost", "finishedAt", "finalMileage", "vehicleId",
  "mechanicId", "workshopId"
) VALUES
  (1, 'PREVENTIVE', 'Cambio de aceite y revisión general', 24000, '2026-09-01 09:00:00',
   'COMPLETED', 'Cambio de aceite, filtros y revisión de frenos', 350000.00,
   '2026-09-01 11:00:00', 24000, 1, 1, 1),
  (2, 'CORRECTIVE', 'Revisión del sistema de transmisión', 60000, '2026-10-27 14:00:00',
   'IN_PROGRESS', NULL, NULL, NULL, NULL, 3, 2, 1);

-- Keep generated ids above the sample rows for subsequent inserts.
SELECT setval(pg_get_serial_sequence('"users"', 'id'), (SELECT MAX("id") FROM "users"));
SELECT setval(pg_get_serial_sequence('"vehicles"', 'id'), (SELECT MAX("id") FROM "vehicles"));
SELECT setval(pg_get_serial_sequence('"mechanics"', 'id'), (SELECT MAX("id") FROM "mechanics"));
SELECT setval(pg_get_serial_sequence('"workshops"', 'id'), (SELECT MAX("id") FROM "workshops"));
SELECT setval(pg_get_serial_sequence('"maintenances"', 'id'), (SELECT MAX("id") FROM "maintenances"));
