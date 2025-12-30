# NestJS Backend API

Backend API dengan NestJS + Prisma + PostgreSQL.

## Instalasi

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Jalankan migration
npx prisma migrate dev

# Start development
npm run start:dev
```

## Scripts

```bash
npm run start:dev    # Development dengan hot reload
npm run start:prod   # Production mode
npm run build        # Build project
npm run lint         # Linting
npm run test         # Unit test
npx prisma studio    # Prisma Studio (GUI database)
```

## API Endpoints
