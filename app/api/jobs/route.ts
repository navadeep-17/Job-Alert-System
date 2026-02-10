import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  description: z.string(),
  category: z.string(),
  url: z.string().url(),
  salary: z.string().optional(),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  remote: z.boolean().default(false),
  postedAt: z.string().optional()
});

// Admin route to add jobs (in production, protect with authentication)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobData = jobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        ...jobData,
        postedAt: jobData.postedAt ? new Date(jobData.postedAt) : new Date()
      }
    });

    return NextResponse.json({ success: true, job });

  } catch (error) {
    console.error('Job creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid job data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk import jobs
export async function PUT(request: NextRequest) {
  try {
    const { jobs } = await request.json();
    
    if (!Array.isArray(jobs)) {
      return NextResponse.json(
        { error: 'Jobs must be an array' },
        { status: 400 }
      );
    }

    const validatedJobs = jobs.map(job => jobSchema.parse(job));
    
    const createdJobs = await prisma.job.createMany({
      data: validatedJobs.map(job => ({
        ...job,
        postedAt: job.postedAt ? new Date(job.postedAt) : new Date()
      })),
      skipDuplicates: true
    });

    return NextResponse.json({ 
      success: true, 
      count: createdJobs.count 
    });

  } catch (error) {
    console.error('Bulk job creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid job data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
