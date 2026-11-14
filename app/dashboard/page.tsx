import { redirect } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";

/**
 * `/dashboard` — resolves the signed-in user's role and sends them to their
 * own dashboard home (used after sign-in, sign-up and Google OAuth).
 */
export default async function DashboardIndexPage() {
  const { role } = await requireDashboardSession();
  redirect(`/dashboard/${role}`);
}
