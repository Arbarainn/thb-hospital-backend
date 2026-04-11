const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      username: 'admin_thb',
      email: 'admin@rsthb.co.id',
      password_hash: '123123',
      full_name: 'Administrator RS',
      role: 'Admin'
    }
  });
  console.log('Admin user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
