# 💪 FitnessApp

Una aplicación móvil de fitness construida con React Native y Expo, diseñada para ayudarte a rastrear tus ejercicios, nutrición, progreso y planificar tus rutinas de entrenamiento.

## 📱 Características

- **Ejercicios**: Explora y gestiona tu biblioteca de ejercicios con información detallada
- **Nutrición**: Registra tus comidas y sigue tu alimentación diaria
- **Progreso**: Visualiza tu evolución con gráficos y estadísticas
- **Planes**: Crea y sigue planes de entrenamiento personalizados
- **Diseño Responsivo**: Interfaz adaptativa que funciona en Android e iOS

## 🛠️ Tecnologías

- **Framework**: [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Navegación**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Base de Datos**: [Prisma](https://www.prisma.io/) + [Neon](https://neon.tech/) (PostgreSQL)
- **Estilos**: React Native con soporte para temas claros/oscuros
- **UI Components**: Componentes personalizados y [Expo Vector Icons](https://icons.expo.fyi/)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **pnpm** (gestor de paquetes recomendado) o npm/yarn
- **Expo CLI**: `npm install -g expo`
- **Android Studio** (para desarrollo Android) o Xcode (para iOS)
- **Cuenta en [Neon](https://neon.tech/)** (para la base de datos PostgreSQL)

## 🚀 Instalación

1. **Clona el repositorio**

```bash
git clone <url-del-repositorio>
cd FitnessApp
```

2. **Instala las dependencias**

```bash
pnpm install
# o
npm install
```

3. **Configura las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL de conexión a tu base de datos Neon
DATABASE_URL="postgresql://usuario:contraseña@host.neon.tech/dbname?sslmode=require"
```

4. **Configura Prisma**

Genera el cliente de Prisma:

```bash
npx prisma generate
```

Aplica las migraciones a tu base de datos:

```bash
npx prisma migrate dev
```

## ▶️ Ejecución

### Desarrollo

```bash
# Iniciar el servidor de desarrollo
pnpm start

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios

# Ejecutar en Web
pnpm web
```

### Build de Producción

```bash
# Generar APK (Android)
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## 📁 Estructura del Proyecto

```
FitnessApp/
├── app/                    # Rutas y páginas de la aplicación
│   ├── (tabs)/            # Navegación por tabs
│   │   ├── index.tsx      # Pantalla principal (Home)
│   │   └── _layout.tsx    # Layout de tabs
│   ├── plan/              # Rutas de planes de entrenamiento
│   ├── exercises.tsx      # Página de ejercicios
│   ├── nutrition.tsx      # Página de nutrición
│   ├── progress.tsx       # Página de progreso
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   ├── ExerciseCard.tsx  # Tarjeta de ejercicio
│   ├── MealCard.tsx     # Tarjeta de comida
│   └── PlanCard.tsx     # Tarjeta de plan
├── constants/            # Constantes y configuraciones
│   └── theme.ts         # Tema de la aplicación
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuraciones
│   └── prisma.ts       # Cliente de Prisma
├── prisma/              # Schema y migraciones de BD
│   └── schema.prisma   # Schema de la base de datos
├── assets/              # Recursos estáticos
└── package.json         # Dependencias del proyecto
```

## 🔧 Configuración de Base de Datos

### Schema de Prisma

El proyecto utiliza los siguientes modelos:

- **User**: Usuarios de la aplicación
- **Exercise**: Ejercicios disponibles
- **Meal**: Comidas registradas
- **Plan**: Planes de entrenamiento
- **Progress**: Registros de progreso

### Migraciones

Para crear una nueva migración después de modificar el schema:

```bash
npx prisma migrate dev --name nombre_de_migracion
```

## 📱 Screenshots

| Home | Ejercicios | Nutrición | Progreso |
|------|------------|-----------|----------|
| ![Home](./assets/images/react-logo.png) | ![Exercises](./assets/images/react-logo.png) | ![Nutrition](./assets/images/react-logo.png) | ![Progress](./assets/images/react-logo.png) |

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commitea tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

<div align="center">

Hecho con ❤️ por Yess.

</div>
