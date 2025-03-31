# Servicio de Optimización de Rutas Logísticas

API para optimización y gestión de rutas logísticas en tiempo real, considerando múltiples factores como tráfico, clima, capacidad de vehículos y SLAs de entrega.

## Descripción del Servicio

Este microservicio implementa una solución escalable para la optimización de rutas de entrega que permite:

- **Calcular rutas óptimas** considerando ubicación de transportistas, condiciones de tráfico/clima y capacidad de carga
- **Replanificar rutas en tiempo real** ante eventos inesperados
- **Priorizar entregas** basadas en SLAs y criticidad
- **Gestionar eventos inesperados** que afectan la operación logística

## Endpoints Principales

- `GET /rutas-optimizadas/{idEquipo}` - Consultar ruta optimizada para un equipo
- `POST /rutas-optimizadas/calcular` - Calcular una nueva ruta óptima
- `POST /rutas-optimizadas/replanificar` - Replanificar una ruta por evento inesperado
- `POST /rutas-optimizadas/eventos` - Registrar un evento inesperado

## Tecnologías Implementadas

- **Backend**: Node.js + TypeScript
- **Arquitectura**: Clean Architecture + SOLID
- **Base de Datos**: PostgreSQL con extensión PostGIS para datos geoespaciales
- **Caching**: Redis para optimización de rendimiento
- **Mensajería**: Kafka para manejo de eventos asíncronos
- **Testing**: Jest con cobertura >85%
- **Autenticación**: JWT/OAuth 2.0
- **Documentación**: Swagger/OpenAPI

## Estructura del proyecto

```
├── 📁 src
│   ├── 📁 common
│   │   ├── 📁 dependencies
│   │   ├── 📁 http
│   │   ├── 📁 logger
│   │   └── ...
│   ├── 📁 infraestructure
│   │   ├── 📁 app
│   │   │   ├── 📁 events
│   │   │   ├── 📁 server
│   │   ├── 📁 db
│   │   │   ├── 📁 adapter
│   │   │   ├── 📁 dao
│   ├── 📁 modules
│   │   ├── 📁 RutasOptimizadas
│   │   │   ├── 📁 controllers
│   │   │   ├── 📁 dependencies
│   │   │   ├── 📁 domain
│   │   │   │   ├── 📁 entities
│   │   │   │   ├── 📁 repositories
│   │   │   │   ├── 📁 types
│   │   │   ├── 📁 usecase
│   │   │   │   ├── 📁 dto
│   │   │   │   │   ├── 📁 in
│   │   │   │   │   ├── 📁 out
│   │   │   │   ├── 📁 services
│   │   ├── 📁 shared
└── test
```

## Requerimientos

- Node.js 18+ LTS
- PostgreSQL 13+ con extensión PostGIS
- Redis 6+
- Kafka (opcional para procesamiento de eventos)

## Primeros pasos

### Instalación de dependencias

```zsh
yarn
```

### Preparación del Entorno

Configurar variables de ambiente en el archivo `.env`:

```
# Configuración básica
PORT=8080
NODE_ENV=development

# Logging
DOMAIN='logistica'
PREFIX_LOGGER='rutas_optimizadas'
LOGGER_LEVEL='info'

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=logistica
DB_SCHEMA=logistica

# Cache
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenRouteService API
ORS_API_KEY=your_api_key
ORS_API_URL=https://api.openrouteservice.org

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1h
```

### Base de datos

El servicio requiere una base de datos PostgreSQL con la extensión PostGIS. Puede inicializarla con:

```zsh
yarn db:init
```

### Ejecutar el proyecto

```zsh
# Modo desarrollo con hot-reload
yarn dev

# Producción
yarn build
yarn start
```

El servidor estará disponible en:
- API: http://localhost:8080/api/v1
- Documentación: http://localhost:8080/docs

## Características principales

- **Alta escalabilidad**: Diseñado para manejar millones de envíos diarios
- **Baja latencia**: Tiempos de respuesta <500ms mediante caching optimizado
- **Resiliencia**: Manejo de fallos y estrategias de retry
- **Seguridad**: Implementación de JWT, validación de parámetros y protección OWASP
- **Observabilidad**: Logs estructurados y métricas para monitoreo

## Testing

```zsh
# Ejecutar tests unitarios e integración
yarn test

# Ver cobertura de código
yarn coverage
```

## Documentación

La documentación detallada de la API está disponible mediante Swagger en ruta `/docs` del servidor.

## Scripts

### build

```zsh
# Compilar el proyecto
yarn build
```

### dev

```zsh
# Ejecutar en modo desarrollo
yarn dev
```

### test

```zsh
# Ejecutar tests
yarn test
```

### coverage

```zsh
# Verificar cobertura de tests
yarn coverage
```

---

Para más información sobre decisiones técnicas y arquitectura, revisar el documento de [Justificación Técnica](./docs/justificacion-tecnica.md).
