import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { LLMFactory } from "@/services/llm/llm.factory";
import { LLMConfigService } from "@/services/llm/llm.config";

interface ThreadResponse {
    threadId: string;
    turnId: string;
    message: string;
    threadTitle: string;
    userId: string;
}

export const initiateThread = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        const { prompt, threadId } = req.body;

        // Validate input
        if (!user?.id || !prompt) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const finalThreadId = threadId || uuidv4();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Check for existing thread if threadId was provided
        let existingThread = null;
        if (threadId) {
            existingThread = await prisma.thread.findUnique({
                where: { id: threadId },
            });
        }

        // ✅ Use transaction for all database operations
        const result = await prisma.$transaction(async (tx) => {
            let thread;

            if (existingThread) {
                thread = existingThread;
            } else {
                thread = await tx.thread.create({
                    data: {
                        id: finalThreadId,
                        userId: user.id,
                        title: prompt.slice(0, 50),
                    },
                });
            }

            const turn = await tx.turn.create({
                data: {
                    threadId: thread.id,
                    userPrompt: prompt,
                    status: "processing",
                    llmModel: "GEMINI_2_5_FLASH",
                },
            });

            return { thread, turn };
        });

        // Small delay to ensure database consistency
        await new Promise((resolve) => setTimeout(resolve, 50));

        res.status(201).json({
            threadId: result.thread.id,
            turnId: result.turn.id,
            message: "Thread initiated successfully",
            threadTitle: result.thread.title,
            userId: user.id,
        });
    } catch (error) {
        console.error("Error initiating thread:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTurnChat = async (req: Request, res: Response): Promise<void> => {
    const { turnId } = req.params;

    try {
        const turn = await prisma.turn.findUnique({
            where: { id: turnId },
            include: {
                thread: {
                    include: {
                        turns: {
                            orderBy: { createdAt: "asc" },
                            where: {
                                status: "completed",
                            },
                        },
                    },
                },
            },
        });

        if (!turn || turn.status !== "processing") {
            res.status(404).json({ message: "Invalid or non processing turn " });
            return;
        }

        // Set SSE headers
        res.set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
        });

        // Keep connection alive
        const keepAlive = setInterval(() => {
            res.write(":keep-alive\n\n");
        }, 100000);

        try {
            const llmService = LLMFactory.getInstance("google");
            const config = LLMConfigService.getConfig("gemini_2_5_flash");

            const messages = [];

            // Add previous completed turns as context
            for (const prevTurn of turn.thread.turns) {
                if (prevTurn.userPrompt) {
                    messages.push({
                        role: "user" as const,
                        content: prevTurn.userPrompt,
                    });
                }
                if (prevTurn.llmResponse) {
                    messages.push({
                        role: "assistant" as const,
                        content: prevTurn.llmResponse,
                    });
                }
            }

            // Add current user prompt
            messages.push({
                role: "user" as const,
                content: turn.userPrompt,
            });

            let fullResponse = "";
            let responseStartTime = Date.now();
            let accumulatedContent = "";
            const responseId = Date.now();

            const userMessage = {
                id: responseId,
                type: "user",
                content: turn.userPrompt,
                timestamp: new Date(),
                finished: true,
                model: config.model,
                sources: [],
            };
            // res.write(`data: ${JSON.stringify(userMessage)}\n\n`);

            // Stream the response using the Google service
            for await (const chunk of llmService.streamResponse(messages, config)) {
                // Accumulate content for database storage
                if (chunk.content && !chunk.finished) {
                    accumulatedContent += chunk.content;
                }
                console.log("Streaming chunk:", chunk);
                // Format chunk to match your required response format
                const formattedChunk = {
                    id: responseId,
                    type: "assistant",
                    content: accumulatedContent,
                    timestamp: new Date(),
                    finished: chunk.finished,
                    model: chunk.model,
                    sources: chunk.finished ? chunk.sources : [], // Only include sources if finished
                    ...(chunk.usage && { usage: chunk.usage }),
                    ...(chunk.finishReason && { finishReason: chunk.finishReason }),
                    ...(chunk.error && { error: chunk.error }),
                };

                // console.log("Streaming chunk:", formattedChunk);

                // Send chunk as SSE
                const sseData = `data: ${JSON.stringify(formattedChunk)}\n\n`;
                res.write(sseData);

                // If response is finished, save to database and cleanup
                if (chunk.finished) {
                    try {
                        await prisma.turn.update({
                            where: { id: turnId },
                            data: {
                                llmResponse: accumulatedContent,
                                status: "completed",
                                createdAt: new Date(),
                                metadata: {
                                    model: chunk.model,
                                    usage: chunk.usage,
                                    finishReason: chunk.finishReason,
                                    responseTime: Date.now() - responseStartTime,
                                },
                            },
                        });

                        console.log(`Turn ${turnId} completed successfully`);
                    } catch (dbError) {
                        console.error("Error updating turn in database:", dbError);
                    }
                    break;
                }
            }

            // Send completion signal
            res.write("data: [DONE]\n\n");
        } catch (llmError: any) {
            console.error("LLM streaming error:", llmError);

            // Update turn status to failed
            await prisma.turn.update({
                where: { id: turnId },
                data: {
                    status: "failed",
                    createdAt: new Date(),
                    metadata: {
                        error: llmError.message,
                        failedAt: new Date(),
                    },
                },
            });

            // Send error chunk
            const errorResponse = {
                id: Date.now(),
                type: "assistant",
                content: "",
                timestamp: new Date(),
                finished: true,
                model: "unknown",
                sources: [],
                error: `LLM Error: ${llmError.message}`,
            };

            res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
            res.write("data: [DONE]\n\n");
        }

        // Cleanup
        clearInterval(keepAlive);
        res.end();
    } catch (error) {
        console.error("Error fetching turn chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllThreads = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;

        // Validate user
        if (!user?.id) {
            res.status(400).json({ message: "User not authenticated" });
            return;
        }

        // Fetch all threads for the user
        const threads = await prisma.thread.findMany({
            where: { userId: user.id },
            include: {
                // turns: {
                //     orderBy: { createdAt: "desc" },
                //     take: 1, // Get only the latest turn for each thread
                // },
            },
            orderBy: { createdAt: "desc" }, // Order threads by creation date
        });

        res.status(200).json(threads);
    } catch (error) {
        console.error("Error fetching threads:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getThreadTurnsById = async (req: Request, res: Response): Promise<void> => {
    const { threadId } = req.params;

    try {
        // Validate threadId
        if (!threadId) {
            res.status(400).json({ message: "Thread ID is required" });
            return;
        }

        // Fetch the thread and its turns
        const thread = await prisma.thread.findUnique({
            where: { id: threadId },
            include: {
                turns: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        sources: {
                            include: {
                                source: true,
                            },
                        },
                    },
                },
            },
        });

        if (!thread) {
            res.status(404).json({ message: "Thread not found" });
            return;
        }
        const messages = thread.turns.flatMap((turn) => {
            const userMsg = {
                id: Number(new Date(turn.createdAt)) + 1, // or use a counter/index
                type: "user" as const,
                content: turn.userPrompt,
                timestamp: turn.createdAt.toISOString(),
                finished: true,
                model: turn.llmModel,
                sources: [],
            };

            const assistantMsg = turn.llmResponse
                ? {
                      id: Number(new Date(turn.createdAt)) + 2, // or use a counter/index
                      type: "assistant" as const,
                      content: turn.llmResponse,
                      timestamp: turn.createdAt.toISOString(),
                      finished: turn.status === "completed",
                      model: turn.llmModel,
                      sources: (turn.sources || []).map((ts) => ({
                          title: ts.source?.title || "",
                          url: ts.source?.url || "",
                          description: ts.source?.rawContent || "",
                      })),
                  }
                : null;

            return assistantMsg ? [userMsg, assistantMsg] : [userMsg];
        });

        res.status(200).json({ turns: messages });
    } catch (error) {
        console.error("Error fetching thread turns:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
