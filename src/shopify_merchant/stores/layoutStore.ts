import { create } from 'zustand';

interface LayoutState {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  settingsToast: string | null;
  showSettingsToast: (msg: string) => void;
  clearSettingsToast: () => void;
  showQuickNav: boolean;
  toggleQuickNav: (show?: boolean) => void;
}

// 从 URL 获取初始 tab
const getInitialTabFromUrl = () => {
  const hash = window.location.hash.slice(1);
  return hash || 'home';
};

export const useLayoutStore = create<LayoutState>((set) => ({
  currentTab: getInitialTabFromUrl(),
  setCurrentTab: (tab) => {
    // 更新 URL
    window.location.hash = tab;
    set({ currentTab: tab });
  },
  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  settingsToast: null,
  showSettingsToast: (msg) => {
    set({ settingsToast: msg });
    setTimeout(() => {
      set({ settingsToast: null });
    }, 3000);
  },
  clearSettingsToast: () => set({ settingsToast: null }),
  showQuickNav: false,
  toggleQuickNav: (show) => set((state) => ({ showQuickNav: show !== undefined ? show : !state.showQuickNav })),
}));
