import Anthropic from "@anthropic-ai/sdk";
import { ILLMService } from "../llm.factory";
import { LLMConfig, ChatMessage, LLMResponse } from "@/types/llm.types";

export class AnthropicService implements ILLMService {
    async generateResponse(messages: ChatMessage[], config: LLMConfig): Promise<LLMResponse> {
        const anthropic = new Anthropic({
            apiKey: config.apiKey,
        });

        // Convert messages format for Anthropic
        const systemMessage = messages.find((m) => m.role === "system")?.content || "";
        const conversationMessages = messages.filter((m) => m.role !== "system");

        const response = await anthropic.messages.create({
            model: config.model,
            system: systemMessage,
            messages: conversationMessages as any,
            max_tokens: config.maxTokens || 4096,
            temperature: config.temperature,
        });

        return {
            id: response.id,
            content: response.content[0]?.type === "text" ? response.content[0].text : "",
            model: response.model,
            usage: response.usage
                ? {
                      promptTokens: response.usage.input_tokens,
                      completionTokens: response.usage.output_tokens,
                      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
                  }
                : undefined,
            finishReason: response.stop_reason || undefined,
        };
    }

    async *streamResponse(
        messages: ChatMessage[],
        config: LLMConfig
    ): AsyncGenerator<any, void, unknown> {
        const anthropic = new Anthropic({
            apiKey: config.apiKey,
        });

        const systemMessage = messages.find((m) => m.role === "system")?.content || "";
        const conversationMessages = messages.filter((m) => m.role !== "system");

        const stream = await anthropic.messages.create({
            model: config.model,
            system: systemMessage,
            messages: conversationMessages as any,
            max_tokens: config.maxTokens || 4096,
            temperature: config.temperature,
            stream: true,
        });

        for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                yield {
                    id: Math.random().toString(36).substring(7),
                    content: chunk.delta.text,
                    finished: false,
                    model: config.model,
                    timestamp: Date.now(),
                };
            } else if (chunk.type === "message_stop") {
                yield {
                    id: Math.random().toString(36).substring(7),
                    content: "",
                    finished: true,
                    model: config.model,
                    timestamp: Date.now(),
                };
            }
        }
    }
}
