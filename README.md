# NestJS Backend API

Backend API dengan NestJS + Prisma + PostgreSQL.

## Dependencies

| Package | Version |
|---------|---------|
| @nestjs/core | ^11.0.1 |
| @nestjs/jwt | ^11.0.2 |
| @nestjs/passport | ^11.0.5 |
| @prisma/client | ^7.2.0 |
| bcrypt | ^6.0.0 |
| class-validator | ^0.14.3 |
| class-transformer | ^0.5.1 |
| passport-jwt | ^4.0.1 |

## Instalasi

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/db_nest_app_service?schema=public"
PORT=3000
JWT_SECRET="secret"
JWT_EXPIRES_IN="7d"
```

## API Endpoints

*Coming soon*
