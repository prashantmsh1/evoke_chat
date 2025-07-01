import React from "react";
import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, User2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";

const AppSidebar = () => {
    const { open } = useSidebar();
    const { logout } = useAuth();
    const { user } = useSelector((state: any) => state.auth);
    return (
        <Sidebar collapsible="icon" className=" border-r-0 ">
            <SidebarHeader>
                <div className=" flex justify-between ">
                    <div>
                        <img src="/evoke.svg" alt="Logo" className="h-8 w-8 text-sky-800 " />
                    </div>
                    {open && <SidebarTrigger className=" bg-gray-800" />}
                </div>
            </SidebarHeader>
            <SidebarContent className="  " />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="  *:text-gray-50 :bg-gray-800 *:hover:text-gray-50">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {user?.displayName.split(" ")[0]}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] ">
                                {/* <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="cursor-pointer bg-gray-800/40">
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
