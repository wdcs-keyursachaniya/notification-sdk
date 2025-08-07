import { config } from '../config';

// WebSocket types for Node.js environment
declare global {
  interface WebSocket {
    readyState: number;
    OPEN: number;
    onopen: (() => void) | null;
    onmessage: ((event: { data: string }) => void) | null;
    onclose: ((event: { code: number; reason: string }) => void) | null;
    onerror: ((error: any) => void) | null;
    close(code?: number, reason?: string): void;
  }
  
  var WebSocket: {
    new(url: string): WebSocket;
    OPEN: number;
  };
}
import { WebSocketMessage, NotificationCallback } from '../types';
import { logger } from '../utils/logger';

export class WebSocketClient {
  private static instance: WebSocketClient;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private notificationCallbacks: NotificationCallback[] = [];
  private connectionCallbacks: Array<(connected: boolean) => void> = [];

  private constructor() {}

  static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const baseUrl = config.getBaseUrl();
    const deviceId = config.getDeviceId();
    
    // Convert HTTP URL to WebSocket URL
    const wsUrl = baseUrl.replace(/^http/, 'ws') + `/ws?device_id=${deviceId}`;
    
    try {
      logger.info(`Connecting to WebSocket: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        logger.info('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyConnectionCallbacks(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          logger.error('Failed to parse WebSocket message', error);
        }
      };

      this.ws.onclose = (event) => {
        logger.warn(`WebSocket closed: ${event.code} ${event.reason}`);
        this.isConnecting = false;
        this.notifyConnectionCallbacks(false);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        logger.error('WebSocket error', error);
        this.isConnecting = false;
      };

    } catch (error) {
      logger.error('Failed to create WebSocket connection', error);
      this.isConnecting = false;
      throw error;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    logger.debug('Received WebSocket message', message);

    switch (message.type) {
      case 'new':
        if (message.notification) {
          this.notifyNotificationCallbacks(message.notification);
        }
        break;
      case 'update':
        // Handle notification updates
        logger.info('Notification updated', message.notification_id);
        break;
      case 'delete':
        // Handle notification deletion
        logger.info('Notification deleted', message.notification_id);
        break;
      default:
        logger.warn('Unknown message type', message.type);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch((error) => {
        logger.error('Reconnection failed', error);
      });
    }, delay);
  }

  disconnect(): void {
    if (this.ws) {
      logger.info('Disconnecting WebSocket');
      this.ws.close(1000, 'SDK disconnect');
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  onNotification(callback: NotificationCallback): void {
    this.notificationCallbacks.push(callback);
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  private notifyNotificationCallbacks(notification: any): void {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        logger.error('Error in notification callback', error);
      }
    });
  }

  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        logger.error('Error in connection callback', error);
      }
    });
  }

  removeNotificationCallback(callback: NotificationCallback): void {
    const index = this.notificationCallbacks.indexOf(callback);
    if (index > -1) {
      this.notificationCallbacks.splice(index, 1);
    }
  }

  removeConnectionCallback(callback: (connected: boolean) => void): void {
    const index = this.connectionCallbacks.indexOf(callback);
    if (index > -1) {
      this.connectionCallbacks.splice(index, 1);
    }
  }
}

export const webSocketClient = WebSocketClient.getInstance();
