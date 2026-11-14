import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Globe,
  Headphones,
  HeartPulse,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  Settings,
  Terminal,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { getRecruiterJobs, type JobRecord } from "@/lib/jobs-api";
import { CURRENCY_SYMBOL } from "@/lib/job-options";
import DeleteJobButton from "@/components/DeleteJobButton";
import PlaceholderPage from "../[...slug]/page";

const CATEGORY_STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  "Engineering & Tech": { icon: Terminal, color: "text-sky-400" },
  "Design & Creative": { icon: Palette, color: "text-orange-400" },
  "Marketing & Sales": { icon: Megaphone, color: "text-pink-400" },
  "Finance & Accounting": { icon: Wallet, color: "text-emerald-400" },
  "Customer Support": { icon: Headphones, color: "text-violet-400" },
  "Human Resources": { icon: Users, color: "text-amber-400" },
  Operations: { icon: Settings, color: "text-cyan-400" },
  Education: { icon: GraduationCap, color: "text-indigo-400" },
  Healthcare: { icon: HeartPulse, color: "text-rose-400" },
};

const FREQUENCY_SHORT: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per week": "wk",
  "per month": "mo",
  "per year": "yr",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

function postedAgo(iso: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 60000));
  if (minutes < 60) return `Posted ${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Posted ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Posted ${days}d ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}

function isExpired(job: JobRecord) {
  return job.deadline.slice(0, 10) < new Date().toISOString().slice(0, 10);
}

function locationLabel(job: JobRecord) {
  if (job.isRemote) return job.location ? `Remote (${job.location})` : "Remote";
  return job.location;
}

export default async function ManageJobsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  // Only recruiters manage job posts; other roles keep the placeholder page.
  if (role !== "recruiter") {
    return PlaceholderPage({
      params: Promise.resolve({ role, slug: ["jobs"] }),
    });
  }

  const { session } = await requireDashboardSession("recruiter");
  const jobs = await getRecruiterJobs(session.user.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-500">
            Manage Jobs <span aria-hidden="true">›</span>{" "}
            <span className="text-indigo-400">Job Listings &amp; Postings</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Manage Job Posts
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Job Post
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-12 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-zinc-600" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-white">
            No job posts yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Post your first job to start receiving applications.
          </p>
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="mt-5 inline-flex h-9 items-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Post a job
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-zinc-900/40">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-4 font-medium">Job Title &amp; Dept</th>
                <th className="px-3 py-4 font-medium">Company &amp; Location</th>
                <th className="px-3 py-4 font-medium">Type</th>
                <th className="px-3 py-4 font-medium">Compensation</th>
                <th className="px-3 py-4 font-medium">Applicants</th>
                <th className="px-3 py-4 font-medium">Status</th>
                <th className="px-3 py-4 font-medium">Deadline</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const style = CATEGORY_STYLE[job.category] ?? {
                  icon: Briefcase,
                  color: "text-zinc-400",
                };
                const Icon = style.icon;
                const expired = isExpired(job);
                const where = locationLabel(job);

                return (
                  <tr key={job._id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 ${style.color}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {job.title}
                          </p>
                          <p className={`truncate text-xs ${style.color}`}>
                            {job.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-zinc-200">{job.company}</p>
                      {where && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                          {job.isRemote ? (
                            <Globe className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                          )}
                          {where}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-4">
                      <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300">
                        {job.type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-zinc-200">
                      {CURRENCY_SYMBOL}
                      {job.salaryMin} – {CURRENCY_SYMBOL}
                      {job.salaryMax}
                      <span className="text-zinc-500">
                        {" "}
                        / {FREQUENCY_SHORT[job.salaryFrequency] ?? job.salaryFrequency}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-zinc-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                        {job.applicantsCount ?? 0} Candidates
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                          expired
                            ? "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"
                            : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            expired ? "bg-zinc-500" : "bg-emerald-400"
                          }`}
                          aria-hidden="true"
                        />
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <p className="text-zinc-200">{formatDate(job.deadline)}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {postedAgo(job.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Update
                        </Link>
                        <DeleteJobButton id={job._id} title={job.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
