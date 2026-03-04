# 💳 Sistema de Registro de Créditos

Aplicación fullstack para el registro y gestión de créditos.

---

## Funcionalidades

- Crear créditos
- Listar créditos
- Filtrar créditos (por nombre, cédula, comercial o valor)
- Eliminar créditos
- Enviar notificación por correo al registrar un crédito

---

# Tecnologías utilizadas

## Backend
- Node.js
- Express
- PostgreSQL
- Nodemailer
- Dotenv

## Frontend
- React (Vite)
- Axios

---

# Instalación del proyecto

Clonar el repositorio:

```bash
git clone https://github.com/melvinjim/fya.git
cd fya
```

---

# Configuración Backend

Ir a la carpeta backend:

```bash
cd backend
npm install
```

## Crear archivo `.env`

Crear un archivo llamado `.env` dentro de la carpeta `backend` con el siguiente contenido:

```env
PORT=5000

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD
DB_NAME=fya_db
DB_PORT=5432

EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password
```

---

## Configuración de EMAIL_PASS

Para enviar correos con Gmail **no se debe usar la contraseña real del correo**.

Se debe generar un **App Password** desde la configuración de seguridad de Google.

### Pasos:

1. Activar verificación en dos pasos en la cuenta de Gmail.
2. Ir a “Contraseñas de aplicación”.
3. Generar una nueva contraseña para tipo “Correo”.
4. Copiar esa contraseña y usarla en el archivo `.env`.

---

## Iniciar Backend

```bash
npm start
```

El servidor correrá en:

```
http://localhost:5000
```

---

# Configuración Base de Datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE fya_db;
```

Conectarse a la base creada y ejecutar:

```sql
CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    credit_value NUMERIC NOT NULL,
    interest_rate NUMERIC NOT NULL,
    months INTEGER NOT NULL,
    commercial VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Configuración Frontend

Ir a la carpeta frontend:

```bash
cd ../frontend
npm install
npm run dev
```

La aplicación correrá en:

```
http://localhost:5173
```

---

# Endpoints disponibles

### Crear crédito
```
POST /credits
```

### Obtener créditos
```
GET /credits
```

### Eliminar crédito
```
DELETE /credits/:id
```

---

# Arquitectura

El proyecto está dividido en:

- Frontend (React)
- Backend (Node.js + Express)
- Base de datos PostgreSQL

---

# Autor

Melvin Jiménez