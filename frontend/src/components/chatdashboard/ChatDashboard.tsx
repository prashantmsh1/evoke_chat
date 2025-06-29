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
    // console.log("Current messages:", currentMessages);
    const isFirstChunk = useRef(true);

    const messages = useMemo(() => {
        return currentMessages.map((message) => ({
            ...message,
            finished: message.finished || false, // Ensure finished is always defined
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

            // Clear the input
            setNewMessage("");
        } catch (error) {
            console.error("Failed to initiate thread:", error);
            setIsStreaming(false);
        }
    };

    // Memoize the callback functions to prevent re-renders
    const onDone = useCallback(() => {
        isFirstChunk.current = true; // Reset for next stream
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
                // Create initial assistant message
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
                // Append new content to create typing effect
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

    // Use the typing animation approach with memoized callbacks
    useTurnChatSSE(
        turnId,
        undefined, // Don't use the message callback
        onDone,
        onChunk,
        onStreamStart
    );
    useEffect(() => {
        if (!currentThreadId && threadId) {
            // If we have a threadId prop but no currentThreadId, we might need to fetch thread data
            // or set the currentThreadId
            // console.log("Setting current thread ID from prop:", threadId);
            // You might need to dispatch setCurrentThreadId here if you have existing thread data
        }
    }, [currentThreadId, threadId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            const timeout = setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }, 30); // 30ms delay
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
        <div className="flex flex-col mx-auto max-w-5xl h-screen ">
            {/* Header */}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto hide-scrollbar  px-6 py-4 space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className="space-y-4">
                        {/* Message */}
                        <div
                            className={`flex ${
                                message.type === "user" ? "justify-end" : "justify-start"
                            }`}>
                            <div
                                className={`max-w-4xl rounded-lg px-6 py-4 ${
                                    message.type === "user"
                                        ? "bg-gray-700/10 text-white"
                                        : " bg-gray-700/10   shadow-sm"
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`text-sm font-medium ${
                                            message.type === "user"
                                                ? "text-blue-100"
                                                : "text-gray-600"
                                        }`}>
                                        {message.type === "user" ? "You" : "Assistant"}
                                    </span>
                                    <span
                                        className={`text-xs flex items-center ${
                                            message.type === "user"
                                                ? "text-blue-200"
                                                : "text-gray-500"
                                        }`}>
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div>

                                {message.type === "user" ? (
                                    <p className="text-white">{message.content}</p>
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
                                    className="flex transition-all duration-300 items-center text-sm font-medium text-gray-400 hover:text-gray-300">
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
                                                className="bg-gray-700/10  rounded-lg p-3">
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-lg">
                                                        {source.favicon}
                                                    </span>
                                                    <div className="flex-1">
                                                        <a
                                                            href={source.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-blue-600 hover:text-blue-800">
                                                            {source.title}
                                                        </a>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {source.description}
                                                        </p>
                                                        <p className="text-xs text-gray-300 mt-1">
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
                        <div className="bg-gray-700/10 rounded-lg px-6 py-4 shadow-sm max-w-4xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}></div>
                                    <div
                                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}></div>
                                </div>
                                <span className="text-gray-400 font-medium">
                                    Assistant is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="   py-4">
                <form onSubmit={handleSubmit} className="flex  flex-col">
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
                        placeholder="Ask a question..."
                        className="w-full px-4 py-3 resize-none text-wrap hide-scrollbar bg-gray-700/10 focus:ring-gray-400 focus:ring-0 rounded-lg outline-none"
                        disabled={isInitiatingThread || isStreaming}
                    />
                    <div className="bg-gray-700/10 p-4 w-full">
                        <button
                            type="submit"
                            disabled={isInitiatingThread || isStreaming || !newMessage.trim()}
                            className="px-4  place-self-end w-fit py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatDashboard;
