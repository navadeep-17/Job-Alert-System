import { PrismaClient } from '@prisma/client';
import { sampleJobs } from '../lib/sample-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.job.deleteMany();

  console.log('Cleared existing data');

  // Seed jobs
  for (const job of sampleJobs) {
    await prisma.job.create({
      data: job
    });
  }

  console.log(`Created ${sampleJobs.length} sample jobs`);

  // Create a test subscriber
  const testSubscriber = await prisma.subscriber.create({
    data: {
      email: 'test@example.com',
      verified: true,
      preferences: {
        create: [
          {
            category: 'Software Engineering',
            location: 'Remote',
            keywords: ['React', 'TypeScript', 'Node.js']
          },
          {
            category: 'Data Science',
            location: null,
            keywords: ['Python', 'ML']
          }
        ]
      }
    }
  });

  console.log('Created test subscriber:', testSubscriber.email);
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
