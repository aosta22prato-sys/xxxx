import { create } from 'zustand';

export type PreviewType = 'order' | 'product' | 'customer' | 'sidekick' | 'discount' | 'help' | 'app-embed' | null;

interface PanelState {
  selectedPreview: {
    type: PreviewType;
    id: string | null;
  } | null;
  setSelectedPreview: (preview: { type: PreviewType; id: string | null } | null) => void;
  togglePreview: (type: PreviewType, id?: string | null) => void;
  closePreview: () => void;
}

export const usePanelStore = create<PanelState>((set, get) => ({
  selectedPreview: { type: 'sidekick', id: null }, // Pre-open Sidekick assistant by default for engaging experience
  setSelectedPreview: (preview) => set({ selectedPreview: preview }),
  togglePreview: (type, id = null) => {
    const current = get().selectedPreview;
    if (current && current.type === type && current.id === id) {
      set({ selectedPreview: null });
    } else {
      set({ selectedPreview: { type, id } });
    }
  },
  closePreview: () => set({ selectedPreview: null }),
}));
