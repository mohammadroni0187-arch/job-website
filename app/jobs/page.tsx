import Link from "next/link";
import { Briefcase, ArrowLeft, Search } from "lucide-react";

export default async function JobsPage(props: {
  searchParams?: Promise<{ query?: string; location?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const location = searchParams?.location || "";

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Browse Jobs</h1>
              <p className="text-sm text-zinc-400">
                Explore thousands of verified job listings
              </p>
            </div>
          </div>

          {(query || location) && (
            <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
                Active Search Filters:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {query && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-medium">
                    <Search className="h-3 w-3" /> Keyword: &quot;{query}&quot;
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 text-xs font-medium">
                    Location: &quot;{location}&quot;
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-400">
            <p className="text-base font-medium text-zinc-300">
              Job listing directory is ready!
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Search query: {query || "All roles"} | Location: {location || "Any location"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
