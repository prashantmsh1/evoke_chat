import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import useTurnChatSSE from "@/hooks/useTurnChatSSE";

import { useInitiateThreadMutation } from "@/store/api/threadApi";
import { addMessage, setThread } from "@/store/slice/threadSlice";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatPage: React.FC = () => {
    const [initiateThread, { isLoading }] = useInitiateThreadMutation();
    const [prompt, setPrompt] = React.useState("");
    const navigate = useNavigate();

    const { currentThreadId } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt.trim()) return;

        try {
            const res = await initiateThread({ prompt }).unwrap();
            dispatch(setThread(res));
            dispatch(
                addMessage({
                    threadId: res.threadId,
                    message: {
                        id: Date.now(), // Use timestamp as a simple ID
                        type: "user",
                        content: prompt,
                        timestamp: new Date().toISOString(),
                    },
                })
            );

            // Handle successful thread initiation, e.g., redirect or show a message
        } catch (error) {
            console.error("Failed to initiate thread:", error);
            // Handle error, e.g., show an error message
        }
    };

    useEffect(() => {
        if (currentThreadId !== undefined) {
            // Start listening to SSE for the current thread
            navigate(`/chat/${currentThreadId}`);
        }
    }, [currentThreadId, dispatch]);

    return (
        <div className="mx-auto w-full gap-y-12 h-screen flex flex-col items-center justify-center">
            <h1 className=" text-sky-400/80 font-medium text-6xl">Evoke Ai</h1>

            <form
                onSubmit={handleSubmit}
                className=" w-1/2 flex-col flex shadow shadow-gray-600 items-center justify-center border p-4 rounded-xl">
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    disabled={isLoading}
                    className=" rounded border-0   focus-visible:ring-0 resize-none   "
                    placeholder="Ask Anything..."
                />
                <div className=" flex justify-between mt-2 w-full">
                    <div></div>
                    <Button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className=" bg-sky-700/25 hover:bg-sky-700/50 text-gray-50 font-semibold">
                        <ArrowRight className=" text-gray-50 size-6" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatPage;
