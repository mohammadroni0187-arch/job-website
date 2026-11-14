import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";
import {
  isDashboardRole,
  requireDashboardSession,
  type DashboardRole,
} from "@/lib/dashboard-session";

function titleCase(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Protected placeholder for every sidebar sub-page that doesn't exist yet —
 * keeps navigation working instead of 404ing, and only renders for a signed-in
 * user whose role matches the URL.
 */
export default async function DashboardPlaceholderPage({
  params,
}: {
  params: Promise<{ role: string; slug: string[] }>;
}) {
  const { role: roleParam, slug } = await params;

  if (!isDashboardRole(roleParam)) {
    notFound();
  }
  const role: DashboardRole = roleParam;

  await requireDashboardSession(role);

  const section = titleCase(slug[slug.length - 1] ?? "Section");
  const path = `/dashboard/${role}/${slug.join("/")}`;

  return (
    <div className="mx-auto flex max-w-2xl">
      <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 p-8 text-center sm:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300">
          <Construction className="h-6 w-6" aria-hidden="true" />
        </span>

        <p className="mt-5 font-mono text-xs tracking-wider text-zinc-500">
          {path}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {section} is coming soon
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          This protected {role} page is reserved for the next build phase.
          Your navigation keeps working while the feature is under development.
        </p>

        <Link
          href={`/dashboard/${role}`}
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
