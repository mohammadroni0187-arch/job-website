import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client";
const menuItemsByRole={
  seeker:[

  ],
  recruiter:[

  ],
  admin:[

  ]
}


const DeshboradSidebar = () => {
  const {data:session, isPending}= useSession();
  const role = session?.user?.role || 'seeker';
  return (
     <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
  {menuItemsByRole.map((item) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton render={<a href={project.url}/>}>
        
          <project.icon />
          <span>{project.name}</span>
        
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