import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type DashboardRole = "seeker" | "recruiter" | "admin";

export const DASHBOARD_ROLES: DashboardRole[] = [
  "seeker",
  "recruiter",
  "admin",
];

export function isDashboardRole(value: string): value is DashboardRole {
  return (DASHBOARD_ROLES as string[]).includes(value);
}

/**
 * Session lookup, deduplicated per request via React `cache` so the layout,
 * role layout and page all share a single database round-trip.
 */
const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Server-side guard for everything under `/dashboard`.
 *
 * - No session  → redirect to the sign-in screen.
 * - `role` given and it doesn't match the session role → redirect to the
 *   user's own dashboard (prevents a recruiter opening `/dashboard/seeker`).
 */
export async function requireDashboardSession(role?: DashboardRole) {
  const session = await getCachedSession();

  if (!session) {
    redirect("/signIn");
  }

  const rawRole: string | undefined = (session.user as { role?: string }).role;
  const sessionRole: DashboardRole =
    rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker";

  if (role && sessionRole !== role) {
    redirect(`/dashboard/${sessionRole}`);
  }

  return { session, role: sessionRole };
}
