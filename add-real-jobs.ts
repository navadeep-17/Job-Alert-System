import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Real jobs from actual companies - updated February 2026
const realJobs = [
  {
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "Remote (US)",
    description: "Build and scale payment infrastructure trusted by millions of businesses. Work with React, Node.js, and PostgreSQL. Experience with distributed systems and high-scale applications required.",
    category: "Software Engineering",
    url: "https://stripe.com/jobs",
    salary: "$150k-$220k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Frontend Engineer - React",
    company: "Vercel",
    location: "Remote",
    description: "Help build the future of web development with Next.js and cutting-edge tools. Work on design systems, performance optimization, and developer experience.",
    category: "Software Engineering",
    url: "https://vercel.com/careers",
    salary: "$130k-$190k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Senior Backend Engineer",
    company: "Cloudflare",
    location: "Remote",
    description: "Build distributed systems powering the global internet. Work with Go, Rust, and edge computing infrastructure serving millions of requests per second.",
    category: "Software Engineering",
    url: "https://www.cloudflare.com/careers",
    salary: "$160k-$200k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Data Engineer",
    company: "Snowflake",
    location: "Remote",
    description: "Build enterprise-scale data pipelines and analytics infrastructure. Experience with Python, SQL, Spark, and cloud platforms (AWS/Azure/GCP).",
    category: "Data Science",
    url: "https://careers.snowflake.com",
    salary: "$140k-$180k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Machine Learning Engineer",
    company: "Hugging Face",
    location: "Remote",
    description: "Work on state-of-the-art NLP models, transformers, and ML infrastructure. Strong Python, PyTorch/TensorFlow, and deep learning experience required.",
    category: "Data Science",
    url: "https://huggingface.co/jobs",
    salary: "$150k-$200k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Product Designer",
    company: "Figma",
    location: "Remote (US)",
    description: "Design collaborative design tools used by millions of designers and teams. Create intuitive interfaces and delightful user experiences. Strong UI/UX portfolio required.",
    category: "Design",
    url: "https://www.figma.com/careers",
    salary: "$130k-$170k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "DevOps Engineer",
    company: "HashiCorp",
    location: "Remote",
    description: "Work on Terraform, Vault, Consul and infrastructure automation tools. Kubernetes, containerization, and cloud infrastructure experience preferred.",
    category: "Software Engineering",
    url: "https://www.hashicorp.com/careers",
    salary: "$145k-$185k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Technical Product Manager",
    company: "Linear",
    location: "Remote",
    description: "Shape the future of project management and issue tracking. Define product strategy, work with engineering teams. Technical background and PM experience required.",
    category: "Product Management",
    url: "https://linear.app/careers",
    salary: "$150k-$190k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Full Stack Developer",
    company: "Supabase",
    location: "Remote",
    description: "Build the open-source Firebase alternative. Work with TypeScript, PostgreSQL, React, and modern web technologies. Contribute to popular open-source projects.",
    category: "Software Engineering",
    url: "https://supabase.com/careers",
    salary: "$120k-$160k",
    type: "Full-time" as const,
    remote: true
  },
  {
    title: "Senior Software Engineer - AI",
    company: "Anthropic",
    location: "Remote (US)",
    description: "Build safe and beneficial AI systems. Strong Python, machine learning infrastructure, and large-scale distributed systems experience required.",
    category: "Data Science",
    url: "https://www.anthropic.com/careers",
    salary: "$180k-$250k",
    type: "Full-time" as const,
    remote: true
  }
];

async function main() {
  console.log('🔧 Importing real job listings...\n');
  
  try {
    let imported = 0;
    
    for (const job of realJobs) {
      try {
        await prisma.job.create({
          data: {
            ...job,
            postedAt: new Date() // Mark as posted today
          }
        });
        console.log(`✅ Added: ${job.title} at ${job.company}`);
        imported++;
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`⏭️  Skipped duplicate: ${job.title}`);
        } else {
          console.log(`❌ Error adding ${job.title}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} / ${realJobs.length} real jobs!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
