import prisma from "@/lib/prisma";
import Link from "next/link";

interface SearchParams {
  category?: string;
  location?: string;
  search?: string;
}

async function getJobs(searchParams: SearchParams) {
  const { category, location, search } = searchParams;
  
  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        category ? { category } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
      ]
    },
    orderBy: {
      postedAt: 'desc'
    },
    take: 50
  });

  return jobs;
}

async function getCategories() {
  const categories = await prisma.job.groupBy({
    by: ['category'],
    _count: {
      category: true
    },
    orderBy: {
      _count: {
        category: 'desc'
      }
    }
  });

  return categories;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const jobs = await getJobs(searchParams);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">JobAlert</Link>
          <nav className="flex gap-6">
            <Link href="/jobs" className="font-semibold text-blue-600">Browse Jobs</Link>
            <Link href="/subscribe" className="hover:text-blue-600">Subscribe</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Jobs</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                name="search"
                placeholder="Job title, company..."
                defaultValue={searchParams.search}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                defaultValue={searchParams.category}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category} ({cat._count.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="City, state, or remote"
                defaultValue={searchParams.location}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500 text-lg">No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                  {job.salary && (
                    <span className="text-green-600 font-semibold">{job.salary}</span>
                  )}
                </div>
                <p className="text-gray-700 font-medium mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {job.location}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {job.type}
                  </span>
                  {job.remote && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Remote
                    </span>
                  )}
                </div>
                <p className="text-gray-600 line-clamp-2">{job.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
