# Week 2 Lab — Shark Intelligence

Laboratorio técnico desarrollado dentro de **Portal Conductor** como implementación práctica de los conceptos de la Semana 2.

El laboratorio implementa un microservicio para la gestión de registros de ataques de tiburón, evolucionado con DDD, CQRS, eventos de dominio, consumidor idempotente, Google Cloud Pub/Sub, GraphQL, agregaciones MongoDB y un dashboard React de inteligencia oceánica.

## 1. Requisitos

- Docker Desktop
- Docker Compose
- Node.js 20+ (solo necesario para desarrollo sin Docker)
- Git
- Google Cloud CLI (`gcloud`) únicamente para verificar Pub/Sub

El laboratorio puede ejecutarse completamente mediante Docker Compose.

---

## 2. Ejecución rápida con Docker Compose

Desde la carpeta `week2-lab`:

```bash
docker compose up --build
````

También es válido:

```bash
docker-compose up --build
```

Servicios disponibles:

* Frontend: `http://localhost:5173`
* Backend REST: `http://localhost:3106`
* GraphQL: `http://localhost:3106/graphql`
* Health check: `http://localhost:3106/health`
* MongoDB: `mongodb://localhost:27017`
* Base de datos MongoDB: `week2_lab`

Para ejecutar en segundo plano:

```bash
docker compose up -d --build
```

Verificar contenedores:

```bash
docker compose ps
```

Ver logs del backend:

```bash
docker compose logs backend
```

---

## 3. Variables de entorno

El archivo `.env` es local y **no debe subirse al repositorio**.

Ejemplo de configuración:

```text
GCP_PROJECT_ID=durable-student-475409-g7
PUBSUB_TOPIC=neb-university-kevin-rada-gil
PUBSUB_ENABLED=true
GCP_CREDENTIALS_FILE=C:\Users\<USUARIO>\.gcp\week2-pubsub-key.json
```

El repositorio incluye `.env.example` como plantilla.

Nunca se deben almacenar en Git:

* claves JSON de Google Cloud
* tokens
* contraseñas
* credenciales
* archivos `.env` con secretos

El proyecto contiene reglas de `.gitignore` para evitar publicar estos archivos.

---

## 4. Google Cloud Pub/Sub

La integración utiliza Google Cloud Pub/Sub para publicar los eventos `SharkAttackReported`.

Configuración utilizada para la verificación:

```text
GCP Project: durable-student-475409-g7
Topic: neb-university-kevin-rada-gil
Subscription: shark-intelligence-verification
```

El backend utiliza las credenciales configuradas mediante:

```text
GOOGLE_APPLICATION_CREDENTIALS
```

dentro del contenedor.

### Crear la suscripción

Si la suscripción todavía no existe:

```bash
gcloud pubsub subscriptions create shark-intelligence-verification \
  --topic=neb-university-kevin-rada-gil \
  --project=durable-student-475409-g7
```

### Verificar mensajes publicados

Con el backend ejecutándose y `PUBSUB_ENABLED=true`:

```bash
gcloud pubsub subscriptions pull shark-intelligence-verification \
  --project=durable-student-475409-g7 \
  --auto-ack \
  --limit=10
```

La prueba funcional realizada durante la validación produjo un evento con:

```text
eventId=shark-attack-reported-999857
aggregateId=999857
aggregateType=SharkAttack
eventType=Reported
ACK_STATUS=SUCCESS
```

Esto demuestra el flujo:

```text
API
 ↓
Command Handler
 ↓
Domain Event
 ↓
Idempotent Consumer
 ↓
MongoDB
 ↓
Event Store
 ↓
Google Cloud Pub/Sub
 ↓
gcloud subscriptions pull
```

---

## 5. Health Check

Verificar que el backend y MongoDB estén disponibles:

```bash
curl http://localhost:3106/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "ms-facts-mng",
  "database": "connected"
}
```

---

## 6. REST API

Obtener los ataques almacenados:

```bash
curl http://localhost:3106/shark-attacks
```

Durante la validación local se verificó la persistencia de los registros mediante MongoDB.

### Crear un ataque

Endpoint:

```text
POST /shark-attacks
```

Ejemplo:

```bash
curl -X POST http://localhost:3106/shark-attacks \
  -H "Content-Type: application/json" \
  -d '{
    "id": 999900,
    "tipo": "Unprovoked",
    "nombre": "API Test",
    "edad": 30,
    "fecha": "2026-09-28",
    "sexo": "M",
    "ubicación": "Colombia",
    "país": "Colombia",
    "área": "Test",
    "lesión": "Test event",
    "número_de_caso": "TEST-999900",
    "número_de_caso_0": "TEST-999900",
    "año": 2026,
    "fatal_s_n": "N",
    "especie": "Unknown",
    "hora": "12:00",
    "actividad": "Testing",
    "investigador_o_fuente": "Week 2 Lab"
  }'
```

El endpoint genera un `SharkAttackReported` y lo procesa mediante el consumidor de eventos.

---

## 7. Importación

Endpoint:

```text
POST /shark-attacks/import
```

Ejemplo:

```bash
curl -X POST http://localhost:3106/shark-attacks/import
```

La importación intenta utilizar OpenDataSoft.

Cuando la fuente externa no está disponible, el laboratorio utiliza el proveedor fallback incluido en el proyecto para garantizar una ejecución reproducible.

La importación genera eventos `SharkAttackReported`.

Cada evento utiliza un identificador determinístico:

```text
shark-attack-reported-{aggregateId}
```

---

## 8. Idempotencia

El consumidor de `SharkAttackReported` utiliza `processed_events` para controlar eventos ya procesados.

La reclamación del evento se realiza mediante una operación atómica de MongoDB utilizando `eventId` como identificador único.

Esto permite que eventos repetidos o procesados concurrentemente no sean aplicados nuevamente.

El documento principal utiliza el ID estable del ataque como `_id`, evitando duplicados de la misma entidad.

Arquitectura simplificada:

```text
SharkAttackReported
        |
        v
processed_events
        |
   ¿eventId nuevo?
      /     \
    sí       no
    |         |
    v         v
persistir   ignorar
```

---

## 9. Event Store

Los eventos de dominio procesados se almacenan en `event_store`.

El evento contiene:

```text
eventId
aggregateId
aggregateType
eventType
occurredAt
payload
```

Ejemplo conceptual:

```json
{
  "eventId": "shark-attack-reported-999857",
  "aggregateId": 999857,
  "aggregateType": "SharkAttack",
  "eventType": "Reported"
}
```

---

## 10. GraphQL

Endpoint:

```text
POST http://localhost:3106/graphql
```

Consulta de estadísticas:

```bash
curl http://localhost:3106/graphql \
  -H "Content-Type: application/json" \
  --data '{"query":"{ statistics { total byCountry { country count } byYear { year count } } }"}'
```

La respuesta incluye:

```text
statistics
├── total
├── byCountry
└── byYear
```

También están disponibles:

```text
totalSharkAttacks
sharkAttacksByCountry
sharkAttacksByYear
```

Durante la validación se obtuvo correctamente una respuesta GraphQL con:

```text
total: 104
```

y agrupaciones por país y año.

---

## 11. MongoDB Aggregation Framework

Las estadísticas se calculan en MongoDB utilizando el Aggregation Framework.

El frontend no descarga todos los ataques para realizar las agregaciones localmente.

Ejemplo conceptual:

```text
GraphQL Query
     ↓
Query Handler
     ↓
MongoDB
     ↓
Aggregation Pipeline
     ↓
statistics
```

El conteo total utiliza una agregación `$count`.

---

## 12. Dashboard React

El frontend utiliza:

* React
* Apollo Client
* GraphQL
* Material UI
* Formularios y validaciones
* Dashboard de inteligencia oceánica

La aplicación consume:

```text
POST /graphql
```

para obtener las estadísticas.

Frontend:

```text
http://localhost:5173
```

---

## 13. Arquitectura

```text
                    ┌──────────────────────┐
                    │    React Dashboard   │
                    └──────────┬───────────┘
                               │
                          Apollo Client
                               │
                               ▼
                    ┌──────────────────────┐
                    │       GraphQL        │
                    └──────────┬───────────┘
                               │
                         Query Handlers
                               │
                               ▼
                         ┌───────────┐
                         │ MongoDB   │
                         └───────────┘


REST / Import
      │
      ▼
Command Handler
      │
      ▼
Domain Aggregate
      │
      ▼
SharkAttackReported
      │
      ▼
Idempotent Consumer
      │
      ├──────────────► shark_attacks
      │
      ├──────────────► processed_events
      │
      ├──────────────► event_store
      │
      └──────────────► Google Cloud Pub/Sub
```

---

## 14. Estructura general

```text
week2-lab/
├── backend/
│   └── ms-facts-mng/
├── frontend/
├── evidence/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 15. Evidencia de verificación

El directorio `evidence/` puede contener capturas o registros de ejecución que no incluyan credenciales.

Ejemplo de evidencia de Pub/Sub:

```text
evidence/pubsub-pull-success.txt
```

La evidencia debe mostrar la ejecución de:

```bash
gcloud pubsub subscriptions pull shark-intelligence-verification \
  --project=durable-student-475409-g7 \
  --auto-ack \
  --limit=1
```

y la recepción de un evento `SharkAttackReported`.

No incluir nunca archivos de credenciales en la evidencia.

---

## 16. Desarrollo sin Docker

Backend:

```bash
cd backend/ms-facts-mng
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Se requiere una instancia local de MongoDB disponible en:

```text
mongodb://localhost:27017
```

---

## 17. Verificación final

Comandos recomendados para comprobar el laboratorio:

```bash
docker compose up -d --build
docker compose ps
curl http://localhost:3106/health
curl http://localhost:3106/shark-attacks
curl http://localhost:3106/graphql
```

Para Pub/Sub:

```bash
gcloud pubsub subscriptions pull shark-intelligence-verification \
  --project=durable-student-475409-g7 \
  --auto-ack \
  --limit=10
```

El objetivo de estas pruebas es comprobar que el laboratorio puede ser levantado y verificado de forma reproducible por otra persona sin depender del entorno de desarrollo original.

---

## 18. Competencias demostradas

El laboratorio integra los siguientes conceptos de Week 2:

* Domain-Driven Design (DDD)
* Entity
* Value Object
* Aggregate
* Commands
* Command Handlers
* Queries
* Query Handlers
* CQRS
* Domain Events
* Event Store
* Idempotent Consumer
* MongoDB
* MongoDB Aggregation Framework
* REST API
* GraphQL
* Apollo Client
* RxJS
* Material UI
* Formik
* Yup
* Docker
* Docker Compose
* Google Cloud Pub/Sub
* Persistencia mediante volúmenes
* Integración frontend → backend → MongoDB
* Integración backend → Event Store → Pub/Sub

---

## 19. Seguridad

Las credenciales de Google Cloud son externas al repositorio.

No subir:

```text
.env
*.json
credentials/
secrets/
.gcp/
*.key
*.pem
```

El repositorio proporciona únicamente ejemplos y documentación para configurar el entorno.

