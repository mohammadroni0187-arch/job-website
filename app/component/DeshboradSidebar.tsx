"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  Wallet,
  Settings,
  Building2,
  Users,
  type LucideIcon,
  PlusCircle,
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
    { id: "dashboard", name: "Dashboard", url: "/deshboard/seeker", icon: LayoutDashboard },
    { id: "jobs", name: "Jobs", url: "/deshboard/seeker/jobs", icon: Briefcase },
    { id: "saved-jobs", name: "Saved Jobs", url: "/deshboard/seeker/saved", icon: Bookmark },
    { id: "applications", name: "Applications", url: "/deshboard/seeker/applications", icon: FileText },
    { id: "billing", name: "Billing", url: "/deshboard/seeker/billing", icon: Wallet },
    { id: "settings", name: "Settings", url: "/deshboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/deshboard/recruiter", icon: LayoutDashboard },
    { id: "my-company", name: "My Company", url: "/deshboard/recruiter/company", icon: Building2 },
    { id: "manage-jobs", name: "Manage Jobs", url: "/deshboard/recruiter/jobs", icon: Briefcase },
    { id: "manage-jobs", name: "add Jobs", url: "/deshboard/recruiter/jobs/new", icon: PlusCircle },
    { id: "applications", name: "Applications", url: "/deshboard/recruiter/applications", icon: FileText },
    { id: "settings", name: "Settings", url: "/deshboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { id: "dashboard", name: "Dashboard", url: "/deshboard/admin", icon: LayoutDashboard },
    { id: "users", name: "Users", url: "/deshboard/admin/users", icon: Users },
    { id: "companies", name: "Companies", url: "/deshboard/admin/companies", icon: Building2 },
    { id: "jobs", name: "Jobs", url: "/deshboard/admin/jobs", icon: Briefcase },
    { id: "payments", name: "Payments", url: "/deshboard/admin/payments", icon: Wallet },
    { id: "settings", name: "Settings", url: "/deshboard/admin/settings", icon: Settings },
  ],
};

const DeshboradSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const rawRole = session?.user?.role as string | undefined;
  const role: Role = rawRole === "recruiter" || rawRole === "admin" ? rawRole : "seeker";
  const menuItems = menuItemsByRole[role];

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname === item.url}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default DeshboradSidebar;
