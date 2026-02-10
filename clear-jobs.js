const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearSampleJobs() {
  console.log('🗑️  Clearing sample jobs...');
  
  // Delete sample jobs (keep subscribers)
  await prisma.notification.deleteMany();
  await prisma.job.deleteMany();
  
  console.log('✅ Sample jobs cleared!');
  console.log('\nNow run: node fetch-real-jobs.js');
  
  await prisma.$disconnect();
}

clearSampleJobs();
