import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pricing Plans</h1>
              <p className="text-sm text-zinc-400">
                Transparent plans for candidates and hiring managers
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-400">
            <p className="text-base font-medium text-zinc-300">
              Free for job seekers, custom plans for employers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
