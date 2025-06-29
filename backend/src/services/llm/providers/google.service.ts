import { ILLMService } from "../llm.factory";
import { GoogleGenAI } from "@google/genai";
import { LLMConfig, ChatMessage, LLMResponse } from "@/types/llm.types";
import { LLMConfigService } from "../llm.config";

export class GoogleService implements ILLMService {
    private getGenerativeAI(config: LLMConfig): GoogleGenAI {
        if (!config.apiKey) {
            throw new Error("Google API key is required");
        }
        return new GoogleGenAI({ apiKey: config.apiKey });
    }

    private convertMessagesToGoogleFormat(messages: ChatMessage[]): any[] {
        const convertedMessages = [];

        for (const message of messages) {
            if (message.role === "system") {
                // Google doesn't have a system role, so we'll prepend it to the first user message
                continue;
            }

            convertedMessages.push({
                role: message.role === "assistant" ? "model" : "user",
                parts: [{ text: message.content }],
            });
        }

        // If there's a system message, prepend it to the first user message
        const systemMessage = messages.find((m) => m.role === "system");
        if (systemMessage && convertedMessages.length > 0 && convertedMessages[0].role === "user") {
            convertedMessages[0].parts[0].text = `${systemMessage.content}\n\n${convertedMessages[0].parts[0].text}`;
        }

        return convertedMessages;
    }

    // async generateResponse(messages: ChatMessage[], config: LLMConfig): Promise<LLMResponse> {
    //     try {
    //         const genAI = this.getGenerativeAI(config);
    //         const model = genAI.models.generateContentStream({
    //             model: config.model,
    //         });

    //         const convertedMessages = this.convertMessagesToGoogleFormat(messages);

    //         // Start chat with history (excluding the last message)
    //         const chatHistory = convertedMessages.slice(0, -1);
    //         const lastMessage = convertedMessages[convertedMessages.length - 1];

    //         const chat = genAI.chats.create({
    //             history: chatHistory,
    //         });

    //         const result = await chat.sendMessage(lastMessage.parts[0].text);
    //         const response = await result.response;
    //         const text = response.text();

    //         return {
    //             id: `google-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    //             content: text,
    //             model: config.model,
    //             usage: response.usageMetadata
    //                 ? {
    //                       promptTokens: response.usageMetadata.promptTokenCount || 0,
    //                       completionTokens: response.usageMetadata.candidatesTokenCount || 0,
    //                       totalTokens: response.usageMetadata.totalTokenCount || 0,
    //                   }
    //                 : undefined,
    //             finishReason: response.candidates?.[0]?.finishReason || "stop",
    //         };
    //     } catch (error: any) {
    //         console.error("Google GenAI API error:", error);
    //         throw new Error(`Google GenAI API error: ${error.message}`);
    //     }
    // }

    async *streamResponse(
        messages: ChatMessage[],
        config: LLMConfig
    ): AsyncGenerator<any, void, unknown> {
        try {
            const genAI = this.getGenerativeAI(config);
            const model = genAI.chats.create({
                model: config.model,
                // config: {
                //     temperature: 0.5,
                //     maxOutputTokens: 1024,
                // },
                config: config,
            });

            const convertedMessages = this.convertMessagesToGoogleFormat(messages);

            // Start chat with history (excluding the last message)
            const chatHistory = convertedMessages.slice(0, -1);
            const lastMessage = convertedMessages[convertedMessages.length - 1];

            const chat = await model.sendMessageStream({
                message: lastMessage,
            });

            let finalResponseData: any = null;
            // console.debug(JSON.stringify(chat?.candidates?.[0]?.groundingMetadata));
            // console.debug("Google GenAI streaming started", chat);
            for await (const chunk of chat) {
                const chunkText = chunk?.text;
                console.log(
                    "Google GenAI streaming chunk:",
                    chunk.candidates?.[0]?.groundingMetadata?.groundingChunks,
                    chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
                );
                // Store the final response data from the last chunk
                finalResponseData = chunk;

                if (chunkText) {
                    yield {
                        id: `google-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                        type: "assistant",
                        content: chunkText,
                        finished: false,
                        model: config.model,
                        timestamp: Date.now(),
                    };
                }
            }

            // Send final chunk to indicate completion
            yield {
                id: `google-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                content: "",
                finished: true,
                model: config.model,
                timestamp: Date.now(),
                usage: finalResponseData?.usageMetadata
                    ? {
                          promptTokens: finalResponseData.usageMetadata.promptTokenCount || 0,
                          completionTokens:
                              finalResponseData.usageMetadata.candidatesTokenCount || 0,
                          totalTokens: finalResponseData.usageMetadata.totalTokenCount || 0,
                      }
                    : undefined,
                finishReason: finalResponseData?.candidates?.[0]?.finishReason || "stop",
                type: "assistant",
                sources: finalResponseData?.candidates?.[0]?.groundingMetadata?.groundingChunks
                    ? finalResponseData?.candidates[0]?.groundingMetadata?.groundingChunks.map(
                          (source: any) => ({
                              title: source.web.title || "Unknown Source",
                              url: source.web.uri || "Unknown URL",
                              description: source.description || "",
                              favicon: "📌", // Default favicon for source
                          })
                      )
                    : [],
            };
        } catch (error: any) {
            console.error("Google GenAI streaming error:", error);

            // Yield error chunk
            yield {
                id: `google-error-${Date.now()}`,
                content: "",
                type: "assistant",
                finished: true,
                model: config.model,
                timestamp: Date.now(),
                error: `Google GenAI streaming error: ${error.message}`,
            };
        }
    }

    // Additional utility method for single prompt (non-chat) scenarios
    // async generateFromPrompt(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    //     try {
    //         const genAI = this.getGenerativeAI(config);
    //         const model = genAI.getGenerativeModel({
    //             model: config.model,
    //             generationConfig: {
    //                 temperature: config.temperature || 0.7,
    //                 maxOutputTokens: config.maxTokens || 4096,
    //                 topP: 0.95,
    //                 topK: 64,
    //             },
    //             safetySettings: this.getSafetySettings(),
    //         });

    //         const result = await model.generateContent(prompt);
    //         const response = await result.response;
    //         const text = response.text();

    //         return {
    //             id: `google-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    //             content: text,
    //             model: config.model,
    //             usage: response.usageMetadata
    //                 ? {
    //                       promptTokens: response.usageMetadata.promptTokenCount || 0,
    //                       completionTokens: response.usageMetadata.candidatesTokenCount || 0,
    //                       totalTokens: response.usageMetadata.totalTokenCount || 0,
    //                   }
    //                 : undefined,
    //             finishReason: response.candidates?.[0]?.finishReason || "stop",
    //         };
    //     } catch (error: any) {
    //         console.error("Google GenAI prompt error:", error);
    //         throw new Error(`Google GenAI prompt error: ${error.message}`);
    //     }
    // }
}
