# Friki Shop Backend

Backend API desarrollado con NestJS y Prisma para la tienda Friki Shop.

## Características

- **Framework**: NestJS
- **Base de datos**: PostgreSQL con Prisma ORM
- **Validación**: class-validator y class-transformer
- **CORS**: Configurado para comunicación con frontend

## Módulos disponibles

- **Products**: Gestión de productos (CRUD, búsqueda, filtros)
- **Cart**: Carrito de compras
- **Orders**: Gestión de órdenes
- **Sections**: Secciones de la página principal

## Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tu configuración de base de datos.

3. **Configurar base de datos**:
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones (si las tienes)
   npx prisma migrate dev
   
   # O hacer push del schema
   npx prisma db push
   ```

4. **Ejecutar el servidor**:
   ```bash
   # Desarrollo
   npm run start:dev
   
   # Producción
   npm run build
   npm run start:prod
   ```

## Endpoints API

Todos los endpoints están prefijados con `/api`:

### Products
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/search` - Buscar productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Cart
- `GET /api/cart?userId=:userId` - Obtener carrito del usuario
- `POST /api/cart` - Agregar item al carrito
- `PATCH /api/cart/:productId?userId=:userId` - Actualizar cantidad
- `DELETE /api/cart/:productId?userId=:userId` - Eliminar item
- `DELETE /api/cart?userId=:userId` - Limpiar carrito

### Orders
- `GET /api/orders?userId=:userId` - Obtener órdenes del usuario
- `GET /api/orders` - Obtener todas las órdenes (admin)
- `GET /api/orders/stats` - Estadísticas de órdenes
- `POST /api/orders` - Crear orden
- `PATCH /api/orders/:id/status` - Actualizar estado de orden

### Sections
- `GET /api/sections` - Obtener todas las secciones
- `POST /api/sections` - Crear sección
- `PATCH /api/sections/:id` - Actualizar sección
- `DELETE /api/sections/:id` - Eliminar sección

## Migración desde Next.js

Este backend reemplaza las rutas API de Next.js. Para migrar:

1. **Actualizar URLs en el frontend**: Cambiar de `/api/...` a `http://localhost:3001/api/...`
2. **Configurar variables de entorno**: Usar la misma `DATABASE_URL`
3. **Migrar datos**: Si es necesario, usar las migraciones de Prisma

## Desarrollo

```bash
# Modo desarrollo con hot reload
npm run start:dev

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
```

El servidor se ejecuta en `http://localhost:3001` por defecto.