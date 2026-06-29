// src/services/ai/AIServiceFactory.ts
import type { AIService } from './AIService';
import { GeminiService } from './GeminiService';
import { OpenAIService } from './OpenAIService';

export class AIServiceFactory {
  static getAIService(provider: string, apiKey: string): AIService | null {
    if (!apiKey.trim()) {
      return null; // Return null to indicate offline simulator should be used
    }

    switch (provider.toLowerCase()) {
      case 'gemini':
        return new GeminiService(apiKey);
      case 'openai':
      case 'chatgpt':
        return new OpenAIService(apiKey);
      default:
        return null;
    }
  }
}
