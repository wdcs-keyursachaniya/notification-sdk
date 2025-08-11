import { SDKConfig, DeviceMetadata, Notification, TrackingEvent, NotificationCallback } from '../types';
export declare class NotificationManager {
    private static instance;
    private _isInitialized;
    private constructor();
    static getInstance(): NotificationManager;
    /**
     * Initialize the SDK with configuration
     */
    initialize(config: SDKConfig): void;
    /**
     * Register device with the server
     */
    registerDevice(deviceMetadata: DeviceMetadata): Promise<void>;
    /**
     * Sync notifications from server
     */
    syncNotifications(): Promise<Notification[]>;
    /**
     * Dismiss a notification
     */
    dismissNotification(notificationId: string): Promise<void>;
    /**
     * Track a single event
     */
    trackEvent(event: Omit<TrackingEvent, 'event_id' | 'timestamp'>): void;
    /**
     * Track multiple events in batch
     */
    trackBatch(events: Omit<TrackingEvent, 'event_id' | 'timestamp'>[]): void;
    /**
     * Connect to WebSocket for real-time updates
     */
    connectWebSocket(): Promise<void>;
    /**
     * Disconnect from WebSocket
     */
    disconnectWebSocket(): void;
    /**
     * Register callback for notification events
     */
    onNotification(callback: NotificationCallback): void;
    /**
     * Remove notification callback
     */
    removeNotificationCallback(callback: NotificationCallback): void;
    /**
     * Check if WebSocket is connected
     */
    isWebSocketConnected(): boolean;
    /**
     * Get current queue size
     */
    getEventQueueSize(): number;
    /**
     * Force flush all pending events
     */
    flushEvents(): Promise<void>;
    /**
     * Clear all pending events
     */
    clearEvents(): void;
    /**
     * Check if SDK is initialized
     */
    isInitialized(): boolean;
    private ensureInitialized;
}
export declare const notificationManager: NotificationManager;
//# sourceMappingURL=NotificationManager.d.ts.map