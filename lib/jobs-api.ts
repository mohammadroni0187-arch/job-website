/**
 * Server-only helpers that talk to the Express API.
 * Never import this from a "use client" file: it reads API_SECRET.
 */

export type JobRecord = {
  _id: string;
  title: string;
  company: string;
  category: string;
  type: string;
  isRemote: boolean;
  location: string;
  deadline: string; // ISO date string
  salaryMin: number;
  salaryMax: number;
  salaryFrequency: string;
  responsibilities: string;
  requirements: string;
  recruiterId: string;
  status: string;
  createdAt: string;
  applicantsCount?: number;
};

export const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const apiSecret = process.env.NEXT_PUBLIC_SECRET;

  if (!apiSecret) {
    throw new Error("API_SECRET is not set");
  }

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiSecret}`,
      ...init.headers,
    },
  });
}

/** All jobs posted by one recruiter, newest first. */
export async function getRecruiterJobs(
  recruiterId: string,
): Promise<JobRecord[]> {
  const res = await apiFetch(
    `/recruiter/jobs?recruiterId=${encodeURIComponent(recruiterId)}`,
  );
  if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
  return res.json();
}

/** One job, only if it belongs to this recruiter (otherwise null). */
export async function getRecruiterJob(
  id: string,
  recruiterId: string,
): Promise<JobRecord | null> {
  if (!OBJECT_ID_RE.test(id)) return null;

  const res = await apiFetch(
    `/recruiter/jobs/${id}?recruiterId=${encodeURIComponent(recruiterId)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load job (${res.status})`);
  return res.json();
}
