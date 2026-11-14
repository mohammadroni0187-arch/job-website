import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  Mail,
  PlusCircle,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  isDashboardRole,
  requireDashboardSession,
  type DashboardRole,
} from "@/lib/dashboard-session";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const ROLE_CONTENT: Record<
  DashboardRole,
  { label: string; blurb: string; actions: QuickAction[] }
> = {
  seeker: {
    label: "Job Seeker",
    blurb: "Search roles, track applications and keep your profile ready.",
    actions: [
      {
        label: "Browse Jobs",
        description: "Search curated openings with smart filters.",
        href: "/jobs",
        icon: Briefcase,
      },
      {
        label: "Saved Jobs",
        description: "Revisit the roles you bookmarked.",
        href: "/dashboard/seeker/saved",
        icon: Bookmark,
      },
      {
        label: "Applications",
        description: "Follow every application and its status.",
        href: "/dashboard/seeker/applications",
        icon: FileText,
      },
      {
        label: "Billing",
        description: "Manage your plan and payment methods.",
        href: "/dashboard/seeker/billing",
        icon: Wallet,
      },
      {
        label: "Settings",
        description: "Update your account preferences.",
        href: "/dashboard/seeker/settings",
        icon: Settings,
      },
    ],
  },
  recruiter: {
    label: "Recruiter",
    blurb: "Run hiring for your company — jobs, applicants and settings.",
    actions: [
      {
        label: "My Company",
        description: "Manage your company profile and brand.",
        href: "/dashboard/recruiter/company",
        icon: Building2,
      },
      {
        label: "Manage Jobs",
        description: "Edit, pause or publish your job posts.",
        href: "/dashboard/recruiter/jobs",
        icon: Briefcase,
      },
      {
        label: "Add Jobs",
        description: "Edit, pause or publish your job posts.",
        href: "/dashboard/recruiter/jobs/new",
        icon: PlusCircle,
      },
      {
        label: "Post a Job",
        description: "Reach qualified candidates in minutes.",
        href: "/dashboard/recruiter/jobs/new",
        icon: PlusCircle,
      },
      {
        label: "Applications",
        description: "Review candidates who applied.",
        href: "/dashboard/recruiter/applications",
        icon: FileText,
      },
      {
        label: "Settings",
        description: "Configure your hiring preferences.",
        href: "/dashboard/recruiter/settings",
        icon: Settings,
      },
    ],
  },
  admin: {
    label: "Administrator",
    blurb: "Oversee users, listings and platform payments.",
    actions: [
      {
        label: "Manage Users",
        description: "Review seeker and recruiter accounts.",
        href: "/dashboard/admin/users",
        icon: Users,
      },
      {
        label: "Companies",
        description: "Approve and manage company profiles.",
        href: "/dashboard/admin/companies",
        icon: Building2,
      },
      {
        label: "Manage Jobs",
        description: "Moderate job posts across the platform.",
        href: "/dashboard/admin/jobs",
        icon: Briefcase,
      },
      {
        label: "Payments",
        description: "Track subscriptions and transactions.",
        href: "/dashboard/admin/payments",
        icon: Wallet,
      },
      {
        label: "Settings",
        description: "Platform-level configuration.",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  },
};

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = await params;

  // The [role] layout already validated the segment and the session role.
  const role: DashboardRole = isDashboardRole(roleParam)
    ? roleParam
    : "seeker";

  const { session } = await requireDashboardSession(role);
  const user = session.user;

  const content = ROLE_CONTENT[role];
  const firstName = user.name?.trim().split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome header */}
      <div>
        <p className="font-mono text-xs tracking-wider text-zinc-500">
          {content.label.toUpperCase()} DASHBOARD
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {content.blurb}
        </p>
      </div>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2
          id="quick-actions-heading"
          className="text-sm font-semibold text-zinc-300"
        >
          Quick actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {action.label}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Account details — real session data only */}
      <section
        aria-labelledby="account-heading"
        className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="account-heading" className="text-sm font-semibold text-zinc-300">
            Account
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs capitalize text-indigo-400 ring-1 ring-indigo-500/20">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {role === "admin" ? "Super Admin" : content.label}
          </span>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold uppercase text-white">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-zinc-500">Name</dt>
              <dd className="truncate text-sm font-medium text-white">
                {user.name || "—"}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-zinc-500">Email</dt>
              <dd className="truncate text-sm font-medium text-white">
                {user.email}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs text-zinc-500">Email status</dt>
              <dd className="text-sm font-medium text-white">
                {user.emailVerified ? "Verified" : "Not verified yet"}
              </dd>
            </div>
          </div>
        </dl>
      </section>
    </div>
  );
}
