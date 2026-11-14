import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  MapPin,
} from "lucide-react";

interface FeaturedJob {
  title: string;
  company: string;
  location: string;
  schedule: string;
  salary: string;
  description: string;
}

const featuredJobs: FeaturedJob[] = [
  {
    title: "Senior Product Designer",
    company: "TechFlow Systems",
    location: "San Francisco, CA (Remote)",
    schedule: "Full-time",
    salary: "$140k - $180k",
    description:
      "Own end-to-end product design for complex technical workflows, from early discovery to polished, accessible UI.",
  },
  {
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    location: "New York, NY",
    schedule: "Hybrid",
    salary: "$165k - $210k",
    description:
      "Lead our web platform team, ship performant interfaces and mentor engineers building the future of fintech.",
  },
  {
    title: "Machine Learning Engineer",
    company: "CloudScale AI",
    location: "Remote (US)",
    schedule: "Full-time",
    salary: "$180k - $250k",
    description:
      "Build and deploy ranking models that power personalized job matching at scale across our global marketplace.",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="relative bg-black py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/70 px-3.5 py-1 font-mono text-xs tracking-wider text-zinc-300">
            Smart job discovery
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            The roles you’d never find by searching
          </h2>
        </div>

        {/* Job cards */}
        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <article
              key={`${job.company}-${job.title}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-950/70 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/60"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {job.company} · {job.location}
                </p>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">
                {job.description}
              </p>

              {/* Job details */}
              <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <Briefcase
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span>{job.schedule}</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <DollarSign
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span>{job.salary}</span>
                </div>
              </dl>

              <Link
                href="/jobs"
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            View all job open
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
