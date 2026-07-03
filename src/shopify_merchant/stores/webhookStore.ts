import { create } from 'zustand';
import { ApiKey, WebhookSubscription, WebhookLog } from '../database/webhooks';
import { WebhookService } from '../services/webhook.service';

interface WebhookState {
  apiKeys: ApiKey[];
  webhooks: WebhookSubscription[];
  logs: WebhookLog[];
  hydrate: () => void;
  addApiKey: (key: ApiKey) => void;
  deleteApiKey: (id: string) => void;
  addWebhook: (sub: WebhookSubscription) => void;
  updateWebhookStatus: (id: string, status: 'active' | 'paused') => void;
  deleteWebhook: (id: string) => void;
  triggerWebhookSimulation: (id: string) => WebhookLog;
}

export const useWebhookStore = create<WebhookState>((set, get) => ({
  apiKeys: [],
  webhooks: [],
  logs: [],

  hydrate: () => {
    const data = WebhookService.getData();
    set({ apiKeys: data.apiKeys, webhooks: data.webhooks, logs: data.logs });
  },

  addApiKey: (key) => {
    const keys = [...get().apiKeys, key];
    set({ apiKeys: keys });
    WebhookService.saveApiKeys(keys);
  },

  deleteApiKey: (id) => {
    const keys = get().apiKeys.filter(k => k.id !== id);
    set({ apiKeys: keys });
    WebhookService.saveApiKeys(keys);
  },

  addWebhook: (sub) => {
    const list = [...get().webhooks, sub];
    set({ webhooks: list });
    WebhookService.saveWebhooks(list);
  },

  updateWebhookStatus: (id, status) => {
    const list = get().webhooks.map(w => w.id === id ? { ...w, status } : w);
    set({ webhooks: list });
    WebhookService.saveWebhooks(list);
  },

  deleteWebhook: (id) => {
    const list = get().webhooks.filter(w => w.id !== id);
    set({ webhooks: list });
    WebhookService.saveWebhooks(list);
  },

  triggerWebhookSimulation: (id) => {
    const freshLog = WebhookService.dispatchMockWebhook(id);
    // Reload state logs and trigger counts
    get().hydrate();
    return freshLog;
  }
}));
