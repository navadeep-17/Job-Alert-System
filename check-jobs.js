const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkJobs() {
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      company: true,
      category: true,
      location: true,
      postedAt: true
    },
    orderBy: {
      postedAt: 'desc'
    }
  });
  
  console.log('\n=== JOBS IN DATABASE ===\n');
  jobs.forEach((job, idx) => {
    console.log(`${idx + 1}. ${job.title} at ${job.company}`);
    console.log(`   Category: ${job.category}`);
    console.log(`   Location: ${job.location}`);
    console.log(`   Posted: ${job.postedAt.toISOString()}`);
    console.log('');
  });
  
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentJobs = jobs.filter(j => j.postedAt >= last24Hours);
  
  console.log(`\nTotal jobs: ${jobs.length}`);
  console.log(`Jobs from last 24 hours: ${recentJobs.length}`);
  
  await prisma.$disconnect();
}

checkJobs();
