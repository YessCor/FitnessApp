# FitnessApp Backend

Servidor Express para la aplicación FitnessApp con autenticación JWT y base de datos PostgreSQL (Neon).

## Estructura del Proyecto

```
server/
├── index.js           # Punto de entrada del servidor
├── package.json        # Dependencias del servidor
├── routes/
│   ├── auth.js         # Endpoints de autenticación (register, login, me)
│   ├── progreso.js     # Endpoints de progreso (CRUD)
│   ├── perfil.js       # Endpoints de perfil físico
│   └── recomendaciones.js # Endpoints de recomendaciones con IMC
└── middleware/
    └── auth.js         # Middleware de autenticación JWT
```

## Dependencias

```bash
cd server
npm install
```

O usando pnpm:

```bash
cd server
pnpm install
```

## Configuración

Asegúrate de tener las siguientes variables de entorno en un archivo `.env`:

```
DATABASE_URL=postgresql://usuario:password@host/database
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

## Ejecutar el Servidor

```bash
npm start
```

El servidor correrá en `http://localhost:3000`

## Endpoints

### Autenticación

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener datos del usuario actual

### Perfil Físico

- `GET /perfil` - Obtener perfil físico
- `POST /perfil` - Crear perfil físico
- `PUT /perfil` - Actualizar perfil físico

### Progreso

- `GET /progreso` - Obtener historial de progreso
- `POST /progreso` - Agregar nuevo registro
- `DELETE /progreso/:id` - Eliminar registro

### Recomendaciones

- `GET /recomendaciones` - Obtener recomendaciones personalizadas (IMC, entrenamiento, nutrición)

## Frontend

La app Expo ya está configurada para comunicarse con este servidor en:
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Dispositivo físico: IP de la máquina

## Notas

- Las contraseñas se hashean con bcrypt antes de almacenarse
- El token JWT expira en 7 días
- Al crear el perfil físico, se crea automáticamente el primer registro de progreso
