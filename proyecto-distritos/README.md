# 🗺️ CRUD de Distritos — Backend Node.js + Frontend Vite

Sistema completo de mantenimiento de la tabla `distritos` con arquitectura
desacoplada: API REST en Express y UI en Vite + Vanilla JS.

---

## 📁 Estructura de Carpetas

```
proyecto-distritos/
│
├── database.sql                  ← Script SQL (crear tabla + 30 registros)
│
├── backend/
│   ├── package.json
│   ├── .env                      ← Variables de entorno (DB_HOST, DB_USER…)
│   ├── server.js                 ← Punto de entrada Express
│   ├── config/
│   │   └── db.js                 ← Pool de conexión MySQL (mysql2/promise)
│   ├── models/
│   │   └── DistritoModel.js      ← Consultas SQL (getAll, getById, create, update, delete)
│   ├── controllers/
│   │   └── DistritoController.js ← Lógica de negocio, validaciones, paginación
│   └── routes/
│       └── distritoRoutes.js     ← Endpoints RESTful
│
└── frontend/
    ├── package.json
    ├── index.html                ← Grilla principal, buscador y paginación
    ├── nuevo.html                ← Formulario de registro
    └── src/
        ├── api.js                ← Capa de fetch (centralizada)
        ├── main.js               ← Lógica de index.html
        └── nuevo.js              ← Lógica de nuevo.html
```

---

## ⚙️ Configuración de Base de Datos

1. Abrir MySQL y ejecutar el script:

```sql
SOURCE /ruta/al/proyecto/database.sql;
```

O bien desde terminal:

```bash
mysql -u root -p < database.sql
```

2. Editar `backend/.env` con tus credenciales:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=ventas_db
```

---

## 🚀 Instalación y Ejecución

### Backend

```bash
cd backend
npm install          # Instala: express, mysql2, cors, dotenv, nodemon
npm run dev          # Servidor en http://localhost:3000  (con nodemon)
# ó
npm start            # Servidor en http://localhost:3000  (sin nodemon)
```

### Frontend

```bash
cd frontend
npm install          # Instala: vite
npm run dev          # UI en http://localhost:5173
```

> **Importante:** ambos servidores deben estar corriendo simultáneamente.

---

## 🔌 Endpoints de la API

| Método   | Ruta                   | Descripción                               |
|----------|------------------------|-------------------------------------------|
| `GET`    | `/api/distritos`       | Listar (paginación + búsqueda)            |
| `GET`    | `/api/distritos/:id`   | Obtener uno por ID                        |
| `POST`   | `/api/distritos`       | Crear nuevo distrito                      |
| `PUT`    | `/api/distritos/:id`   | Actualizar distrito existente             |
| `DELETE` | `/api/distritos/:id`   | Eliminar distrito                         |
| `GET`    | `/api/health`          | Verificar estado del servidor             |

### Parámetros de consulta para GET /api/distritos

| Param    | Tipo   | Defecto | Descripción                             |
|----------|--------|---------|-----------------------------------------|
| `page`   | number | 1       | Número de página                        |
| `limit`  | number | 10      | Registros por página (máx 100)          |
| `search` | string | ""      | Busca en id_dis, nom_dis y cod_postal   |

### Ejemplo de respuesta

```json
{
  "success": true,
  "data": [
    { "id_dis": 1, "nom_dis": "Miraflores", "cod_postal": "LIM15" },
    { "id_dis": 2, "nom_dis": "San Isidro",  "cod_postal": "LIM27" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "totalPages": 3,
    "hasPrev": false,
    "hasNext": true
  }
}
```

---

## ✅ Funcionalidades Implementadas

- **Paginación técnica**: `page` + `limit` en backend, navegación numérica en frontend
- **Buscador multicriterio**: filtra por ID, nombre o código postal con debounce (350ms)
- **CRUD completo**: Crear, Leer, Actualizar y Eliminar sin recargar la página
- **Modal de edición**: formulario inline con validación
- **Redirección post-creación**: `nuevo.html` → `index.html` con toast de confirmación
- **Manejo de errores**: mensajes de validación en frontend + códigos HTTP en backend
- **Arquitectura MVC**: Model / Controller / Route claramente separados

---

## 🧪 Probar la API con curl

```bash
# Listar página 2
curl "http://localhost:3000/api/distritos?page=2&limit=10"

# Buscar por nombre
curl "http://localhost:3000/api/distritos?search=mira"

# Crear nuevo
curl -X POST http://localhost:3000/api/distritos \
  -H "Content-Type: application/json" \
  -d '{"nom_dis":"Pachacámac","cod_postal":"LIM20"}'

# Actualizar
curl -X PUT http://localhost:3000/api/distritos/1 \
  -H "Content-Type: application/json" \
  -d '{"nom_dis":"Miraflores Editado","cod_postal":"LIM15X"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/distritos/30
```
