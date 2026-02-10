// Fetch real jobs from GitHub Jobs API alternative or similar
// This example uses a mock structure - replace with actual API

const SUPPORTED_CATEGORIES = [
  "Software Engineering",
  "Data Science", 
  "Product Management",
  "Design",
  "Marketing",
  "Customer Support"
];

async function fetchRealJobs() {
  console.log('🔍 Fetching real jobs...\n');
  
  // Option 1: Use free APIs like:
  // - Adzuna API: https://developer.adzuna.com/
  // - USAJOBS: https://developer.usajobs.gov/
  // - RemoteOK: https://remoteok.com/api
  // - GitHub Jobs alternative: https://www.themuse.com/developers/api/v2
  
  try {
    // Example using RemoteOK (no auth required)
    const response = await fetch('https://remoteok.com/api?tag=dev');
    const jobs = await response.json();
    
    // Transform to your format
    const transformedJobs = jobs
      .slice(1, 11) // Skip first item (metadata), take 10 jobs
      .map(job => ({
        title: job.position || 'Untitled',
        company: job.company || 'Unknown Company',
        location: job.location || 'Remote',
        description: job.description || 'No description available',
        category: mapCategory(job.tags),
        url: job.url || job.apply_url || 'https://remoteok.com',
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}k-$${job.salary_max}k` 
          : null,
        type: 'Full-time',
        remote: true
      }));
    
    console.log(`✅ Found ${transformedJobs.length} jobs\n`);
    
    // Import to database
    const response2 = await fetch('http://localhost:3000/api/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: transformedJobs })
    });
    
    const result = await response2.json();
    console.log(`✅ Imported ${result.count} real jobs to database`);
    
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message);
  }
}

function mapCategory(tags = []) {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (tagStr.includes('dev') || tagStr.includes('engineer')) return 'Software Engineering';
  if (tagStr.includes('data') || tagStr.includes('ml')) return 'Data Science';
  if (tagStr.includes('design') || tagStr.includes('ux')) return 'Design';
  if (tagStr.includes('product')) return 'Product Management';
  if (tagStr.includes('marketing')) return 'Marketing';
  
  return 'Software Engineering'; // Default
}

fetchRealJobs();
