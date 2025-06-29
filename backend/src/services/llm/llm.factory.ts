import { LLMConfig, ChatMessage, LLMResponse } from "@/types/llm.types";
import { OpenAIService } from "./providers/openai.service";
import { AnthropicService } from "./providers/anthropic.service";
import { GoogleService } from "./providers/google.service";
// import { LocalService } from "./providers/local.service";

export interface ILLMService {
    // generateResponse(messages: ChatMessage[], config: LLMConfig): Promise<LLMResponse>;
    streamResponse(messages: ChatMessage[], config: LLMConfig): AsyncGenerator<any, void, unknown>;
}

export class LLMFactory {
    private static instances: Map<string, ILLMService> = new Map();

    static getInstance(provider: string): ILLMService {
        if (!this.instances.has(provider)) {
            switch (provider) {
                case "openai":
                    this.instances.set(provider, new OpenAIService());
                    break;
                case "anthropic":
                    this.instances.set(provider, new AnthropicService());
                    break;
                case "google":
                    this.instances.set(provider, new GoogleService());
                    break;
                // case "local":
                //     this.instances.set(provider, new LocalService());
                //     break;
                default:
                    throw new Error(`Unsupported LLM provider: ${provider}`);
            }
        }
        return this.instances.get(provider)!;
    }
}
