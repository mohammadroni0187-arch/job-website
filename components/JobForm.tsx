"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  Globe,
  Loader2,
  MapPin,
  AlertCircle,
} from "lucide-react";
import {
  CURRENCY_SYMBOL,
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobFieldErrors,
  type JobFormValues,
} from "@/lib/job-options";
import { createJob } from "@/app/dashboard/[role]/jobs/new/actions";

const fieldBase =
  "h-11 w-full rounded-lg border border-white/5 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50";

const textareaBase =
  "min-h-28 w-full resize-y rounded-lg border border-white/5 bg-zinc-900 px-3 py-3 text-sm leading-relaxed text-white placeholder:text-zinc-500 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50";

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
      {n}. {children}
    </h2>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-xs font-medium text-zinc-300">
          {label}
          {required && <span className="text-indigo-400"> *</span>}
        </label>
        {hint && <span className="text-[11px] text-zinc-600">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const initialValues: JobFormValues = {
  title: "",
  company: "",
  category: JOB_CATEGORIES[0],
  type: JOB_TYPES[0],
  isRemote: false,
  location: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  salaryFrequency: "per hour",
  responsibilities: "",
  requirements: "",
};

export default function JobForm({
  defaultCompany = "",
}: {
  defaultCompany?: string;
  recruiterName?: string;
}) {
  const [values, setValues] = useState<JobFormValues>({
    ...initialValues,
    company: defaultCompany,
  });
  const [errors, setErrors] = useState<JobFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jobData  ={...form}
    console.log(jobData)
    setFormError(null);

    startTransition(async () => {
      // On success the action redirects, so we only get a result on failure.
      const result = await createJob(values);
      console.log(result)
      if (result && !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(
          result.error ??
            (result.fieldErrors ? "Please fix the highlighted fields." : null),
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  return (
    <form
      id="job-form"
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-500">
            <Link href="/dashboard/recruiter/jobs" className="hover:text-zinc-300">
              Manage Jobs
            </Link>{" "}
            <span aria-hidden="true">›</span>{" "}
            <span className="text-indigo-400">Create New Listing</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {isPending ? "Publishing..." : "Publish Job"}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {formError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </div>
      )}

      {/* 1. Basic information */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-zinc-900/40 p-6">
        <SectionTitle n={1}>Basic Information</SectionTitle>

        <Field label="Job Title" htmlFor="title" required error={errors.title}>
          <input
            id="title"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Frontend Developer"
            disabled={isPending}
            className={fieldBase}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company Name" htmlFor="company" required error={errors.company}>
            <div className="relative">
              <Building2
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="company"
                value={values.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="HirePulse Network"
                disabled={isPending}
                className={`${fieldBase} pl-9`}
              />
            </div>
          </Field>

          <Field label="Job Category" htmlFor="category" required error={errors.category}>
            <div className="relative">
              <select
                id="category"
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                disabled={isPending}
                className={`${fieldBase} appearance-none pr-9`}
              >
                {JOB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
          </Field>
        </div>

        <Field label="Job Type" required error={errors.type}>
          <div
            role="radiogroup"
            aria-label="Job type"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {JOB_TYPES.map((t) => {
              const active = values.type === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={isPending}
                  onClick={() => set("type", t)}
                  className={`h-11 rounded-lg border text-sm transition ${
                    active
                      ? "border-indigo-500/50 bg-zinc-800 font-medium text-white"
                      : "border-white/5 bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Field>
      </section>

      {/* 2. Location, compensation & timeline */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-zinc-900/40 p-6">
        <SectionTitle n={2}>Location, Compensation &amp; Timeline</SectionTitle>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-zinc-900 px-4 py-3">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">
                Remote Work Allowed (isRemote)
              </p>
              <p className="text-xs text-zinc-500">
                Enable worldwide or distributed candidate applications
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={values.isRemote}
            aria-label="Remote work allowed"
            disabled={isPending}
            onClick={() => set("isRemote", !values.isRemote)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              values.isRemote ? "bg-indigo-600" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                values.isRemote ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Job Location (location)"
            htmlFor="location"
            hint={values.isRemote ? undefined : "Required"}
            error={errors.location}
          >
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="location"
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="New York, USA"
                disabled={isPending}
                className={`${fieldBase} pl-9`}
              />
            </div>
          </Field>

          <Field
            label="Application Deadline (deadline)"
            htmlFor="deadline"
            error={errors.deadline}
          >
            <div className="relative">
              <Calendar
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="deadline"
                type="date"
                value={values.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                disabled={isPending}
                className={`${fieldBase} pl-9 [color-scheme:dark]`}
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Min Salary / Rate" htmlFor="salaryMin" error={errors.salaryMin}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                {CURRENCY_SYMBOL}
              </span>
              <input
                id="salaryMin"
                type="number"
                min={0}
                inputMode="decimal"
                value={values.salaryMin}
                onChange={(e) => set("salaryMin", e.target.value)}
                placeholder="25"
                disabled={isPending}
                className={`${fieldBase} pl-8`}
              />
            </div>
          </Field>

          <Field label="Max Salary / Rate" htmlFor="salaryMax" error={errors.salaryMax}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                {CURRENCY_SYMBOL}
              </span>
              <input
                id="salaryMax"
                type="number"
                min={0}
                inputMode="decimal"
                value={values.salaryMax}
                onChange={(e) => set("salaryMax", e.target.value)}
                placeholder="40"
                disabled={isPending}
                className={`${fieldBase} pl-8`}
              />
            </div>
          </Field>

          <Field label="Frequency" htmlFor="salaryFrequency" error={errors.salaryFrequency}>
            <div className="relative">
              <select
                id="salaryFrequency"
                value={values.salaryFrequency}
                onChange={(e) => set("salaryFrequency", e.target.value)}
                disabled={isPending}
                className={`${fieldBase} appearance-none pr-9`}
              >
                {SALARY_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
          </Field>
        </div>
      </section>

      {/* 3. Responsibilities & requirements */}
      <section className="space-y-5 rounded-2xl border border-white/5 bg-zinc-900/40 p-6">
        <SectionTitle n={3}>Responsibilities &amp; Requirements</SectionTitle>

        <Field
          label="Key Responsibilities"
          htmlFor="responsibilities"
          required
          error={errors.responsibilities}
        >
          <textarea
            id="responsibilities"
            value={values.responsibilities}
            onChange={(e) => set("responsibilities", e.target.value)}
            placeholder="Describe what this person will do day to day..."
            disabled={isPending}
            className={textareaBase}
          />
        </Field>

        <Field
          label="Qualifications & Requirements"
          htmlFor="requirements"
          required
          error={errors.requirements}
        >
          <textarea
            id="requirements"
            value={values.requirements}
            onChange={(e) => set("requirements", e.target.value)}
            placeholder={"• 3+ years of experience with React\n• Solid understanding of DOM performance"}
            disabled={isPending}
            className={textareaBase}
          />
        </Field>
      </section>
    </form>
  );
}
