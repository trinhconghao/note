const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get all existing users
    const users = await prisma.userProfile.findMany();
    
    // Update each user to have a role if they don't have one
    for (const user of users) {
      if (!user.role) {
        await prisma.userProfile.update({
          where: { id: user.id },
          data: { role: 'USER' }
        });
        console.log(`Updated role for user ${user.email}`);
      }
    }
    
    console.log('Database sync completed successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 