"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Building2, Users, Star } from "lucide-react"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const stats = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: Users,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfaction Rate",
  },
]

export default function Hero() {
  const router = useRouter()
  const [jobQuery, setJobQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (jobQuery.trim()) params.set("query", jobQuery.trim())
    if (locationQuery.trim()) params.set("location", locationQuery.trim())

    const queryString = params.toString()
    router.push(queryString ? `/jobs?${queryString}` : "/jobs")
  }

  const handleTrendingClick = (position: string) => {
    setJobQuery(position)
    router.push(`/jobs?query=${encodeURIComponent(position)}`)
  }

  return (
    <section className="relative overflow-hidden bg-black pt-12 pb-16 text-white sm:pt-20 sm:pb-20 lg:pt-28">
      {/* Background Star Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="relative flex justify-center">
          {/* Faint divider line flanking the badge */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"
          />
          <div className="relative inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 shadow-xl backdrop-blur-md transition-colors hover:border-zinc-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Briefcase className="h-3 w-3" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-zinc-100">
              50,000+
            </span>
            <span className="text-xs font-medium tracking-widest text-zinc-400">
              NEW JOBS THIS MONTH
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mx-auto mt-8 max-w-4xl text-center sm:mt-10">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Find Your Dream Job Today
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mt-5 sm:text-base">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
          <form
            onSubmit={handleSearch}
            aria-label="Job search"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full"
          >
            {/* Input 1: Job title, skill or company */}
            <label htmlFor="hero-job-query" className="sr-only">
              Job title, skill or company
            </label>
            <div className="flex flex-1 items-center gap-3 px-4 py-2 sm:py-0">
              <Search
                className="h-5 w-5 shrink-0 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="hero-job-query"
                type="text"
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                placeholder="Job title, skill or company"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Divider */}
            <div
              className="hidden h-7 w-px bg-zinc-800 sm:block"
              aria-hidden="true"
            />

            {/* Input 2: Location or Remote */}
            <label htmlFor="hero-location-query" className="sr-only">
              Location or Remote
            </label>
            <div className="flex flex-1 items-center gap-3 px-4 py-2 sm:py-0">
              <MapPin
                className="h-5 w-5 shrink-0 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="hero-location-query"
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location or Remote"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              aria-label="Search Jobs"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95 sm:h-10 sm:w-10 sm:rounded-xl"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {/* Trending Positions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:mt-6 sm:text-sm">
            <span className="mr-1 font-medium text-zinc-500">
              Trending Position
            </span>
            {trendingPositions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTrendingClick(tag)}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Space Globe & Caption
            globe.png is a 1440x1882 portrait PNG (transparent background, magenta
            haze in the top ~560px). The image is pulled up 40% of the container width
            so the empty/magenta top is clipped, and the container's aspect ratio crops
            the hidden bottom. Width/height stay in the image's native ratio, so the
            globe is never stretched. */}
        <div className="relative mt-12 sm:mt-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
            {/* Blue / purple ambient glow behind the globe */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[15%] left-1/2 h-[55%] w-[70%] -translate-x-1/2 rounded-[50%] bg-indigo-600/25 blur-[110px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[35%] left-1/2 h-[35%] w-[50%] -translate-x-1/2 rounded-[50%] bg-blue-500/25 blur-[80px]"
            />

            {/* Globe image */}
            <Image
              src="/images/globe.png"
              alt="Glowing globe representing worldwide job opportunities"
              width={1440}
              height={1882}
              loading="eager"
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="relative -mt-[40%] h-auto w-full select-none"
            />

            {/* Soft fades so the clipped top/bottom edges melt into the black background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-black/95 via-black/50 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black via-black/60 to-transparent"
            />

            {/* Floating Centered Caption over the globe */}
            <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 px-4 text-center sm:top-[45%]">
              <p className="mx-auto max-w-2xl text-lg leading-snug font-medium text-zinc-100 drop-shadow-lg sm:text-xl md:text-2xl lg:text-3xl">
                Assisting over{" "}
                <span className="font-semibold text-white">
                  15,000 job seekers
                </span>
                <br className="hidden sm:inline" /> find their dream positions.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Statistics Cards — overlapping the lower part of the globe */}
        <div className="relative z-10 -mt-[26%] grid grid-cols-2 gap-3 sm:-mt-[23%] sm:gap-4 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="group relative flex min-h-[190px] flex-col justify-between rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-xl shadow-black/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-2xl sm:min-h-[240px] sm:p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-colors group-hover:text-white sm:h-10 sm:w-10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="mt-6">
                  <div className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-zinc-400 sm:text-sm">
                    {item.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
