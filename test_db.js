const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const data = await prisma.doctor_schedules.findMany();
    console.log("Data fetched:", data);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
