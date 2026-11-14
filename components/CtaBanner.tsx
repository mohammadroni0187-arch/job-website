import Image from "next/image";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="bg-black pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          {/* Background artwork */}
          <Image
            src="/images/cta-bg.png"
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
          {/* Legibility overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"
          />

          {/* Content */}
          <div className="relative px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              Your next role is
              <br />
              already looking for you
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base">
              Build a profile in three minutes. The matches start arriving
              tomorrow morning.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signUp"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
              >
                Create a free account
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
