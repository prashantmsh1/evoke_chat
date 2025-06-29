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
        <div className="min-h-screen flex w-screen ">
            {/* Navbar */}

            <AppSidebar />

            <div className="flex relative w-full ">
                {/* Sidebar */}
                {!open && (
                    <SidebarTrigger className=" absolute mt-2 hover:text-gray-50 text-gray-50" />
                )}

                {/* Main Content Area */}
                <main className=" w-full ">
                    <div className=" w-full">
                        <Outlet />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RootLayout;
