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
- **npm** (gestor de paquetes) - recomendado para este proyecto
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
# Usando npm (recomendado)
npm install

# Si usas pnpm
pnpm install
```

> **Nota**: Si tienes problemas con `npm ci`, ejecuta primero `npm install` para sincronizar el `package-lock.json` con el `package.json`.

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
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web
```

### Build de Producción

```bash
# Generar APK (Android)
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## 📦 Dependencias

### Dependencias Principales

- `@expo/vector-icons`: Iconos vectoriales
- `@neondatabase/serverless`: Servidor de base de datos Neon
- `@prisma/adapter-neon`: Adaptador de Prisma para Neon
- `@prisma/adapter-pg`: Adaptador de Prisma para PostgreSQL
- `@prisma/client`: Cliente de Prisma
- `@react-navigation/bottom-tabs`: Navegación por tabs
- `@react-navigation/native`: Navegación base
- `dotenv`: Variables de entorno
- `expo`: Framework principal
- `expo-constants`: Constantes de Expo
- `expo-font`: Fuentes personalizadas
- `expo-haptics`: Retroalimentación háptica
- `expo-image`: Manejo de imágenes
- `expo-linking`: Deep linking
- `expo-router`: Sistema de rutas
- `expo-splash-screen`: Pantalla de carga
- `expo-status-bar`: Barra de estado
- `expo-symbols`: Símbolos del sistema
- `expo-system-ui`: UI del sistema
- `expo-web-browser`: Navegador web
- `pg`: Cliente PostgreSQL
- `prisma`: ORM de base de datos
- `react`: Biblioteca de UI
- `react-dom`: UI para web
- `react-native`: Componentes nativos
- `react-native-gesture-handler`: Gestos
- `react-native-reanimated`: Animaciones
- `react-native-safe-area-context`: Área segura
- `react-native-screens`: Pantallas nativas
- `react-native-web`: Compatibilidad web
- `react-native-worklets`: Worklets para animaciones

### Dependencias de Desarrollo

- `@types/react`: Tipos de React
- `eas-cli`: CLI de EAS Build
- `eslint`: Linter de código
- `eslint-config-expo`: Configuración de ESLint para Expo
- `typescript`: Lenguaje tipado

## 📁 Estructura del Proyecto

```
FitnessApp/
├── app/                    # Rutas y páginas de la aplicación
│   ├── (tabs)/            # Navegación por tabs
│   │   ├── index.tsx      # Pantalla principal (Home)
│   │   ├── exercises.tsx  # Ejercicios
│   │   ├── nutrition.tsx  # Nutrición
│   │   ├── progress.tsx   # Progreso
│   │   └── _layout.tsx    # Layout de tabs
│   ├── plan/              # Rutas de planes de entrenamiento
│   │   └── [id].tsx      # Página de detalle de plan
│   ├── exercises.tsx      # Página de ejercicios
│   ├── nutrition.tsx      # Página de nutrición
│   ├── progress.tsx       # Página de progreso
│   ├── modal.tsx          # Modal
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI (collapsible, icons)
│   ├── ExerciseCard.tsx  # Tarjeta de ejercicio
│   ├── MealCard.tsx      # Tarjeta de comida
│   ├── PlanCard.tsx      # Tarjeta de plan
│   ├── HeaderMenu.tsx    # Menú de cabecera
│   ├── FloatingTabBar.tsx# Tab bar flotante
│   └── ...               # Otros componentes
├── constants/            # Constantes y configuraciones
│   └── theme.ts         # Tema de la aplicación
├── hooks/               # Hooks personalizados
│   ├── ThemeContext.tsx  # Contexto de tema
│   ├── use-color-scheme.ts# Hook de esquema de color
│   └── use-theme-color.ts# Hook de color de tema
├── lib/                 # Utilidades y configuraciones
│   └── prisma.ts       # Cliente de Prisma
├── prisma/              # Schema y migraciones de BD
│   └── schema.prisma   # Schema de la base de datos
├── assets/              # Recursos estáticos
│   └── images/         # Imágenes e iconos
├── scripts/             # Scripts auxiliares
│   └── reset-project.js# Script de reinicio
├── package.json         # Dependencias del proyecto
├── package-lock.json    # Lock de dependencias (npm)
├── pnpm-lock.yaml      # Lock de dependencias (pnpm)
├── tsconfig.json       # Configuración de TypeScript
├── app.json           # Configuración de Expo
├── eas.json           # Configuración de EAS Build
├── prisma.config.ts   # Configuración de Prisma
└── eslint.config.js   # Configuración de ESLint
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

## 🔨 Solución de Problemas

### Error: npm ci no sincroniza con package-lock.json

Si al ejecutar `npm ci --include=dev` obtienes errores de dependencias faltantes:

```bash
npm error Missing: eas-cli@18.4.0 from lock file
npm error Missing: @expo/config@10.0.6 from lock file
# ... más errores
```

**Solución**: Ejecuta `npm install` para sincronizar el `package-lock.json` con el `package.json`:

```bash
npm install
```

Esto regenerará el archivo `package-lock.json` con todas las dependencias correctas.

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

Desarrollado por ❤️ **Brandon** y **Yessid**.

</div>
