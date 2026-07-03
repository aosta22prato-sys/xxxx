// Ollama service for local LLM integration
export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl?: string, defaultModel?: string) {
    this.baseUrl = baseUrl || 'http://localhost:11434';
    this.defaultModel = defaultModel || 'qwen2.5:7b';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('[Ollama] Service not available:', error);
      return false;
    }
  }

  async listModels(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: any = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('[Ollama] Failed to fetch models:', error);
      throw error;
    }
  }

  async chat(
    messages: any[],
    model?: string,
    options?: any
  ): Promise<any> {
    const request: any = {
      model: model || this.defaultModel,
      messages,
      stream: false,
      options,
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Ollama] Chat failed:', error);
      throw error;
    }
  }

  async generate(
    prompt: string,
    systemPrompt?: string,
    model?: string,
    options?: any
  ): Promise<string> {
    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    const result = await this.chat(messages, model, options);
    return result.message.content;
  }

  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.some((model: any) => model.name === modelName);
    } catch {
      return false;
    }
  }

  async pullModel(modelName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: false })
    });
    if (!response.ok) throw new Error('Failed to pull model');
    return response.json();
  }
}

let ollamaInstance: OllamaService | null = null;

export function getOllamaService(baseUrl?: string, defaultModel?: string): OllamaService {
  if (!ollamaInstance) {
    const finalBaseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const finalModel = defaultModel || process.env.OLLAMA_DEFAULT_MODEL || 'llama3.2:latest';
    ollamaInstance = new OllamaService(finalBaseUrl, finalModel);
  }
  return ollamaInstance;
}