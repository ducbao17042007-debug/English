// src/services/ai/OpenAIService.ts
import { TEDDY_SYSTEM_PROMPT } from './AIService';
import type { AIService, ChatMessage } from './AIService';

export class OpenAIService implements AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(message: string, history: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Missing OpenAI API Key");
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    // Format history for OpenAI chat completions
    const messages = [
      { role: 'system', content: TEDDY_SYSTEM_PROMPT }
    ];

    // Add chat history
    history.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // very cost-effective, fast, and child-safe
        messages,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to fetch from OpenAI (Status: ${response.status})`);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content;

    if (!replyText) {
      throw new Error("Empty response from OpenAI");
    }

    return replyText.trim();
  }
}
