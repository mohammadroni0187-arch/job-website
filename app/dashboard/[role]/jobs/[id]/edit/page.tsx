import { notFound } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { getRecruiterJob } from "@/lib/jobs-api";
import type { JobFormValues } from "@/lib/job-options";
import JobForm from "@/components/JobForm";

/** `/dashboard/recruiter/jobs/<id>/edit` — recruiters edit their own jobs. */
export default async function EditJobPage({
  params,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const { role, id } = await params;
  if (role !== "recruiter") notFound();

  const { session } = await requireDashboardSession("recruiter");

  // Returns null if the job doesn't exist OR belongs to another recruiter.
  const job = await getRecruiterJob(id, session.user.id);
  if (!job) notFound();

  const initialValues: JobFormValues = {
    title: job.title,
    company: job.company,
    category: job.category,
    type: job.type,
    isRemote: job.isRemote,
    location: job.location,
    deadline: job.deadline.slice(0, 10),
    salaryMin: String(job.salaryMin),
    salaryMax: String(job.salaryMax),
    salaryFrequency: job.salaryFrequency,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
  };

  return <JobForm mode="edit" jobId={id} initialValues={initialValues} />;
}
