// 生成数据库假数据
// Usage: npm run initdb   或者   node prisma/seed.js

import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function generateMockData() {
  const users = [];
  const tags = [];
  const transactions = [];

  // 生成假用户数据
  for (let i = 0; i < 10; i++) {
    const user = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['ADMIN', 'USER']),
      password: bcrypt.hashSync('123456', 10),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
    users.push(user);
  }

  // 生成假标签数据
  for (let i = 0; i < 20; i++) {
    const tag = {
      id: faker.string.uuid(),
      userId: faker.helpers.arrayElement(users.map((user) => user.id)),
      name: faker.lorem.word(),
      icon: 'icon',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
    tags.push(tag);
  }

  // 生成假记账数据
  for (let i = 0; i < 100; i++) {
    const transaction = {
      id: faker.string.uuid(),
      amount: faker.number.float({ min: -1000, max: 1000 }),
      type: faker.helpers.arrayElement(['INCOME', 'EXPENSE']),
      tagId: faker.helpers.arrayElement(tags.map((tag) => tag.id)),
      userId: faker.helpers.arrayElement(users.map((user) => user.id)),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
    transactions.push(transaction);
  }

  return { users, tags, transactions };
}

async function seedMockData() {
  const mockData = await generateMockData();

  await prisma.user.createMany({ data: mockData.users });
  await prisma.tag.createMany({ data: mockData.tags });
  await prisma.transaction.createMany({ data: mockData.transactions });

  console.log('Mock data created successfully.');
}

seedMockData()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
