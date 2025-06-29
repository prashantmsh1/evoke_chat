import { LLMConfig } from "@/types/llm.types";

export class LLMConfigService {
    private static configs: Map<string, LLMConfig> = new Map();

    // Initialize default configurations
    static initialize() {
        // OpenAI configurations
        this.configs.set("gpt-4", {
            provider: "openai",
            model: "gpt-4-turbo-preview",
            apiKey: process.env.OPENAI_API_KEY,
            temperature: 0.7,
            maxTokens: 4096,
            streamingEnabled: true,
        });

        this.configs.set("gpt-3.5", {
            provider: "openai",
            model: "gpt-3.5-turbo",
            apiKey: process.env.OPENAI_API_KEY,
            temperature: 0.7,
            maxTokens: 4096,
            streamingEnabled: true,
        });

        // Anthropic configurations
        this.configs.set("claude-3", {
            provider: "anthropic",
            model: "claude-3-sonnet-20240229",
            apiKey: process.env.ANTHROPIC_API_KEY,
            temperature: 0.7,
            maxTokens: 4096,
            streamingEnabled: true,
        });

        // Google configurations
        this.configs.set("gemini_2_5_flash", {
            provider: "google",
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.7,
            maxTokens: 8192,
            streamingEnabled: true,
            tools: [{ googleSearch: {} }],
        });

        // Local model configurations
        this.configs.set("llama-local", {
            provider: "local",
            model: "llama2-7b",
            baseUrl: process.env.LOCAL_LLM_URL || "http://localhost:8000",
            temperature: 0.7,
            maxTokens: 4096,
            streamingEnabled: true,
        });
    }

    static getConfig(configName: string): LLMConfig {
        const config = this.configs.get(configName);
        if (!config) {
            throw new Error(`LLM configuration '${configName}' not found`);
        }
        return { ...config }; // Return a copy
    }

    static getAllConfigs(): Record<string, LLMConfig> {
        const result: Record<string, LLMConfig> = {};
        this.configs.forEach((config, name) => {
            result[name] = { ...config };
        });
        return result;
    }

    static addConfig(name: string, config: LLMConfig): void {
        this.configs.set(name, config);
    }

    static updateConfig(name: string, updates: Partial<LLMConfig>): void {
        const existingConfig = this.configs.get(name);
        if (!existingConfig) {
            throw new Error(`LLM configuration '${name}' not found`);
        }
        this.configs.set(name, { ...existingConfig, ...updates });
    }

    static deleteConfig(name: string): boolean {
        return this.configs.delete(name);
    }
}
