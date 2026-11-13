"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Menu,
  X,
  Briefcase,
  Building,
  CreditCard,
  ChevronDown,
  Loader2,
  User,
} from "lucide-react";

const Navber = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setUserDropdownOpen(false);
            setMobileMenuOpen(false);
            router.push("/signIn");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={closeMenus}
            className="flex items-center gap-2 transition-transform hover:opacity-90 active:scale-95"
          >
            <Image
              src="/images/logo.png"
              alt="HireLoop"
              width={110}
              height={36}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/jobs"
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Browse Jobs
            </Link>
            <Link
              href="/company"
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Company
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right: Auth State (Desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          {isPending ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              <span>Checking session...</span>
            </div>
          ) : session?.user ? (
            // Logged in state
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 py-1.5 pl-2 pr-3 text-sm text-zinc-200 transition-all hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-semibold text-xs text-white uppercase shadow-inner">
                  {session.user.name ? session.user.name.charAt(0) : "U"}
                </div>
                <span className="max-w-[130px] truncate font-medium text-zinc-200">
                  {session.user.name || "My Account"}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-zinc-800/80 px-3 py-2 text-left">
                      <p className="text-xs font-semibold text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      >
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        Profile
                      </Link>
                      <Link
                        href="/jobs"
                        onClick={closeMenus}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                        Explore Jobs
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800/80 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5" />
                        )}
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Logged out state
            <div className="flex items-center gap-4">
              <div className="h-4 w-px bg-zinc-800" />
              <Link
                href="/signIn"
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link href="/signUp">
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-600/30">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-800 bg-zinc-950/95 px-4 pt-2 pb-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/jobs"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <Briefcase className="h-4 w-4 text-zinc-400" />
              Browse Jobs
            </Link>
            <Link
              href="/company"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <Building className="h-4 w-4 text-zinc-400" />
              Company
            </Link>
            <Link
              href="/pricing"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <CreditCard className="h-4 w-4 text-zinc-400" />
              Pricing
            </Link>

            <div className="my-2 border-t border-zinc-800" />

            {isPending ? (
              <div className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                <span>Checking session...</span>
              </div>
            ) : session?.user ? (
              <div className="space-y-3 px-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-semibold text-white uppercase shadow-inner">
                    {session.user.name ? session.user.name.charAt(0) : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <Link href="/profile" onClick={closeMenus} className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-zinc-800 text-zinc-200 hover:bg-zinc-900"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive"
                  className="w-full justify-center gap-2 text-sm"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/signIn" onClick={closeMenus} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 text-zinc-200 hover:bg-zinc-900"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signUp" onClick={closeMenus} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navber;
