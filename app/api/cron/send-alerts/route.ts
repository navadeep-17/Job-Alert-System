import { sendJobAlertEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all verified subscribers with their preferences
    const subscribers = await prisma.subscriber.findMany({
      where: { verified: true },
      include: {
        preferences: true,
        notifications: {
          where: { sent: false }
        }
      }
    });

    let totalEmailsSent = 0;
    const errors: string[] = [];

    // Process each subscriber
    for (const subscriber of subscribers) {
      try {
        // Find new jobs matching subscriber preferences
        const matchingJobs = await prisma.job.findMany({
          where: {
            AND: [
              {
                category: {
                  in: subscriber.preferences.map(p => p.category)
                }
              },
              {
                postedAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
              }
            ]
          },
          take: 10 // Limit to 10 jobs per email
        });

        if (matchingJobs.length === 0) {
          continue; // Skip if no matching jobs
        }

        // Check if we already have unsent notifications for these jobs
        const existingNotifications = await prisma.notification.findMany({
          where: {
            subscriberId: subscriber.id,
            jobId: { in: matchingJobs.map(j => j.id) }
          }
        });

        const existingJobIds = new Set(existingNotifications.map(n => n.jobId));
        const newJobs = matchingJobs.filter(j => !existingJobIds.has(j.id));

        if (newJobs.length === 0) {
          continue; // Skip if all jobs already notified
        }

        // Create notification records
        await prisma.notification.createMany({
          data: newJobs.map(job => ({
            subscriberId: subscriber.id,
            jobId: job.id,
            sent: false
          }))
        });

        // Send email
        const unsubscribeUrl = `${process.env.APP_URL}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        await sendJobAlertEmail(subscriber.email, newJobs, unsubscribeUrl);

        // Mark notifications as sent
        await prisma.notification.updateMany({
          where: {
            subscriberId: subscriber.id,
            jobId: { in: newJobs.map(j => j.id) }
          },
          data: {
            sent: true,
            sentAt: new Date()
          }
        });

        totalEmailsSent++;

      } catch (subscriberError) {
        console.error(`Error processing subscriber ${subscriber.email}:`, subscriberError);
        errors.push(`${subscriber.email}: ${subscriberError}`);
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent: totalEmailsSent,
      subscribersProcessed: subscribers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
