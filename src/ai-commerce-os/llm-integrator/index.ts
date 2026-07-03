/**
 * AI Commerce OS - LLM Integration Layer
 *
 * 整合 Ollama 本地 LLM 为核心 AI 能力提供真正的推理引擎
 */

import { getOllamaService } from '../../services/ollama.service';
import { GoogleGenAI } from '@google/genai';

export class LLMIntegrator {
  private static instance: LLMIntegrator;
  private ollama: ReturnType<typeof getOllamaService>;
  private ai: GoogleGenAI | null = null;
  private systemPrompt: string;

  private constructor() {
    console.log('🧠 [LLM Integrator] 初始化 Ollama/Gemini LLM 集成...');
    this.ollama = getOllamaService();
    this.systemPrompt = this.getDefaultSystemPrompt();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      try {
        console.log('🧠 [LLM Integrator] 检测到 GEMINI_API_KEY，启用 Gemini 客户端...');
        this.ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
      } catch (err) {
        console.error('🧠 [LLM Integrator] 初始化 Gemini 失败:', err);
      }
    }
  }

  public static getInstance(): LLMIntegrator {
    if (!LLMIntegrator.instance) {
      LLMIntegrator.instance = new LLMIntegrator();
    }
    return LLMIntegrator.instance;
  }

  private getDefaultSystemPrompt(): string {
    return `你是 AI Commerce OS 的核心 AI 大脑。
你是一个专业的商业智能助手，帮助用户管理电商业务。
你的特点：
1. 专业、务实、直接给出结论和行动建议
2. 善于分析数据、发现问题、提供解决方案
3. 理解电商业务：产品、订单、库存、营销、财务、客户
4. 积极主动，提供可执行的建议，而不是空谈

回答时使用 Markdown 格式，保持简洁、专业、结构化。
`;
  }

  /**
   * 检查 LLM 服务是否可用
   */
  public async isAvailable(): Promise<boolean> {
    if (this.ai) return true;
    try {
      return await this.ollama.isAvailable();
    } catch (error) {
      console.warn('[LLM] Ollama 服务不可用，将使用本地回退:', error);
      return false;
    }
  }

  /**
   * 获取可用模型列表
   */
  public async listModels(): Promise<any[]> {
    if (this.ai) {
      return [{ name: 'gemini-3.5-flash', details: { parameter_size: 'N/A', family: 'gemini' } }];
    }
    try {
      return await this.ollama.listModels();
    } catch (error) {
      console.error('[LLM] 无法获取模型列表:', error);
      return [];
    }
  }

  /**
   * 通用聊天推理
   */
  public async chat(
    messages: any[],
    model?: string,
    options?: any
  ): Promise<any> {
    if (this.ai) {
      try {
        console.log('🤖 [LLM] 正在执行 Gemini 聊天推理...');
        const contents = messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }));

        const systemMessage = messages.find(m => m.role === 'system');
        const systemInstruction = systemMessage ? systemMessage.content : this.systemPrompt;

        const response = await this.ai.models.generateContent({
          model: model || 'gemini-3.5-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        return {
          message: {
            role: 'assistant',
            content: response.text || ''
          },
          done: true
        };
      } catch (err) {
        console.error('🤖 [LLM] Gemini chat failed, falling back to Ollama or local:', err);
      }
    }

    try {
      console.log('🤖 [LLM] 正在执行推理 (Ollama)...');
      return await this.ollama.chat(messages, model, options);
    } catch (error) {
      console.error('[LLM] 推理失败:', error);
      return this.getLocalFallback(messages);
    }
  }

  /**
   * 单次生成
   */
  public async generate(
    prompt: string,
    systemPrompt?: string,
    model?: string
  ): Promise<string> {
    if (this.ai) {
      try {
        console.log('🤖 [LLM] 正在执行 Gemini 单次内容生成...');
        const response = await this.ai.models.generateContent({
          model: model || 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt || this.systemPrompt,
          }
        });
        if (response.text) {
          return response.text;
        }
      } catch (err) {
        console.error('🤖 [LLM] Gemini generation failed, falling back to Ollama or local:', err);
      }
    }

    try {
      const finalSystemPrompt = systemPrompt || this.systemPrompt;
      console.log('🤖 [LLM] 正在生成内容 (Ollama)...');
      return await this.ollama.generate(prompt, finalSystemPrompt, model);
    } catch (error) {
      console.error('[LLM] 生成失败，使用本地回退:', error);
      return this.getLocalFallbackForPrompt(prompt);
    }
  }

  /**
   * Planner 专用推理：目标拆解
   */
  public async planGoal(goal: any): Promise<any> {
    const prompt = `
作为 AI Commerce OS 的 Planner，我需要你拆解以下业务目标，给出可执行的计划：

目标：${JSON.stringify(goal, null, 2)}

请以 JSON 格式返回一个计划，包含以下字段：
{
  "steps": [
    {
      "id": "step-1",
      "description": "描述该步骤",
      "type": "analysis|task|decision|review",
      "assignedTo": "ai-ceo|ai-cmo|ai-coo|ai-cfo",
      "tools": ["tool1", "tool2"],
      "dependencies": ["step-0"]
    }
  ],
  "estimatedTimeMinutes": 15,
  "priorityLevel": "high|medium|low"
}

只返回 JSON，不要其他文字。
`.trim();

    try {
      const rawResult = await this.generate(
        prompt,
        '你是一个专业的 AI Planner，只返回有效的 JSON，不要任何其他文字。'
      );
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getFallbackPlan(goal);
    } catch {
      return this.getFallbackPlan(goal);
    }
  }

  /**
   * Reflection 专用推理：结果分析与建议
   */
  public async reflectOnResult(result: any): Promise<any> {
    const prompt = `
请分析以下执行结果，给出专业的反思和改进建议：

结果数据：
${JSON.stringify(result, null, 2)}

请回答：
1. 成功之处
2. 失败之处（如果有）
3. 下次如何改进
4. 具体建议

请用简洁、专业的中文回答。
`.trim();

    try {
      return await this.generate(prompt);
    } catch {
      return {
        whatWentWell: ['任务完成了基本目标'],
        whatWentWrong: ['LLM 分析不可用，使用默认评估'],
        improvements: ['建议集成本地 LLM 以获得更好效果']
      };
    }
  }

  /**
   * 工具选择与使用推理
   */
  public async selectAndUseTool(
    userMessage: string,
    availableTools: string[]
  ): Promise<{ toolName: string; params: any } | null> {
    const prompt = `
用户问题："${userMessage}"

可用工具：${availableTools.join(', ')}

请分析用户问题，选择最合适的工具并生成参数。
如果不需要工具，返回 null。

如果需要工具，返回以下格式的 JSON：
{
  "toolName": "工具名",
  "params": {}
}

只返回 JSON 或 null。
`.trim();

    try {
      const rawResult = await this.generate(
        prompt,
        '你是一个工具调用专家，只返回 JSON 或 null，不要其他文字。'
      );
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 本地回退方案（无 LLM 时使用）
   */
  public getLocalFallback(messages: any[]): any {
    const lastUserMsg = messages
      .filter((m: any) => m.role === 'user')
      .pop();

    let content = `我是 AI Commerce OS 助手。\n\n`;
    content += `我注意到 Ollama 服务暂不可用，当前使用本地回退模式。\n\n`;
    content += `已为您准备好了以下核心能力：\n`;
    content += `1. 100+ 业务工具调用\n`;
    content += `2. 目标拆解与计划\n`;
    content += `3. 战略模拟\n`;
    content += `4. 自主执行\n\n`;
    content += `启动 Ollama 服务后，我将为您提供更强大的智能分析！`;

    return {
      message: { role: 'assistant', content },
      done: true
    };
  }

  public getLocalFallbackForPrompt(prompt: string): string {
    if (prompt.toLowerCase().includes('计划') || prompt.toLowerCase().includes('plan')) {
      return '我将为您创建一个结构化的执行计划。';
    }
    if (prompt.toLowerCase().includes('反思') || prompt.toLowerCase().includes('reflection')) {
      return '我将分析结果并给出改进建议。';
    }
    return '已收到您的请求，正在处理中。';
  }

  private getFallbackPlan(goal: any): any {
    return {
      steps: [
        {
          id: 'step-1',
          description: '分析当前业务状况',
          type: 'analysis',
          assignedTo: 'ai-ceo',
          tools: ['getFinancialReport'],
          dependencies: []
        },
        {
          id: 'step-2',
          description: '制定执行策略',
          type: 'task',
          assignedTo: 'ai-cmo',
          tools: ['listProducts'],
          dependencies: ['step-1']
        },
        {
          id: 'step-3',
          description: '执行优化',
          type: 'task',
          assignedTo: 'ai-coo',
          tools: ['checkLowStock'],
          dependencies: ['step-2']
        },
        {
          id: 'step-4',
          description: '评估结果',
          type: 'review',
          assignedTo: 'ai-cfo',
          tools: [],
          dependencies: ['step-3']
        }
      ],
      estimatedTimeMinutes: 15,
      priorityLevel: goal.revenue ? 'high' : 'medium'
    };
  }

  public getStatus(): any {
    return {
      available: false,
      models: [],
      capabilities: [
        '本地回退推理',
        '目标拆解',
        '结果分析',
        '工具选择'
      ]
    };
  }
}

export const llmIntegrator = LLMIntegrator.getInstance();
