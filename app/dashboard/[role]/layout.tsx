import { notFound } from "next/navigation";
import {
  isDashboardRole,
  requireDashboardSession,
} from "@/lib/dashboard-session";

/**
 * Role guard for `/dashboard/[role]` and every page beneath it — the session
 * must exist and its role must match the URL segment, otherwise the request
 * is redirected to the user's own dashboard.
 */
export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isDashboardRole(role)) {
    notFound();
  }

  await requireDashboardSession(role);

  return <>{children}</>;
}
