export interface LLMConfig {
    provider: "openai" | "anthropic" | "google" | "local";
    model: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
    streamingEnabled: boolean;
    tools?: Array<{ [key: string]: any }>;
}

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface StreamChunk {
    id: string;
    content: string;
    finished: boolean;
    model: string;
    timestamp: number;
}

export interface LLMResponse {
    id: string;
    content: string;
    model: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason?: string;
}

export interface PromptRequest {
    messages: ChatMessage[];
    llmProvider?: string;
    model?: string;
    stream?: boolean;
    temperature?: number;
    maxTokens?: number;
}
