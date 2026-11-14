"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireDashboardSession } from "@/lib/dashboard-session";
import { validateJob } from "@/lib/job-validation";
import { apiFetch, OBJECT_ID_RE } from "@/lib/jobs-api";
import type { CreateJobResult, JobFormValues } from "@/lib/job-options";

const LIST_URL = "/dashboard/recruiter/jobs";

/** Sends a validated job to Express and turns the response into a result. */
async function saveJob(
  method: "POST" | "PUT",
  path: string,
  values: JobFormValues,
  recruiterId: string,
): Promise<CreateJobResult | null> {
  const { data, fieldErrors } = validateJob(values);
  if (!data) return { ok: false, fieldErrors };

  try {
    const res = await apiFetch(path, {
      method,
      body: JSON.stringify({ ...data, recruiterId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error(`Express ${method} ${path} failed:`, res.status, body);
      return {
        ok: false,
        error: body?.error ?? "Could not save the job. Please try again.",
      };
    }
  } catch (error) {
    console.error("saveJob failed:", error);
    return { ok: false, error: "Could not reach the server. Please try again." };
  }

  return null; // success
}

/** Post a new job. Only a signed-in recruiter can call this. */
export async function createJob(
  values: JobFormValues,
): Promise<CreateJobResult> {
  const { session } = await requireDashboardSession("recruiter");

  const failure = await saveJob("POST", "/jobs", values, session.user.id);
  if (failure) return failure;

  revalidatePath(LIST_URL);
  redirect(LIST_URL);
}

/** Update one of the recruiter's own jobs (Express checks ownership too). */
export async function updateJob(
  id: string,
  values: JobFormValues,
): Promise<CreateJobResult> {
  const { session } = await requireDashboardSession("recruiter");

  if (!OBJECT_ID_RE.test(id)) {
    return { ok: false, error: "Invalid job." };
  }

  const failure = await saveJob(
    "PUT",
    `/recruiter/jobs/${id}`,
    values,
    session.user.id,
  );
  if (failure) return failure;

  revalidatePath(LIST_URL);
  redirect(LIST_URL);
}

/** Delete one of the recruiter's own jobs. */
export async function deleteJob(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { session } = await requireDashboardSession("recruiter");

  if (!OBJECT_ID_RE.test(id)) return { ok: false, error: "Invalid job." };

  try {
    const res = await apiFetch(
      `/recruiter/jobs/${id}?recruiterId=${encodeURIComponent(session.user.id)}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      return { ok: false, error: "Could not delete the job." };
    }
  } catch (error) {
    console.error("deleteJob failed:", error);
    return { ok: false, error: "Could not reach the server." };
  }

  revalidatePath(LIST_URL);
  return { ok: true };
}
