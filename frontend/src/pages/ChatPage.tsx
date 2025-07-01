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
                        id: Date.now(),
                        type: "user",
                        content: prompt,
                        timestamp: new Date().toISOString(),
                    },
                })
            );
        } catch (error) {
            console.error("Failed to initiate thread:", error);
        }
    };

    useEffect(() => {
        if (currentThreadId !== undefined) {
            navigate(`/chat/${currentThreadId}`);
        }
    }, [currentThreadId, dispatch]);

    return (
        <div className="min-h-screen  bg-background text-foreground flex flex-col items-center justify-center px-4">
            {/* Subtle background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/10 to-background"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:32px_32px] opacity-20"></div>

            <div className="relative z-10 max-w-4xl w-full space-y-12 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-light text-foreground">Evoke AI</h1>
                    <p className="text-muted-foreground text-lg font-light">
                        Ask anything, get intelligent answers
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
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
                            className="bg-transparent border-0 focus-visible:ring-0 resize-none text-foreground placeholder:text-muted-foreground font-light text-lg min-h-[120px]"
                            placeholder="Ask anything..."
                        />
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                            <Button
                                type="submit"
                                disabled={isLoading || !prompt.trim()}
                                className="bg-secondary hover:bg-accent text-secondary-foreground border border-border hover:border-border/80 rounded-xl px-6 py-3 font-light transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm disabled:opacity-50 disabled:hover:scale-100">
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-border border-t-foreground rounded-full"></div>
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <ArrowRight className="size-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
