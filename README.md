# NestJS Backend API

Backend API with NestJS + Prisma + PostgreSQL.

## Dependencies

| Package           | Version |
| ----------------- | ------- |
| @nestjs/core      | ^11.0.1 |
| @nestjs/jwt       | ^11.0.2 |
| @nestjs/passport  | ^11.0.5 |
| @prisma/client    | ^7.2.0  |
| bcrypt            | ^6.0.0  |
| class-validator   | ^0.14.3 |
| class-transformer | ^0.5.1  |
| passport-jwt      | ^4.0.1  |

## Installation

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/db_nest_app_service?schema=public"
PORT=3000
JWT_SECRET="secret"
JWT_EXPIRES_IN="7d"
```

## Scripts

| Command                                           | Description                  |
| ------------------------------------------------- | ---------------------------- |
| `npm run start:dev`                               | Development mode             |
| `npm run start:prod`                              | Production mode              |
| `npm run db:studio`                               | Prisma Studio (Database GUI) |
| `npm run db:migrate`                              | Run migration                |
| `npx ts-node prisma/seed.ts` or `npm run db:seed` | Run seeder                   |

## Seeder Accounts

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| ADMIN | admin@example.com | admin123 |
| USER  | user@example.com  | user123  |

## API Endpoints

### Auth

| Method | Endpoint                | Description   | Auth |
| ------ | ----------------------- | ------------- | ---- |
| POST   | `/api/v1/auth/register` | Register user | -    |
| POST   | `/api/v1/auth/login`    | Login user    | -    |

### Users

| Method | Endpoint                | Description               | Auth  |
| ------ | ----------------------- | ------------------------- | ----- |
| GET    | `/api/v1/users`         | Get all users (paginated) | ADMIN |
| GET    | `/api/v1/users/profile` | Get own profile           | All   |

### Products

| Method | Endpoint               | Description                  | Auth        |
| ------ | ---------------------- | ---------------------------- | ----------- |
| POST   | `/api/v1/products`     | Create product               | All         |
| GET    | `/api/v1/products`     | Get all products (paginated) | All         |
| GET    | `/api/v1/products/:id` | Get product detail           | All         |
| PATCH  | `/api/v1/products/:id` | Update product               | Owner/Admin |
| DELETE | `/api/v1/products/:id` | Delete product               | Owner/Admin |
