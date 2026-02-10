import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function importRealJobs() {
  console.log('🔍 Fetching real jobs from RemoteOK...\n');
  
  try {
    const response = await fetch('https://remoteok.com/api?tag=dev');
    const data = await response.json();
    
    console.log(`📥 Received ${data.length} items from API`);
    
    // Skip first item (metadata)
    const jobs = data.slice(1, 21);
    
    console.log(`🔧 Processing ${jobs.length} jobs...\n`);
    
    let imported = 0;
    
    for (const job of jobs) {
      try {
        if (!job.position || !job.company) continue;
        
        const jobData = {
          title: job.position,
          company: job.company,
          location: job.location || 'Remote',
          description: job.description || `${job.position} position at ${job.company}`,
          category: mapCategory(job.tags || []),
          url: job.url || job.apply_url || 'https://remoteok.com',
          salary: job.salary_min && job.salary_max 
            ? `$${job.salary_min}k-$${job.salary_max}k` 
            : null,
          type: 'Full-time',
          remote: true,
          postedAt: job.date ? new Date(job.date * 1000) : new Date()
        };
        
        await prisma.job.create({ data: jobData });
        console.log(`✅ Added: ${jobData.title} at ${jobData.company}`);
        imported++;
        
      } catch (error) {
        // Skip duplicates or invalid entries
        if (!error.message.includes('Unique constraint')) {
          console.log(`⚠️  Skipped job: ${error.message}`);
        }
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} real jobs!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function mapCategory(tags) {
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

importRealJobs();
