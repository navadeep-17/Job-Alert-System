import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">JobAlert</h1>
          <nav className="flex gap-6">
            <Link href="/jobs" className="hover:text-blue-600">Browse Jobs</Link>
            <Link href="/subscribe" className="hover:text-blue-600">Subscribe</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Never Miss Your Dream Job
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Get personalized job alerts delivered to your inbox. Subscribe to categories you care about and stay ahead of the competition.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/subscribe"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose JobAlert?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">📧</div>
              <h4 className="text-xl font-semibold mb-2">Email Notifications</h4>
              <p className="text-gray-600">
                Receive daily digests of new jobs matching your preferences directly in your inbox.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-2">Personalized Alerts</h4>
              <p className="text-gray-600">
                Choose job categories, locations, and get only relevant opportunities.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-2">Real-time Updates</h4>
              <p className="text-gray-600">
                Be the first to know when new jobs are posted in your field of interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 JobAlert System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
