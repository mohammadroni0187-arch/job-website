import { notFound } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import JobForm from "@/components/JobForm";

/**
 * `/dashboard/recruiter/jobs/new` — only recruiters can post jobs.
 * A static `jobs/new` segment wins over the `[...slug]` placeholder page.
 */
export default async function NewJobPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (role !== "recruiter") notFound();

  const { session } = await requireDashboardSession("recruiter");

  return <JobForm defaultCompany="" recruiterName={session.user.name} />;
}