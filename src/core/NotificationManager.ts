import { config as sdkConfig } from '../config';
import { apiClient } from './ApiClient';
import { webSocketClient } from './WebSocketClient';
import { eventQueue } from '../events/EventQueue';
import { logger } from '../utils/logger';
import {
  SDKConfig,
  DeviceMetadata,
  Notification,
  TrackingEvent,
  NotificationCallback,
  SDKError,
} from '../types';

export class NotificationManager {
  private static instance: NotificationManager;
  private _isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Initialize the SDK with configuration
   */
  async initialize(config: SDKConfig): Promise<void> {
    try {
      logger.info('Initializing Notification SDK');

      // Initialize configuration
      sdkConfig.initialize(config);

      this._isInitialized = true;

      // Register device if metadata is provided (after setting initialized flag)
      if (config.deviceMetadata) {
        await this.registerDevice(config.deviceMetadata).catch(error => {
          logger.error(
            'Failed to register device during initialization',
            error
          );
          throw error;
        });
      }
      logger.info('Notification SDK initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SDK', error);
      throw error;
    }
  }

  /**
   * Register device with the server
   */
  async registerDevice(deviceMetadata: DeviceMetadata): Promise<void> {
    this.ensureInitialized();

    try {
      logger.info('Registering device with server');

      const response = await apiClient.post('/api/users/register', {
        device_id: sdkConfig.getDeviceId(),
        ...deviceMetadata,
      });

      if (response.success) {
        logger.info('Device registered successfully');
      } else {
        throw new Error(response.error || 'Failed to register device');
      }
    } catch (error) {
      logger.error('Failed to register device', error);
      throw error;
    }
  }

  /**
   * Sync notifications from server
   */
  async syncNotifications(): Promise<Notification[]> {
    this.ensureInitialized();

    try {
      logger.info('Syncing notifications from server');

      const deviceId = sdkConfig.getDeviceId();
      const response = await apiClient.get<Notification[]>(
        `/api/users/${deviceId}/notifications`
      );

      if (response.success && response.data) {
        logger.info(`Synced ${response.data.length} notifications`);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to sync notifications');
      }
    } catch (error) {
      logger.error('Failed to sync notifications', error);
      throw error;
    }
  }

  /**
   * Dismiss a notification
   */
  async dismissNotification(notificationId: string): Promise<void> {
    this.ensureInitialized();

    try {
      logger.info(`Dismissing notification: ${notificationId}`);

      const deviceId = sdkConfig.getDeviceId();
      const response = await apiClient.post(
        `/api/users/${deviceId}/dismiss/${notificationId}`
      );

      if (response.success) {
        logger.info(`Notification ${notificationId} dismissed successfully`);

        // Track the dismiss event
        await this.trackEvent({
          event_type: 'notification_dismissed',
          notification_id: notificationId,
          device_id: sdkConfig.getDeviceId(),
        });
      } else {
        throw new Error(response.error || 'Failed to dismiss notification');
      }
    } catch (error) {
      logger.error('Failed to dismiss notification', error);
      throw error;
    }
  }

  /**
   * Track a single event (queued for batch processing)
   */
  async trackEvent(
    event: Omit<TrackingEvent, 'event_id' | 'timestamp'>
  ): Promise<void> {
    this.ensureInitialized();

    try {
      await eventQueue.trackEventImmediate(event);
    } catch (error) {
      logger.error('Failed to track event', error);
    }
  }

  /**
   * Track multiple events in batch
   */
  trackBatch(events: Omit<TrackingEvent, 'event_id' | 'timestamp'>[]): void {
    this.ensureInitialized();

    try {
      events.forEach(event => {
        eventQueue.addEvent(event);
      });
      logger.debug(`Added ${events.length} events to batch`);
    } catch (error) {
      logger.error('Failed to track batch events', error);
    }
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  async connectWebSocket(): Promise<void> {
    this.ensureInitialized();

    try {
      logger.info('Connecting to WebSocket');
      await webSocketClient.connect();
    } catch (error) {
      logger.error('Failed to connect to WebSocket', error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnectWebSocket(): void {
    webSocketClient.disconnect();
  }

  /**
   * Register callback for notification events
   */
  onNotification(callback: NotificationCallback): void {
    webSocketClient.onNotification(callback);
  }

  /**
   * Remove notification callback
   */
  removeNotificationCallback(callback: NotificationCallback): void {
    webSocketClient.removeNotificationCallback(callback);
  }

  /**
   * Check if WebSocket is connected
   */
  isWebSocketConnected(): boolean {
    return webSocketClient.isConnected();
  }

  /**
   * Get current queue size
   */
  getEventQueueSize(): number {
    return eventQueue.getQueueSize();
  }

  /**
   * Force flush all pending events
   */
  async flushEvents(): Promise<void> {
    await eventQueue.forceFlush();
  }

  /**
   * Clear all pending events
   */
  clearEvents(): void {
    eventQueue.clear();
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this._isInitialized && sdkConfig.isInitialized();
  }

  private ensureInitialized(): void {
    if (!this.isInitialized()) {
      const error = new Error(
        'SDK not initialized. Call initialize() first.'
      ) as SDKError;
      error.code = 'NOT_INITIALIZED';
      error.retryable = false;
      throw error;
    }
  }
}

export const notificationManager = NotificationManager.getInstance();
