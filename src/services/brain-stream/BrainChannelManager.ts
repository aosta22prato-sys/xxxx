import { dbEngine } from '../../db/dbEngine';
import { BrainChannel, BrainStream } from '../../types';

class BrainChannelManagerService {
  private static instance: BrainChannelManagerService;

  private constructor() {
    this.ensureDefaultChannelsAndStreams();
  }

  public static getInstance(): BrainChannelManagerService {
    if (!BrainChannelManagerService.instance) {
      BrainChannelManagerService.instance = new BrainChannelManagerService();
    }
    return BrainChannelManagerService.instance;
  }

  /**
   * Seed default channels and streams if empty so there is visible initial data for the operator panel
   */
  public ensureDefaultChannelsAndStreams() {
    const existingChannels = dbEngine.brain_channels.getAll();
    if (existingChannels.length === 0) {
      const defaults: Omit<BrainChannel, 'id'>[] = [
        { channel_code: 'SIDEKICK_CHAT', channel_name: 'Shopify Sidekick Gateway', channel_status: 'ACTIVE', subscribers_count: 1 },
        { channel_code: 'EMAIL_FEED', channel_name: 'Autonomous Email Operator', channel_status: 'ACTIVE', subscribers_count: 3 },
        { channel_code: 'ADMIN_PANEL_REALTIME', channel_name: 'Super Admin Real-Time Console', channel_status: 'ACTIVE', subscribers_count: 5 },
        { channel_code: 'SYSTEM_WEBHOOK', channel_name: 'Dynamic SaaS Webhook Integration', channel_status: 'PAUSED', subscribers_count: 0 }
      ];
      defaults.forEach(d => dbEngine.brain_channels.create(d));
    }

    const existingStreams = dbEngine.brain_streams.getAll();
    if (existingStreams.length === 0) {
      const defaultStreams: Omit<BrainStream, 'id'>[] = [
        { stream_name: 'General Business Output Stream', stream_key: 'general', data_throughput_kb: 124.5, total_events_dispatched: 156, status: 'ONLINE', updated_at: new Date().toISOString() },
        { stream_name: 'Security, Gaps & Governance Stream', stream_key: 'governance', data_throughput_kb: 45.2, total_events_dispatched: 38, status: 'ONLINE', updated_at: new Date().toISOString() },
        { stream_name: 'Merchant Analytics & Prediction Stream', stream_key: 'analytics', data_throughput_kb: 89.1, total_events_dispatched: 112, status: 'ONLINE', updated_at: new Date().toISOString() }
      ];
      defaultStreams.forEach(s => dbEngine.brain_streams.create(s));
    }
  }

  public toggleChannel(channelId: string, status: 'ACTIVE' | 'PAUSED' | 'BROKEN'): void {
    dbEngine.brain_channels.update(channelId, { channel_status: status });
  }

  public toggleStream(streamId: string, status: 'ONLINE' | 'OFFLINE'): void {
    dbEngine.brain_streams.update(streamId, { status, updated_at: new Date().toISOString() });
  }
}

export const BrainChannelManager = BrainChannelManagerService.getInstance();
