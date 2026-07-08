// src/services/ai/AIServiceFactory.ts
import type { AIService } from './AIService';
import { GeminiService } from './GeminiService';
import { OpenAIService } from './OpenAIService';
import { PollinationsService } from './PollinationsService';

export class AIServiceFactory {
  static getAIService(provider: string, apiKey: string): AIService {
    // If a specific API key is provided, use the corresponding service
    if (apiKey && apiKey.trim() && !apiKey.includes('your_') && !apiKey.includes('_here')) {
      switch (provider.toLowerCase()) {
        case 'gemini':
          return new GeminiService(apiKey);
        case 'openai':
        case 'chatgpt':
          return new OpenAIService(apiKey);
      }
    }

    // Default: use Pollinations.ai (free, no API key needed)
    return new PollinationsService();
  }
}
