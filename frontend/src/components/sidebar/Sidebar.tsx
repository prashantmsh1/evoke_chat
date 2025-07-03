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
import { ChevronDown, ChevronUp, User2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { useGetAllThreadsQuery } from "@/store/api/threadApi";
import { Thread } from "@/store/api/threadApi";
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
    const { open } = useSidebar();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.auth);
    const { data: allThreads = [], isLoading, error } = useGetAllThreadsQuery();

    return (
        <Sidebar collapsible="icon" className=" border-r-0 ">
            <SidebarHeader>
                <div className=" flex justify-between ">
                    <div className=" flex items-center gap-2 text-gray-50">
                        <img src="/evoke.svg" alt="Logo" className="h-8 w-8 text-sky-800 " />
                        {open && (
                            <h3 className=" text-2xl font-medium text-nowrap text-sky-400">
                                Evoke Ai
                            </h3>
                        )}
                    </div>
                    {open && <SidebarTrigger className=" bg-white/10" />}
                </div>
            </SidebarHeader>
            <SidebarContent className=" mt-8 p-2  ">
                <SidebarMenu className=" flex flex-col gap-2 ">
                    <SidebarMenuItem
                        onClick={() => {
                            navigate(`/chatpage`);
                        }}
                        className="  *:text-gray-50  rounded bg-gray-700/20 *:hover:text-gray-50 mb-2">
                        <SidebarMenuButton
                            className={` ${open ? "" : ""}  text-nowrap hover:bg-gray-700/30 `}>
                            <Plus className={`w-4 h-4  ${open ? "" : " mr-2"}`} />
                            {open && "New Chat"}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {open &&
                        allThreads.map((thread: any) => (
                            <SidebarMenuItem
                                onClick={() => {
                                    navigate(`/chat/${thread.id}`);
                                }}
                                key={thread.id}
                                className="  *:text-gray-50  rounded bg-gray-700/20 *:hover:text-gray-50"
                                href={`/chatpage/${thread.id}`}>
                                <SidebarMenuButton
                                    className={` ${
                                        open ? "" : ""
                                    } text-nowrap hover:bg-gray-700/30 `}>
                                    {thread.title}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarContent>
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
