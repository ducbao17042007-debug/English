// src/services/ai/GeminiService.ts
import { TEDDY_SYSTEM_PROMPT } from './AIService';
import type { AIService, ChatMessage } from './AIService';

export class GeminiService implements AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(message: string, history: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Missing Gemini API Key");
    }

    // Sửa thành dòng này:
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    // Format history for Gemini API
    // Gemini roles: 'user' and 'model'
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: TEDDY_SYSTEM_PROMPT }]
        },
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to fetch from Gemini (Status: ${response.status})`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("Empty response from Gemini");
    }

    return replyText.trim();
  }
}
