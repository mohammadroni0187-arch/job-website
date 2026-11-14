import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { requireDashboardSession } from "@/lib/dashboard-session";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Server-side authentication for every route under /dashboard
  await requireDashboardSession();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-zinc-950 text-white">
        {/* Topbar — the public navbar is hidden on dashboard routes */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-white/10 bg-zinc-950/85 px-4 backdrop-blur-xl">
          <SidebarTrigger className="text-zinc-300 hover:bg-white/10 hover:text-white" />
          <span className="text-sm font-medium text-zinc-400">
            HireLoop Dashboard
          </span>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
