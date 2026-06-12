# Apuntador

Apuntador es una aplicación para Call Centers que permite a los supervisores gestionar scripts y casos comunes, y a los ejecutivos buscar rápidamente y copiar esos scripts durante sus llamadas para agilizar la atención al cliente.

## Arquitectura
- **Frontend**: React, TypeScript, Vite, Tailwind CSS. (Ubicado en `/frontend`)
- **Backend**: Node.js, Express, TypeScript, Prisma (PostgreSQL). (Ubicado en `/backend`)
- **Seguridad**: Autenticación basada en cookies HttpOnly y validación en el servidor, contraseñas hasheadas con bcrypt.

## Requisitos Previos
- Node.js (v18+)
- PostgreSQL (Instancia local o remota en ejecución)

## Instalación y Configuración

### 1. Configurar Backend
1. Navega al directorio `/backend`.
2. Instala las dependencias: `npm install`.
3. Crea un archivo `.env` basado en la configuración necesaria:
   ```env
   DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/apuntador?schema=public"
   JWT_SECRET="tu_super_secreto_aqui"
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```
4. Aplica las migraciones a tu base de datos PostgreSQL: `npx prisma migrate dev --name init`.
5. Llena la base de datos con datos de prueba: `npm run seed`.
6. Inicia el servidor de desarrollo: `npm run dev`.

### 2. Configurar Frontend
1. Navega al directorio `/frontend`.
2. Instala las dependencias: `npm install`.
3. Crea un archivo `.env` si necesitas sobreescribir la URL de la API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Inicia el servidor de desarrollo: `npm run dev`.

## Datos de Prueba (Seed)
Si corriste `npm run seed`, puedes acceder con las siguientes cuentas:
- **Supervisor**: `ana.super` / `super123` (Rol: supervisor)
- **Ejecutivo**: `pedro.ejec` / `ejec123` (Rol: ejecutivo)

## Pruebas
Para correr las pruebas unitarias del backend:
```bash
cd backend
npm test
```
