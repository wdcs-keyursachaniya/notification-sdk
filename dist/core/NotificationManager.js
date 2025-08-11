"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationManager = exports.NotificationManager = void 0;
const config_1 = require("../config");
const ApiClient_1 = require("./ApiClient");
const WebSocketClient_1 = require("./WebSocketClient");
const EventQueue_1 = require("../events/EventQueue");
const logger_1 = require("../utils/logger");
class NotificationManager {
    constructor() {
        this._isInitialized = false;
    }
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    /**
     * Initialize the SDK with configuration
     */
    initialize(config) {
        try {
            logger_1.logger.info('Initializing Notification SDK');
            // Initialize configuration
            config_1.config.initialize(config);
            this._isInitialized = true;
            // Register device if metadata is provided (after setting initialized flag)
            if (config.deviceMetadata) {
                this.registerDevice(config.deviceMetadata).catch(error => {
                    logger_1.logger.error('Failed to register device during initialization', error);
                });
            }
            logger_1.logger.info('Notification SDK initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize SDK', error);
            throw error;
        }
    }
    /**
     * Register device with the server
     */
    async registerDevice(deviceMetadata) {
        this.ensureInitialized();
        try {
            logger_1.logger.info('Registering device with server');
            const response = await ApiClient_1.apiClient.post('/api/users/register', {
                device_id: config_1.config.getDeviceId(),
                ...deviceMetadata,
            });
            if (response.success) {
                logger_1.logger.info('Device registered successfully');
            }
            else {
                throw new Error(response.error || 'Failed to register device');
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to register device', error);
            throw error;
        }
    }
    /**
     * Sync notifications from server
     */
    async syncNotifications() {
        this.ensureInitialized();
        try {
            logger_1.logger.info('Syncing notifications from server');
            const deviceId = config_1.config.getDeviceId();
            const response = await ApiClient_1.apiClient.get(`/api/users/${deviceId}/notifications`);
            if (response.success && response.data) {
                logger_1.logger.info(`Synced ${response.data.notifications.length} notifications`);
                return response.data.notifications;
            }
            else {
                throw new Error(response.error || 'Failed to sync notifications');
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to sync notifications', error);
            throw error;
        }
    }
    /**
     * Dismiss a notification
     */
    async dismissNotification(notificationId) {
        this.ensureInitialized();
        try {
            logger_1.logger.info(`Dismissing notification: ${notificationId}`);
            const deviceId = config_1.config.getDeviceId();
            const response = await ApiClient_1.apiClient.post(`/api/users/${deviceId}/dismiss/${notificationId}`);
            if (response.success) {
                logger_1.logger.info(`Notification ${notificationId} dismissed successfully`);
                // Track the dismiss event
                this.trackEvent({
                    event_type: 'notification_dismissed',
                    notification_id: notificationId,
                    device_id: config_1.config.getDeviceId(),
                });
            }
            else {
                throw new Error(response.error || 'Failed to dismiss notification');
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to dismiss notification', error);
            throw error;
        }
    }
    /**
     * Track a single event
     */
    trackEvent(event) {
        this.ensureInitialized();
        try {
            EventQueue_1.eventQueue.addEvent(event);
        }
        catch (error) {
            logger_1.logger.error('Failed to track event', error);
        }
    }
    /**
     * Track multiple events in batch
     */
    trackBatch(events) {
        this.ensureInitialized();
        try {
            events.forEach(event => {
                EventQueue_1.eventQueue.addEvent(event);
            });
            logger_1.logger.debug(`Added ${events.length} events to batch`);
        }
        catch (error) {
            logger_1.logger.error('Failed to track batch events', error);
        }
    }
    /**
     * Connect to WebSocket for real-time updates
     */
    async connectWebSocket() {
        this.ensureInitialized();
        try {
            logger_1.logger.info('Connecting to WebSocket');
            await WebSocketClient_1.webSocketClient.connect();
        }
        catch (error) {
            logger_1.logger.error('Failed to connect to WebSocket', error);
            throw error;
        }
    }
    /**
     * Disconnect from WebSocket
     */
    disconnectWebSocket() {
        WebSocketClient_1.webSocketClient.disconnect();
    }
    /**
     * Register callback for notification events
     */
    onNotification(callback) {
        WebSocketClient_1.webSocketClient.onNotification(callback);
    }
    /**
     * Remove notification callback
     */
    removeNotificationCallback(callback) {
        WebSocketClient_1.webSocketClient.removeNotificationCallback(callback);
    }
    /**
     * Check if WebSocket is connected
     */
    isWebSocketConnected() {
        return WebSocketClient_1.webSocketClient.isConnected();
    }
    /**
     * Get current queue size
     */
    getEventQueueSize() {
        return EventQueue_1.eventQueue.getQueueSize();
    }
    /**
     * Force flush all pending events
     */
    async flushEvents() {
        await EventQueue_1.eventQueue.forceFlush();
    }
    /**
     * Clear all pending events
     */
    clearEvents() {
        EventQueue_1.eventQueue.clear();
    }
    /**
     * Check if SDK is initialized
     */
    isInitialized() {
        return this._isInitialized && config_1.config.isInitialized();
    }
    ensureInitialized() {
        if (!this.isInitialized()) {
            const error = new Error('SDK not initialized. Call initialize() first.');
            error.code = 'NOT_INITIALIZED';
            error.retryable = false;
            throw error;
        }
    }
}
exports.NotificationManager = NotificationManager;
exports.notificationManager = NotificationManager.getInstance();
//# sourceMappingURL=NotificationManager.js.map