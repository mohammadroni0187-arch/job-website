import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import DeshboradSidebar from "../component/DeshboradSidebar";


const DeshboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DeshboradSidebar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DeshboardLayout;