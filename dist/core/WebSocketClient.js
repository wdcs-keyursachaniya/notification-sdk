"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketClient = exports.WebSocketClient = void 0;
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class WebSocketClient {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
        this.notificationCallbacks = [];
        this.connectionCallbacks = [];
    }
    static getInstance() {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }
    async connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }
        this.isConnecting = true;
        const baseUrl = config_1.config.getBaseUrl();
        const deviceId = config_1.config.getDeviceId();
        // Convert HTTP URL to WebSocket URL
        const wsUrl = baseUrl.replace(/^http/, 'ws') + `/ws?device_id=${deviceId}`;
        try {
            logger_1.logger.info(`Connecting to WebSocket: ${wsUrl}`);
            this.ws = new WebSocket(wsUrl);
            this.ws.onopen = () => {
                logger_1.logger.info('WebSocket connected successfully');
                this.reconnectAttempts = 0;
                this.isConnecting = false;
                this.notifyConnectionCallbacks(true);
            };
            this.ws.onmessage = event => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                }
                catch (error) {
                    logger_1.logger.error('Failed to parse WebSocket message', error);
                }
            };
            this.ws.onclose = event => {
                logger_1.logger.warn(`WebSocket closed: ${event.code} ${event.reason}`);
                this.isConnecting = false;
                this.notifyConnectionCallbacks(false);
                this.handleReconnect();
            };
            this.ws.onerror = error => {
                logger_1.logger.error('WebSocket error', error);
                this.isConnecting = false;
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to create WebSocket connection', error);
            this.isConnecting = false;
            throw error;
        }
    }
    handleMessage(message) {
        logger_1.logger.debug('Received WebSocket message', message);
        switch (message.type) {
            case 'new':
                if (message.notification) {
                    this.notifyNotificationCallbacks(message.notification);
                }
                break;
            case 'update':
                // Handle notification updates
                logger_1.logger.info('Notification updated', message.notification_id);
                break;
            case 'delete':
                // Handle notification deletion
                logger_1.logger.info('Notification deleted', message.notification_id);
                break;
            default:
                logger_1.logger.warn('Unknown message type', message.type);
        }
    }
    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logger_1.logger.error('Max reconnection attempts reached');
            return;
        }
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        logger_1.logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => {
            this.connect().catch(error => {
                logger_1.logger.error('Reconnection failed', error);
            });
        }, delay);
    }
    disconnect() {
        if (this.ws) {
            logger_1.logger.info('Disconnecting WebSocket');
            this.ws.close(1000, 'SDK disconnect');
            this.ws = null;
        }
    }
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
    onNotification(callback) {
        this.notificationCallbacks.push(callback);
    }
    onConnectionChange(callback) {
        this.connectionCallbacks.push(callback);
    }
    notifyNotificationCallbacks(notification) {
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(notification);
            }
            catch (error) {
                logger_1.logger.error('Error in notification callback', error);
            }
        });
    }
    notifyConnectionCallbacks(connected) {
        this.connectionCallbacks.forEach(callback => {
            try {
                callback(connected);
            }
            catch (error) {
                logger_1.logger.error('Error in connection callback', error);
            }
        });
    }
    removeNotificationCallback(callback) {
        const index = this.notificationCallbacks.indexOf(callback);
        if (index > -1) {
            this.notificationCallbacks.splice(index, 1);
        }
    }
    removeConnectionCallback(callback) {
        const index = this.connectionCallbacks.indexOf(callback);
        if (index > -1) {
            this.connectionCallbacks.splice(index, 1);
        }
    }
}
exports.WebSocketClient = WebSocketClient;
exports.webSocketClient = WebSocketClient.getInstance();
//# sourceMappingURL=WebSocketClient.js.map