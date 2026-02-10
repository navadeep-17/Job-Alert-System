const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubscribers() {
  const subscribers = await prisma.subscriber.findMany({
    include: {
      preferences: true
    }
  });
  
  console.log('\n=== SUBSCRIBERS ===\n');
  subscribers.forEach((sub, idx) => {
    console.log(`${idx + 1}. Email: ${sub.email}`);
    console.log(`   Verified: ${sub.verified ? '✅ YES' : '❌ NO'}`);
    console.log(`   Categories: ${sub.preferences.map(p => p.category).join(', ')}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkSubscribers();
