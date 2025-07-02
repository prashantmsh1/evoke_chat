import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
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
    appendTurnsList,
    setThread,
    updateLastAssistantMessage,
} from "@/store/slice/threadSlice";
import { flushSync } from "react-dom";
import { useGetThreadTurnsByIdQuery, useInitiateThreadMutation } from "@/store/api/threadApi";

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
    const { data: allTurns = [], isLoading: isTurnsLoading } = useGetThreadTurnsByIdQuery(
        { threadId },
        {
            skip: !threadId,
        }
    );
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
        if (!currentThreadId && threadId && allTurns.length > 0) {
            // Handle thread ID logic
            dispatch(appendTurnsList({ threadId, turns: allTurns }));
        }
    }, [currentThreadId, threadId, allTurns]);

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
        <div className="flex flex-col mx-auto max-w-5xl h-screen bg-background text-foreground">
            {/* Subtle background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/10 to-background"></div>
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
                                        ? "bg-card/20 backdrop-blur-sm border border-border text-foreground"
                                        : "bg-card/20 backdrop-blur-xl border border-border shadow-lg"
                                }`}>
                                {/* <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-light text-foreground/80">
                                        {message.type === "user" ? "You" : "Evoke AI"}
                                    </span>
                                    <span className="text-xs flex items-center text-muted-foreground font-light">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div> */}

                                {message.type === "user" ? (
                                    <p className="text-foreground font-light leading-relaxed">
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
                                                            style={okaidia}
                                                            customStyle={{
                                                                backgroundColor: "var(--card)",
                                                                padding: "1rem",
                                                                borderRadius: "0.5rem",
                                                                border: "1px solid var(--border)",
                                                            }}
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
                                    className="flex transition-all duration-300 items-center text-sm font-light text-muted-foreground hover:text-foreground/80">
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
                                                className="bg-card/40 backdrop-blur-xl border border-border rounded-xl p-4">
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-lg">
                                                        {source.favicon}
                                                    </span>
                                                    <div className="flex-1 *:text-wrap">
                                                        <a
                                                            href={source.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-light text-foreground hover:text-foreground/80 transition-colors">
                                                            {source.title}
                                                        </a>
                                                        <p className="text-sm text-muted-foreground mt-1 font-light">
                                                            {source.description}
                                                        </p>
                                                        <p className="text-xs whitespace-break-spaces text-muted-foreground/70 mt-1 font-light">
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
                        <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl px-6 py-4 shadow-lg max-w-4xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}></div>
                                    <div
                                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}></div>
                                </div>
                                <span className="text-muted-foreground font-light">
                                    Evoke AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="py-1 relative z-10 mb-1">
                <form onSubmit={handleSubmit} className="px-6">
                    <div className="bg-card/40 backdrop-blur-xl flex  border border-border rounded-2xl p-1 shadow-2xl">
                        <textarea
                            cols={3}
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
                            className="w-full px-4 py-2 resize-none text-wrap hide-scrollbar bg-transparent text-foreground placeholder:text-muted-foreground font-light outline-none border-0 focus:ring-0"
                            disabled={isInitiatingThread || isStreaming}
                        />
                        <div className="flex justify-between items-center  ">
                            <button
                                type="submit"
                                disabled={isInitiatingThread || isStreaming || !newMessage.trim()}
                                className="bg-secondary hover:bg-accent text-secondary-foreground border border-border hover:border-border/80 rounded-xl px-4 py-2 font-light transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm disabled:opacity-50 disabled:hover:scale-100 flex items-center">
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
//
