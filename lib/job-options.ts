/**
 * Option lists and form types shared by the "Post a New Job" form (client)
 * and its server action. Keeping them in one place guarantees both sides
 * agree on exactly which values are valid.
 */

export const JOB_CATEGORIES = [
  "Software Development",
  "Data Science",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "Human Resources",
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

export const SALARY_FREQUENCIES = [
  "per hour",
  "per day",
  "per month",
  "per year",
] as const;

export const CURRENCY_SYMBOL = "$";

export type JobFormValues = {
  title: string;
  company: string;
  category: string;
  type: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  salaryMin: string;
  salaryMax: string;
  salaryFrequency: string;
  responsibilities: string;
  requirements: string;
};

/** Per-field validation messages — a field appears only when it's invalid. */
export type JobFieldErrors = Partial<Record<keyof JobFormValues, string>>;

/**
 * What the `createJob` server action reports back. It only ever *returns* on
 * failure: a successful save redirects to the job list instead.
 */
export type CreateJobResult =
  | { ok: true }
  | { ok: false; fieldErrors?: JobFieldErrors; error?: string };
