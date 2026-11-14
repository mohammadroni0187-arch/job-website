
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  signOut,
  useSession,
} from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

import {
  Menu,
  X,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// Navigation item type
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

// Public navigation items
const navItems: NavItem[] = [
  {
    name: "Browse Jobs",
    href: "/jobs",
    icon: Search,
  },
  {
    name: "Companies",
    href: "/company",
    icon: Building2,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
];

// Supported dashboard roles — anything else falls back to the seeker dashboard
const ROLE_ROUTES = ["seeker", "recruiter", "admin"] as const;
type Role = (typeof ROLE_ROUTES)[number];

const Navber = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();

  // Menus remember the pathname they were opened on, so navigating closes them
  // declaratively instead of via setState-in-effect.
  const [menuState, setMenuState] = useState({
    pathname: "",
    mobile: false,
    user: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoggedIn = !!session?.user;

  const user = session?.user;

  const mobileMenuOpen = menuState.mobile && menuState.pathname === pathname;
  const userDropdownOpen = menuState.user && menuState.pathname === pathname;

  // Role-based dashboard route
  const rawRole = (user as { role?: string } | undefined)?.role;
  const role: Role = ROLE_ROUTES.includes(rawRole as Role)
    ? (rawRole as Role)
    : "seeker";

  const dashboardHref = `/dashboard/${role}`;

  // Close menus
  const closeMenus = () => {
    setMenuState((prev) => ({ ...prev, mobile: false, user: false }));
  };

  const toggleMobileMenu = () => {
    setMenuState((prev) => ({
      pathname,
      mobile: !(prev.mobile && prev.pathname === pathname),
      user: false,
    }));
  };

  const toggleUserMenu = () => {
    setMenuState((prev) => ({
      pathname,
      user: !(prev.user && prev.pathname === pathname),
      mobile: false,
    }));
  };

  // Active link checker
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const result = await signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed");
      }

      closeMenus();

      router.replace("/signIn");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // User initial
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // The dashboard renders its own sidebar + topbar — keep the public
  // navbar off dashboard routes.
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/85 text-white shadow-lg shadow-black/5 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">

          {isPending ? (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking session...
            </div>
          ) : isLoggedIn && user ? (

            /* Logged-in User Dropdown */
            <div className="relative">

              <button
                type="button"
                onClick={toggleUserMenu}
                aria-expanded={userDropdownOpen}
                aria-label="Open user menu"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold uppercase text-white">
                  {userInitial}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-28 truncate text-sm font-semibold text-white">
                    {user.name || "My Account"}
                  </p>
                  <p className="text-xs capitalize text-zinc-400">
                    {role}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    onClick={closeMenus}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl shadow-black/40">

                    {/* User Information */}
                    <div className="border-b border-white/10 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name || "My Account"}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {user.email}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-xs capitalize text-blue-400">
                        {role}
                      </span>
                    </div>

                    {/* User Links */}
                    <div className="space-y-1 py-2">
                      <Link
                        href={dashboardHref}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <UserRound className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        href="/jobs"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <BriefcaseBusiness className="h-4 w-4" />
                        Explore Jobs
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/10 pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}

                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          ) : (

            /* Logged-out User */
            <div className="flex items-center gap-3">
              <Link
                href="/signIn"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link href="/signUp">
                <Button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-5 shadow-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">

            {/* Dynamic Public Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="my-3 border-t border-white/10" />

            {isPending ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking session...
              </div>
            ) : isLoggedIn && user ? (

              /* Mobile Logged-in User */
              <div className="space-y-3">

                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold uppercase text-white">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name || "My Account"}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {user.email}
                    </p>
                    <p className="text-xs capitalize text-blue-400">
                      {role}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  <UserRound className="h-4 w-4" />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>

            ) : (

              /* Mobile Logged-out User */
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/signIn" onClick={closeMenus}>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/signUp" onClick={closeMenus}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
