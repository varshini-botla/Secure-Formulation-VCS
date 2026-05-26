import { PrismaClient, Role, FormulationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Departments
  const rd = await prisma.department.upsert({
    where: { name: 'R&D' },
    update: {},
    create: { name: 'R&D' },
  });

  const qaDep = await prisma.department.upsert({
    where: { name: 'Quality Assurance' },
    update: {},
    create: { name: 'Quality Assurance' },
  });

  // 2. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharma.com' },
    update: {},
    create: {
      email: 'admin@pharma.com',
      password,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      departmentId: rd.id,
    },
  });

  const scientist = await prisma.user.upsert({
    where: { email: 'scientist@pharma.com' },
    update: {},
    create: {
      email: 'scientist@pharma.com',
      password,
      firstName: 'Marie',
      lastName: 'Curie',
      role: Role.SCIENTIST,
      departmentId: rd.id,
    },
  });

  const qa = await prisma.user.upsert({
    where: { email: 'qa@pharma.com' },
    update: {},
    create: {
      email: 'qa@pharma.com',
      password,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.QA,
      departmentId: qaDep.id,
    },
  });

  // 3. Ingredients
  const ethanol = await prisma.ingredient.upsert({
    where: { code: 'ETH-001' },
    update: {},
    create: {
      name: 'Ethanol (99%)',
      code: 'ETH-001',
      unit: 'L',
      description: 'Used as solvent',
    },
  });

  const water = await prisma.ingredient.upsert({
    where: { code: 'WTR-001' },
    update: {},
    create: {
      name: 'Purified Water',
      code: 'WTR-001',
      unit: 'L',
      description: 'USP Grade',
    },
  });

  const aspirin = await prisma.ingredient.upsert({
    where: { code: 'ASP-500' },
    update: {},
    create: {
      name: 'Aspirin Powder',
      code: 'ASP-500',
      unit: 'kg',
      description: 'Active Pharmaceutical Ingredient',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
