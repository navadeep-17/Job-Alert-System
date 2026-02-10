import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('🔍 Fetching real jobs from external API...');
    
    // Example: RemoteOK API (free, no auth required)
    const response = await fetch('https://remoteok.com/api?tag=dev');
    const data = await response.json();
    
    // Transform jobs to your schema
    const jobs = data
      .slice(1, 21) // Skip metadata, take 20 jobs
      .filter((job: any) => job.position && job.company)
      .map((job: any) => ({
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description || `Position: ${job.position} at ${job.company}`,
        category: mapCategory(job.tags || []),
        url: job.url || job.apply_url || 'https://remoteok.com',
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}k-$${job.salary_max}k` 
          : null,
        type: 'Full-time' as const,
        remote: true,
        postedAt: job.date ? new Date(job.date * 1000) : new Date()
      }));
    
    // Import to database
    const result = await prisma.job.createMany({
      data: jobs,
      skipDuplicates: true
    });
    
    console.log(`✅ Imported ${result.count} new jobs`);
    
    return NextResponse.json({ 
      success: true, 
      jobsImported: result.count,
      totalFetched: jobs.length
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

function mapCategory(tags: string[]): string {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (tagStr.includes('dev') || tagStr.includes('engineer') || tagStr.includes('backend') || tagStr.includes('frontend')) 
    return 'Software Engineering';
  if (tagStr.includes('data') || tagStr.includes('ml') || tagStr.includes('ai')) 
    return 'Data Science';
  if (tagStr.includes('design') || tagStr.includes('ux') || tagStr.includes('ui')) 
    return 'Design';
  if (tagStr.includes('product')) 
    return 'Product Management';
  if (tagStr.includes('marketing') || tagStr.includes('growth')) 
    return 'Marketing';
  
  return 'Software Engineering';
}
