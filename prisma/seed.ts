import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@example.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log('Seeded users:', { admin: admin.email, user: user.email });

  const productNames = [
    {
      name: 'Laptop Gaming',
      description: 'High performance gaming laptop',
      price: 15000000,
      stock: 10,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard',
      price: 1500000,
      stock: 25,
    },
    {
      name: 'Gaming Mouse',
      description: 'Wireless gaming mouse',
      price: 800000,
      stock: 30,
    },
    {
      name: 'Monitor 27 inch',
      description: '4K UHD monitor',
      price: 5000000,
      stock: 15,
    },
    {
      name: 'Headset Gaming',
      description: 'Surround sound headset',
      price: 1200000,
      stock: 20,
    },
    {
      name: 'Webcam HD',
      description: '1080p webcam',
      price: 500000,
      stock: 40,
    },
    {
      name: 'USB Hub',
      description: '7-port USB hub',
      price: 250000,
      stock: 50,
    },
    { name: 'SSD 1TB', description: 'NVMe SSD 1TB', price: 1500000, stock: 35 },
    { name: 'RAM 16GB', description: 'DDR4 3200MHz', price: 800000, stock: 45 },
    {
      name: 'Mousepad XL',
      description: 'Extended mousepad',
      price: 150000,
      stock: 60,
    },
  ];

  for (const product of productNames) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        ...product,
        createdBy: admin.id,
      },
    });
  }

  console.log('Seeded 10 products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
