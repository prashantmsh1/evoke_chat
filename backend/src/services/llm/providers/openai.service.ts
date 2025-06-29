import OpenAI from "openai";
import { ILLMService } from "../llm.factory";
import { LLMConfig, ChatMessage, LLMResponse } from "@/types/llm.types";

export class OpenAIService implements ILLMService {
    async generateResponse(messages: ChatMessage[], config: LLMConfig): Promise<LLMResponse> {
        const openai = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
        });

        const response = await openai.chat.completions.create({
            model: config.model,
            messages: messages as any,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
        });

        return {
            id: response.id,
            content: response.choices[0]?.message?.content || "",
            model: response.model,
            usage: response.usage
                ? {
                      promptTokens: response.usage.prompt_tokens,
                      completionTokens: response.usage.completion_tokens,
                      totalTokens: response.usage.total_tokens,
                  }
                : undefined,
            finishReason: response.choices[0]?.finish_reason || undefined,
        };
    }

    async *streamResponse(
        messages: ChatMessage[],
        config: LLMConfig
    ): AsyncGenerator<any, void, unknown> {
        const openai = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
        });

        const stream = await openai.chat.completions.create({
            model: config.model,
            messages: messages as any,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            const finished = chunk.choices[0]?.finish_reason !== null;

            yield {
                id: chunk.id,
                content,
                finished,
                model: chunk.model,
                timestamp: Date.now(),
            };
        }
    }
}
