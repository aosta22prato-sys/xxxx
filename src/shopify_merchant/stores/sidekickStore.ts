import { create } from 'zustand';
import { ChatMessage } from '../types';

interface SidekickState {
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  addMessage: (message: ChatMessage) => void;
  setGenerating: (status: boolean) => void;
  clearHistory: () => void;
}

export const useSidekickStore = create<SidekickState>((set) => ({
  chatHistory: [
    {
      id: 'init-1',
      role: 'model',
      text: '您好，我是 Atelier Noir AI 智能助理。我可以协助您智能预测商品需求、核算跨国欧盟增值税、分析废弃订单挽回率，或跨时区分配主仓库发货标签。您想从哪个业务模块开始探讨？',
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  isGenerating: false,
  addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
  setGenerating: (status) => set({ isGenerating: status }),
  clearHistory: () => set({ chatHistory: [] }),
}));
