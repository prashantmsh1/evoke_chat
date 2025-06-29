import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    LinkIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { RootState } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import useTurnChatSSE from "@/hooks/useTurnChatSSE";
import {
    addMessage,
    appendToLastAssistantMessage,
    setThread,
    updateLastAssistantMessage,
} from "@/store/slice/threadSlice";
import { flushSync } from "react-dom";
import { useInitiateThreadMutation } from "@/store/api/threadApi";

interface ChatDashboardProps {
    threadId: string;
}

const ChatDashboard = ({ threadId }: ChatDashboardProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [isSearchEnabled, setIsSearchEnabled] = useState(true);
    const [expandedSources, setExpandedSources] = useState({});
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const [initiateThread, { isLoading: isInitiatingThread }] = useInitiateThreadMutation();

    const dispatch = useDispatch();
    const currentThreadId = useSelector((state: RootState) => state.chat.currentThreadId);
    const currentMessages = useSelector((state: RootState) => state.chat.messages[threadId] || []);
    const turnId = useSelector((state: RootState) => state.chat.threads[currentThreadId]?.turnId);
    const isFirstChunk = useRef(true);

    const messages = useMemo(() => {
        return currentMessages.map((message) => ({
            ...message,
            finished: message.finished || false,
        }));
    }, [currentMessages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;
        setIsStreaming(true);

        try {
            const res = await initiateThread({
                prompt: newMessage,
                threadId: threadId,
            }).unwrap();

            dispatch(setThread(res));
            const targetThreadId = currentThreadId || String(threadId);

            dispatch(
                addMessage({
                    threadId: targetThreadId,
                    message: {
                        id: Date.now(),
                        type: "user",
                        content: newMessage,
                        timestamp: new Date().toISOString(),
                    },
                })
            );

            setNewMessage("");
        } catch (error) {
            console.error("Failed to initiate thread:", error);
            setIsStreaming(false);
        }
    };

    const onDone = useCallback(() => {
        isFirstChunk.current = true;
        setIsStreaming(false);
    }, []);

    const onStreamStart = useCallback(() => {
        setIsStreaming(true);
    }, []);

    const onChunk = useCallback(
        (
            chunk: string,
            isFirst: boolean,
            finished: boolean,
            sources?: Array<{ title: string; url: string; description: string; favicon: string }>,
            model?: string
        ) => {
            if (isStreaming) {
                setIsStreaming(false);
            }
            if (isFirst) {
                const initialMessage = {
                    id: Date.now(),
                    type: "assistant" as const,
                    content: chunk,
                    timestamp: new Date().toISOString(),
                    finished: false,
                    sources: sources || [],
                    model: model || "default-model",
                };
                dispatch(addMessage({ threadId: String(threadId), message: initialMessage }));
            } else {
                flushSync(() => {
                    dispatch(
                        appendToLastAssistantMessage({
                            threadId: String(threadId),
                            content: chunk,
                            finished,
                            sources,
                            model,
                        })
                    );
                });
            }
        },
        [dispatch, threadId, isStreaming]
    );

    useTurnChatSSE(turnId, undefined, onDone, onChunk, onStreamStart);

    useEffect(() => {
        if (!currentThreadId && threadId) {
            // Handle thread ID logic
        }
    }, [currentThreadId, threadId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            const timeout = setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [messages]);

    const toggleSources = (messageId) => {
        setExpandedSources((prev) => ({
            ...prev,
            [messageId]: !prev[messageId],
        }));
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    return (
        <div className="flex flex-col mx-auto max-w-5xl h-screen bg-[#1C1C1C] text-white">
            {/* Subtle background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:32px_32px] opacity-20"></div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-6 relative z-10">
                {messages.map((message) => (
                    <div key={message.id} className="space-y-4">
                        {/* Message */}
                        <div
                            className={`flex ${
                                message.type === "user" ? "justify-end" : "justify-start"
                            }`}>
                            <div
                                className={`max-w-4xl rounded-2xl px-6 py-4 ${
                                    message.type === "user"
                                        ? "bg-black/10 backdrop-blur-sm border border-white/10 text-white"
                                        : "bg-black/10 backdrop-blur-xl border border-white/10 shadow-lg"
                                }`}>
                                {/* <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-light text-white/80">
                                        {message.type === "user" ? "You" : "Evoke AI"}
                                    </span>
                                    <span className="text-xs flex items-center text-white/50 font-light">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div> */}

                                {message.type === "user" ? (
                                    <p className="text-white font-light leading-relaxed">
                                        {message.content}
                                    </p>
                                ) : (
                                    <div
                                        className={`prose prose-sm max-w-none ${
                                            !message.finished ? "typing-animation" : ""
                                        }`}>
                                        <ReactMarkdown
                                            components={{
                                                code({
                                                    node,
                                                    inline,
                                                    className,
                                                    children,
                                                    ...props
                                                }) {
                                                    const match = /language-(\w+)/.exec(
                                                        className || ""
                                                    );
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={tomorrow}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}>
                                                            {String(children).replace(/\n$/, "")}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sources */}
                        {message.type === "assistant" && message.sources && (
                            <div className="ml-4 max-w-3xl">
                                <button
                                    onClick={() => toggleSources(message.id)}
                                    className="flex transition-all duration-300 items-center text-sm font-light text-white/60 hover:text-white/80">
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Sources ({message.sources.length})
                                    {expandedSources[message.id] ? (
                                        <ChevronUpIcon className="h-4 w-4 ml-1" />
                                    ) : (
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    )}
                                </button>

                                {expandedSources[message.id] && (
                                    <div className="mt-3 space-y-2 transition-all duration-300">
                                        {message.sources.map((source, index) => (
                                            <div
                                                key={index}
                                                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-lg">
                                                        {source.favicon}
                                                    </span>
                                                    <div className="flex-1 *:text-wrap">
                                                        <a
                                                            href={source.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-light text-white hover:text-white/80 transition-colors">
                                                            {source.title}
                                                        </a>
                                                        <p className="text-sm text-white/60 mt-1 font-light">
                                                            {source.description}
                                                        </p>
                                                        <p className="text-xs whitespace-break-spaces text-white/40 mt-1 font-light">
                                                            {source.url}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isStreaming && (
                    <div className="flex justify-start">
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-lg max-w-4xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}></div>
                                    <div
                                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}></div>
                                </div>
                                <span className="text-white/60 font-light">
                                    Evoke AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="py-4 relative z-10">
                <form onSubmit={handleSubmit} className="px-6">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <textarea
                            cols={1}
                            type="text"
                            value={newMessage}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            className="w-full px-4 py-3 resize-none text-wrap hide-scrollbar bg-transparent text-white placeholder:text-white/40 font-light outline-none border-0 focus:ring-0"
                            disabled={isInitiatingThread || isStreaming}
                        />
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                            <div className="text-xs text-white/40 font-light">
                                Press Enter to send, Shift+Enter for new line
                            </div>
                            <button
                                type="submit"
                                disabled={isInitiatingThread || isStreaming || !newMessage.trim()}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl px-4 py-2 font-light transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm disabled:opacity-50 disabled:hover:scale-100 flex items-center">
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatDashboard;
//                             className="px-4  place-self-end w-fit py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
//                             <PaperAirplaneIcon className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ChatDashboard;
