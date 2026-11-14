"use server";

import { redirect } from "next/navigation";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { getDb } from "@/lib/mongodb";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type CreateJobResult,
  type JobFieldErrors,
  type JobFormValues,
} from "@/lib/job-options";

/**
 * Validates the "Post a New Job" form and stores it in the `jobs` collection.
 * Only a signed-in recruiter can call this. On success it redirects, so it
 * only ever *returns* a failure result.
 */
export async function createJob(
  values: JobFormValues,
): Promise<CreateJobResult> {
  const { session } = await requireDashboardSession("recruiter");

  const v: JobFormValues = {
    ...values,
    title: values.title.trim(),
    company: values.company.trim(),
    location: values.location.trim(),
    responsibilities: values.responsibilities.trim(),
    requirements: values.requirements.trim(),
  };

  const fieldErrors: JobFieldErrors = {};

  if (!v.title) fieldErrors.title = "Job title is required.";
  if (!v.company) fieldErrors.company = "Company name is required.";
  if (!(JOB_CATEGORIES as readonly string[]).includes(v.category))
    fieldErrors.category = "Choose a category.";
  if (!(JOB_TYPES as readonly string[]).includes(v.type))
    fieldErrors.type = "Choose a job type.";
  if (!v.isRemote && !v.location)
    fieldErrors.location = "Location is required unless the job is remote.";

  if (!v.deadline || Number.isNaN(Date.parse(v.deadline))) {
    fieldErrors.deadline = "Choose a deadline.";
  } else if (v.deadline < new Date().toISOString().slice(0, 10)) {
    fieldErrors.deadline = "Deadline can't be in the past.";
  }

  const min = Number(v.salaryMin);
  const max = Number(v.salaryMax);
  if (v.salaryMin === "" || Number.isNaN(min) || min < 0)
    fieldErrors.salaryMin = "Enter a valid minimum.";
  if (v.salaryMax === "" || Number.isNaN(max) || max < 0)
    fieldErrors.salaryMax = "Enter a valid maximum.";
  if (!fieldErrors.salaryMin && !fieldErrors.salaryMax && min > max)
    fieldErrors.salaryMax = "Maximum must be at least the minimum.";
  if (!(SALARY_FREQUENCIES as readonly string[]).includes(v.salaryFrequency))
    fieldErrors.salaryFrequency = "Choose a frequency.";

  if (!v.responsibilities)
    fieldErrors.responsibilities = "Describe the key responsibilities.";
  if (!v.requirements)
    fieldErrors.requirements = "Describe the qualifications.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  try {
    await getDb().collection("jobs").insertOne({
      title: v.title,
      company: v.company,
      category: v.category,
      type: v.type,
      isRemote: v.isRemote,
      location: v.location,
      deadline: new Date(v.deadline),
      salaryMin: min,
      salaryMax: max,
      salaryFrequency: v.salaryFrequency,
      responsibilities: v.responsibilities,
      requirements: v.requirements,
      recruiterId: session.user.id,
      status: "active",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("createJob failed:", error);
    return { ok: false, error: "Could not publish the job. Please try again." };
  }

  redirect("/dashboard/recruiter/jobs");
}