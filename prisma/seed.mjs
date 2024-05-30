// 生成数据库假数据
// Usage: npm run initdb   或者   node prisma/seed.js

import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function generateMockData() {
  // 生成假用户数据
  const admin = [
    {
      id: faker.string.uuid(),
      name: '小李',
      phone: '15827057426',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      id: faker.string.uuid(),
      name: '阿东',
      phone: '13135990604',
      password: bcrypt.hashSync('123456', 10),
    },
    {
      id: faker.string.uuid(),
      name: '小虞',
      phone: '15756230912',
      password: bcrypt.hashSync('123456', 10),
    },
  ];

  const users = [];
  // 生成假用户数据
  for (let i = 0; i < 100; i++) {
    const user = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      role: faker.helpers.arrayElement(['VIP_USER', 'NORMAL_USER']),
      status: faker.helpers.arrayElement(['Normal', 'Disabled']),
      loginCount: faker.number.int(0, 100),
      password: bcrypt.hashSync('123456', 10),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      lastLoginAt: faker.date.past(),
    };
    users.push(user);
  }

  const finances = [];
  users.forEach((user, index) => {
    const finance = {
      amount: 300,
      userId: user.id,
      createdAt: index > 20 ? faker.date.past() : undefined,
    };
    finances.push(finance);
  });

  console.log(
    users.map(({ id }) => id),
    finances,
  );

  return { users, admin, finances };
}

async function seedMockData() {
  const mockData = await generateMockData();

  await prisma.admin.createMany({ data: mockData.admin });
  await prisma.user.createMany({ data: mockData.users });
  await prisma.finance.createMany({ data: mockData.finances });

  console.log('Mock data created successfully.');
}

seedMockData()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
