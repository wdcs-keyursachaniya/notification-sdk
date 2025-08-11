import { NotificationCallback } from '../types';
export declare class WebSocketClient {
    private static instance;
    private ws;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private isConnecting;
    private notificationCallbacks;
    private connectionCallbacks;
    private constructor();
    static getInstance(): WebSocketClient;
    connect(): Promise<void>;
    private handleMessage;
    private handleReconnect;
    disconnect(): void;
    isConnected(): boolean;
    onNotification(callback: NotificationCallback): void;
    onConnectionChange(callback: (connected: boolean) => void): void;
    private notifyNotificationCallbacks;
    private notifyConnectionCallbacks;
    removeNotificationCallback(callback: NotificationCallback): void;
    removeConnectionCallback(callback: (connected: boolean) => void): void;
}
export declare const webSocketClient: WebSocketClient;
//# sourceMappingURL=WebSocketClient.d.ts.map