import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AppSidebar from "../sidebar/Sidebar";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { useAuth } from "@/context/AuthContext";

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    const { open } = useSidebar();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen flex w-screen bg-black">
            {/* Sidebar */}
            <AppSidebar />

            <div className="flex relative w-full bg-black">
                {/* Sidebar Trigger - Always show on mobile, show on desktop when closed */}
                <div className="md:hidden">
                    <SidebarTrigger className="absolute top-2 left-4 z-50 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-lg p-2 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.05]" />
                </div>
                <div className="hidden md:block">
                    {!open && (
                        <SidebarTrigger className="absolute top-2 left-4 z-50 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-lg p-2 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.05]" />
                    )}
                </div>

                {/* Main Content Area */}
                <main className="w-full bg-[#1C1C1C]">
                    <div className="w-full">
                        <Outlet />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

// export default RootLayout;
export default RootLayout;
