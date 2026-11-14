import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobFieldErrors,
  type JobFormValues,
} from "@/lib/job-options";

/** Clean, typed job data that is safe to send to the API. */
export type JobPayload = {
  title: string;
  company: string;
  category: string;
  type: string;
  isRemote: boolean;
  location: string;
  deadline: string; // YYYY-MM-DD
  salaryMin: number;
  salaryMax: number;
  salaryFrequency: string;
  responsibilities: string;
  requirements: string;
};

/**
 * Pure validation shared by "create" and "update".
 * Returns `data` when everything is valid, otherwise `fieldErrors`.
 */
export function validateJob(values: JobFormValues): {
  data: JobPayload | null;
  fieldErrors: JobFieldErrors;
} {
  const v = {
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
    return { data: null, fieldErrors };
  }

  return {
    fieldErrors,
    data: {
      title: v.title,
      company: v.company,
      category: v.category,
      type: v.type,
      isRemote: v.isRemote,
      location: v.location,
      deadline: v.deadline,
      salaryMin: min,
      salaryMax: max,
      salaryFrequency: v.salaryFrequency,
      responsibilities: v.responsibilities,
      requirements: v.requirements,
    },
  };
}
