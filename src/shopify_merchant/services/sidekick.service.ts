/**
 * Sidekick Service Layer - Level 10 Separation
 * High-performance service abstraction supporting switching between Mock and real live backend LLM endpoints.
 */

import { ApiService } from './api.service';
import { ServiceProvider } from './product.service';

export class SidekickService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async analyzeInstructions(prompt: string, context: { products: any[]; orders: any[]; customers: any[] }): Promise<string> {
    if (this.provider === 'api') {
      return ApiService.querySidekickAI(prompt, context);
    }

    // Default heuristic mock response for immediate premium performance
    return ApiService.heuristicResponse(prompt, context);
  }
}
