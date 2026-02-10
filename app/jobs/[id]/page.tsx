import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id }
  });

  return job;
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">JobAlert</Link>
          <nav className="flex gap-6">
            <Link href="/jobs" className="hover:text-blue-600">Browse Jobs</Link>
            <Link href="/subscribe" className="hover:text-blue-600">Subscribe</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Jobs
        </Link>

        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-gray-700 font-medium">{job.company}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
              {job.category}
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
              {job.location}
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
              {job.type}
            </span>
            {job.remote && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
                Remote Available
              </span>
            )}
          </div>

          {job.salary && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-1">Salary</h3>
              <p className="text-green-600 text-xl font-semibold">{job.salary}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Job Description</h3>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          <div className="mb-6 text-sm text-gray-500">
            Posted on {new Date(job.postedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="flex gap-4">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Apply Now
            </a>
            <Link
              href="/subscribe"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition"
            >
              Get Alerts for Similar Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
