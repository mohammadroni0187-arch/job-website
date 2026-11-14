"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  PlusCircle,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type Role = "seeker" | "recruiter" | "admin";

type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
};

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "my-company", name: "My Company", url: "/dashboard/recruiter/company", icon: Building2 },
    { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { id: "add-jobs", name: "Add Job", url: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { id: "payments", name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
    { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
};

// Sidebar footer CTA (per Figma) — admins don't post jobs or resumes.
const ROLE_CTA: Record<Role, { label: string; href: string } | null> = {
  seeker: { label: "Post Resume", href: "/profile" },
  recruiter: { label: "Post Job", href: "/dashboard/recruiter/jobs/new" },
  admin: null,
};

const ROLE_BADGE: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Super Admin",
};

/** Only trust avatar URLs we allow through next/image (Google avatars). */
function isAllowedAvatar(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).hostname === "lh3.googleusercontent.com";
  } catch {
    return false;
  }
}

const DashboardSidebar = () => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;
  const rawRole = (user as { role?: string } | undefined)?.role;
  const role: Role =
    rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker";
  const menuItems = menuItemsByRole[role];

  // Deepest matching item wins so a parent link doesn't stay active on its
  // sub-pages (e.g. /dashboard/recruiter/jobs/new → "Add Job").
  const activeUrl = menuItems.reduce((best, item) => {
    const matches =
      pathname === item.url || pathname.startsWith(`${item.url}/`);
    return matches && item.url.length > best.length ? item.url : best;
  }, "");

  const cta = ROLE_CTA[role];
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const avatar = isAllowedAvatar(user?.image) ? user.image : null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const result = await signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed");
      }

      router.replace("/signIn");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderAvatar = (size: "md" | "sm") =>
    avatar ? (
      <Image
        src={avatar}
        alt=""
        width={size === "md" ? 40 : 28}
        height={size === "md" ? 40 : 28}
        className={`${
          size === "md" ? "h-10 w-10" : "h-7 w-7"
        } rounded-full object-cover`}
      />
    ) : (
      <span
        className={`flex ${
          size === "md" ? "h-10 w-10 text-sm" : "h-7 w-7 text-xs"
        } items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold uppercase text-white`}
      >
        {userInitial}
      </span>
    );

  return (
    <Sidebar className="border-r border-white/10">
      {/* Brand + identity card */}
      <SidebarHeader className="gap-3 border-b border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center justify-between rounded-lg px-1 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={104}
            height={34}
            className="h-7 w-auto object-contain"
          />
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-widest text-zinc-400">
            HL
          </span>
        </Link>

        {isPending ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              {renderAvatar("md")}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "My Account"}
                </p>
                <p className="truncate text-xs text-zinc-400">{user?.email}</p>
              </div>
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400 ring-1 ring-indigo-500/20">
              {role === "admin" && (
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {ROLE_BADGE[role]}
            </span>
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-zinc-500">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isPending
                      ? [70, 85, 60, 80, 65].map((width, index) => (
                          <SidebarMenuItem key={index}>
                            <div className="flex h-8 items-center gap-2 rounded-md px-2">
                              <div className="size-4 shrink-0 animate-pulse rounded-md bg-white/10" />
                              <div
                                className="h-4 animate-pulse rounded-md bg-white/10"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </SidebarMenuItem>
                        ))
                : menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={activeUrl === item.url}
                        className="text-zinc-300 hover:bg-white/10 hover:text-white data-active:bg-white/10 data-active:font-medium data-active:text-white"
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: CTA + user card + logout */}
      <SidebarFooter className="gap-3 border-t border-white/10 p-4">
        {cta && (
          <Link
            href={cta.href}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
          {renderAvatar("sm")}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user?.name || "My Account"}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {ROLE_BADGE[role]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
