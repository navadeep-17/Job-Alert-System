const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNotifications() {
  const notifications = await prisma.notification.findMany({
    include: {
      subscriber: {
        select: { email: true }
      },
      job: {
        select: { title: true, company: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  console.log('\n=== NOTIFICATIONS ===\n');
  notifications.forEach((notif, idx) => {
    console.log(`${idx + 1}. To: ${notif.subscriber.email}`);
    console.log(`   Job: ${notif.job.title} at ${notif.job.company}`);
    console.log(`   Sent: ${notif.sent ? '✅ YES' : '❌ NO'}`);
    if (notif.sentAt) console.log(`   Sent At: ${notif.sentAt}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkNotifications();
