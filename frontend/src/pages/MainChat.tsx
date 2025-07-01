import ChatDashboard from "@/components/chatdashboard/ChatDashboard";
import React from "react";
import { useParams } from "react-router-dom";

const MainChat = () => {
    const params: string = useParams().threadId;
    console.log("Thread ID:", params);

    return (
        <div className="bg-background min-h-screen">
            <ChatDashboard threadId={params} />
        </div>
    );
};

export default MainChat;
