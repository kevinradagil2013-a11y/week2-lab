# Week 2 / Entregable 3 — Shark Intelligence

Laboratorio técnico desarrollado dentro de **Portal Conductor** como implementación práctica de los conceptos de la Semana 2.

El laboratorio implementa un microservicio para la gestión de registros de ataques de tiburón, evolucionado con DDD, CQRS, eventos de dominio, consumidor idempotente, Google Cloud Pub/Sub, GraphQL, agregaciones MongoDB y un dashboard React de inteligencia oceánica.

## Ejecución local

Desde `week2-lab`:

```bash
docker compose up --build
```

Servicios:

- Backend REST/GraphQL: `http://localhost:3106`
- GraphQL: `POST http://localhost:3106/graphql`
- Frontend: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017`, base `week2_lab`

Para desarrollo sin Docker, instala las dependencias dentro de `backend/ms-facts-mng` y `frontend`, ejecuta MongoDB local y usa `npm run dev` en backend y `npm run dev -- --host 0.0.0.0` en frontend.

## Variables de entorno

El backend acepta:

```text
PORT=3106
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=week2_lab
GCP_PROJECT_ID=nebulae-lab
PUBSUB_TOPIC=neb-university-kevin-rada-gil
PUBSUB_ENABLED=false
```

`PUBSUB_ENABLED=false` permite trabajar localmente sin credenciales GCP. Para publicación real, establecer `PUBSUB_ENABLED=true` y proporcionar Application Default Credentials fuera del repositorio:

```bash
gcloud auth application-default login
gcloud config set project nebulae-lab
```

No se deben guardar claves JSON, tokens ni secretos en este proyecto.

## Importación e idempotencia

```bash
curl -X POST http://localhost:3106/shark-attacks/import
```

La importación intenta OpenDataSoft y conserva el fallback CSV de 100 registros. Cada registro produce un `SharkAttackReported` con `eventId` determinístico basado en el ID del ataque. El consumidor persiste en `shark_attacks`, registra el evento en `event_store` y usa `processed_events` con índice único sobre `eventId` para ignorar eventos repetidos.

La capacidad de repetir la importación sin duplicar documentos depende de la identidad estable `sharkAttack.id`, almacenada como `_id` en MongoDB.

## GraphQL

Ejemplo:

```bash
curl http://localhost:3106/graphql \
  -H "Content-Type: application/json" \
  --data '{"query":"{ statistics { total byCountry { country count } byYear { year count } } }"}'
```

También están disponibles `totalSharkAttacks`, `sharkAttacksByCountry` y `sharkAttacksByYear`. Las estadísticas se calculan mediante MongoDB Aggregation Framework; React no descarga todos los ataques para agregarlos localmente.

## Pub/Sub

Configuración del entregable:

- Proyecto: `nebulae-lab`
- Topic: `neb-university-kevin-rada-gil`

Crear una suscripción desde un entorno autenticado, si todavía no existe:

```bash
gcloud pubsub subscriptions create shark-intelligence-verification \
  --topic=neb-university-kevin-rada-gil \
  --project=nebulae-lab
```

Activar el publisher en el backend con `PUBSUB_ENABLED=true` y verificar mensajes:

```bash
gcloud pubsub subscriptions pull shark-intelligence-verification \
  --project=nebulae-lab \
  --auto-ack \
  --limit=10
```

La publicación y la persistencia se inician en paralelo dentro de `SharkAttackReportedConsumer` mediante `Promise.all`.

## Arquitectura

```text
ImportSharkAttacksCommand
  → ImportSharkAttacksHandler
  → SharkAttackReported
  → SharkAttackReportedConsumer
  → processed_events / shark_attacks / event_store
  → Google Pub/Sub

Query
  → Query Handler
  → MongoDB

React Dashboard
  → Apollo Client
  → POST /graphql
  → Statistics Query Handler
  → MongoDB Aggregation Framework
```

---

# 1. Objetivo

El objetivo del laboratorio es demostrar de forma práctica las competencias técnicas de Week 2:

- Modelado DDD.
- Entity, Value Object y Aggregate.
- Backend orientado a dominio.
- Commands y Handlers.
- CRUD completo.
- MongoDB.
- Integración con API externa.
- Event Sourcing.
- RxJS.
- Material UI.
- Formik.
- Yup.
- Docker.
- Docker Compose.
- Persistencia mediante volúmenes.
- Integración funcional frontend → backend → MongoDB.

El laboratorio se encuentra aislado dentro del proyecto principal:

```text
portal-conductor/
└── week2-lab/