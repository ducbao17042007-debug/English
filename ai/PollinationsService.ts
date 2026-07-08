// src/services/ai/PollinationsService.ts
import { TEDDY_SYSTEM_PROMPT } from './AIService';
import type { AIService, ChatMessage } from './AIService';

export class PollinationsService implements AIService {
  async sendMessage(message: string, history: ChatMessage[]): Promise<string> {
    const url = 'https://text.pollinations.ai/';

    // Build messages array in OpenAI format
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: TEDDY_SYSTEM_PROMPT }
    ];

    // Add conversation history
    history.forEach((msg) => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'openai',       // dùng GPT-4o mini miễn phí
        seed: 42,
        private: true,         // không lưu vào public feed
        jsonMode: false
      })
    });

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response from Pollinations');
    }

    return text.trim();
  }
}
