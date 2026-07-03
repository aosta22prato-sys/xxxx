import { INITIAL_DEVELOPER_DATA, ApiKey, WebhookSubscription, WebhookLog } from '../database/webhooks';

export class WebhookService {
  private static KEYS_STORAGE = 'noir_developer_apikeys';
  private static SUBS_STORAGE = 'noir_developer_webhooks';
  private static LOGS_STORAGE = 'noir_developer_logs';

  static getData() {
    let apiKeys = INITIAL_DEVELOPER_DATA.apiKeys;
    let webhooks = INITIAL_DEVELOPER_DATA.webhooks;
    let logs = INITIAL_DEVELOPER_DATA.logs;

    const storedKeys = localStorage.getItem(this.KEYS_STORAGE);
    const storedWebhooks = localStorage.getItem(this.SUBS_STORAGE);
    const storedLogs = localStorage.getItem(this.LOGS_STORAGE);

    if (storedKeys) apiKeys = JSON.parse(storedKeys);
    else localStorage.setItem(this.KEYS_STORAGE, JSON.stringify(apiKeys));

    if (storedWebhooks) webhooks = JSON.parse(storedWebhooks);
    else localStorage.setItem(this.SUBS_STORAGE, JSON.stringify(webhooks));

    if (storedLogs) logs = JSON.parse(storedLogs);
    else localStorage.setItem(this.LOGS_STORAGE, JSON.stringify(logs));

    return { apiKeys, webhooks, logs };
  }

  static saveApiKeys(keys: ApiKey[]): void {
    localStorage.setItem(this.KEYS_STORAGE, JSON.stringify(keys));
  }

  static saveWebhooks(subs: WebhookSubscription[]): void {
    localStorage.setItem(this.SUBS_STORAGE, JSON.stringify(subs));
  }

  static saveLogs(logs: WebhookLog[]): void {
    localStorage.setItem(this.LOGS_STORAGE, JSON.stringify(logs));
  }

  static dispatchMockWebhook(webhookId: string): WebhookLog {
    const data = this.getData();
    const webhook = data.webhooks.find(w => w.id === webhookId);
    if (!webhook) {
      throw new Error('Target Webhook subscriber not found');
    }

    const start = Date.now();
    // Simulate web transmission dispatch latency
    const responseTimeMs = Math.floor(Math.random() * 250) + 50;
    const isSuccess = Math.random() > 0.15; // 85% success rate simulation

    const freshLog: WebhookLog = {
      id: 'log_' + Date.now(),
      subscriptionId: webhookId,
      topic: webhook.topic,
      statusCode: isSuccess ? 200 : [500, 502, 404, 408][Math.floor(Math.random() * 4)],
      payloadSize: (Math.random() * 3 + 1).toFixed(1) + ' KB',
      responseTimeMs,
      timestamp: new Date().toISOString(),
      status: isSuccess ? 'success' : 'failed'
    };

    const updatedLogs = [freshLog, ...data.logs].slice(0, 50); // Keep last 50
    this.saveLogs(updatedLogs);
    return freshLog;
  }
}
