# Veterinaria Huellitas · Agenda de citas (full stack)

Aplicación web con **frontend y backend separados**:

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express 5 + TypeScript |
| Base de datos | MySQL (mysql2, consultas parametrizadas) |

## Funcionalidades

- **Consultar** las citas guardadas en MySQL (filtro por estado).
- **Confirmar** una cita pendiente (`PATCH /api/citas/:id/estado`).
- **Registrar una nueva cita** con el botón *+ Nueva cita* (`POST /api/citas`); aparece en la lista y queda guardada en la base de datos.
- Validaciones con mensajes visibles (campos vacíos, fecha/hora inválida, fecha pasada, horario ocupado, servidor apagado).

## Cómo ejecutarla

Requisitos: Node.js 20+ y MySQL 8 (o MariaDB) en ejecución.

### 1. Base de datos
```bash
mysql -u root -p < backend/database/schema.sql
```
Crea la base `veterinaria_db`, la tabla `citas` y 3 citas de ejemplo.

### 2. Backend (puerto 3000)
```bash
cd backend
cp .env.example .env      # en Windows: copy .env.example .env  (y pon tu contraseña de MySQL)
npm install
npm run dev
```

### 3. Frontend (puerto 5173)
```bash
# desde la raíz del proyecto
npm install
npm run dev
```
Abrir http://localhost:5173

## API

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/citas?estado=` | Lista citas (filtro opcional) | 200 · 400 |
| GET | `/api/citas/:id` | Obtiene una cita | 200 · 404 |
| POST | `/api/citas` | Registra una cita | 201 · 400 · 409 |
| PUT | `/api/citas/:id` | Modifica una cita | 200 · 400 · 404 · 409 |
| PATCH | `/api/citas/:id/estado` | Cambia el estado | 200 · 400 · 404 · 409 |
| DELETE | `/api/citas/:id` | Elimina una cita | 204 · 404 |

## Arquitectura y recorrido de una solicitud

```
Botón "Guardar cita" (AppointmentPage.tsx)
  → fetch POST (services/citasApi.ts)
  → Express: routes/cita.routes.ts
  → utils/asyncHandler.ts          (captura errores async y los envía a next)
  → controllers/cita.controller.ts (valida datos y aplica reglas de negocio)
  → repositories/cita.repository.ts (único lugar con SQL)
  → MySQL (tabla citas)
  → respuesta JSON 201
  → setCitas(...) actualiza la interfaz
```

- **routes**: asocia método + URL con un controller.
- **controller**: valida, decide qué error lanzar (`AppError`) y llama al repository.
- **repository**: ejecuta las consultas SQL con parámetros (`?`).
- **asyncHandler**: evita repetir `try/catch`; cualquier error llega a `next(error)`.
- **middlewares/error.middleware.ts**: manejo centralizado; los errores esperados (`AppError`) devuelven su mensaje y código; los inesperados devuelven 500 genérico sin exponer detalles internos.
