-- Caso Puerto -> Embarcacion. La base usa synchronize: false, asi que las tablas se crean aqui.
CREATE TABLE "PUERTO" (
  "ID" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "NOMBRE" varchar(120) NOT NULL
);

CREATE TABLE "EMBARCACION" (
  "ID" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "NOMBRE" varchar(120) NOT NULL,
  "ESLORA_METROS" integer NOT NULL,
  "ID_PUERTO" integer NOT NULL,
  CONSTRAINT "FK_EMBARCACION_PUERTO" FOREIGN KEY ("ID_PUERTO") REFERENCES "PUERTO" ("ID")
);

INSERT INTO "PUERTO" ("NOMBRE") VALUES ('Puerto del Mar');

INSERT INTO "EMBARCACION" ("NOMBRE", "ESLORA_METROS", "ID_PUERTO") VALUES
  ('Brisa', 6, 1),
  ('Albatros', 14, 1),
  ('Brisa · nuevo', 20, 1);

-- Consulta de comprobacion
SELECT "ID", "NOMBRE", "ESLORA_METROS", "ID_PUERTO" FROM "EMBARCACION" ORDER BY "ID";
