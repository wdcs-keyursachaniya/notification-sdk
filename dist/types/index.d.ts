export interface Notification {
    id: string;
    subject: string;
    message: string;
    link?: string;
    image?: string;
    expired_date?: string;
    created_at: string;
    created_by: string;
    active: boolean;
    stats?: {
        sent_count: number;
        delivered_count: number;
        viewed_count: number;
        clicked_count: number;
        dismissed_count: number;
        failed_count: number;
    };
}
export interface DeviceMetadata {
    platform: 'iOS' | 'Android' | 'Web';
    os_version: string;
    app_version: string;
    country?: string;
    lang?: string;
    push_token?: string;
}
export interface User {
    device_id: string;
    email?: string;
    ip?: string;
    country?: string;
    lang?: string;
    device: DeviceMetadata;
    notifications?: {
        dismissed: string[];
        clicked: string[];
        last_viewed?: string;
    };
    sessions?: {
        total_count: number;
        current_session_start?: string;
        last_session_duration?: number;
        avg_session_duration?: number;
    };
    metrics?: {
        notification_interaction_rate: number;
        avg_time_to_interaction: number;
        total_notifications_received: number;
        total_notifications_clicked: number;
    };
    created_at: string;
    last_seen: string;
}
export interface TrackingEvent {
    event_id: string;
    event_type: string;
    notification_id?: string;
    device_id: string;
    timestamp: string;
    properties?: Record<string, any>;
}
export interface SDKConfig {
    baseUrl: string;
    authToken: string;
    deviceId: string;
    deviceMetadata?: DeviceMetadata;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    retryable?: boolean;
}
export interface WebSocketMessage {
    type: 'new' | 'update' | 'delete';
    notification?: Notification;
    notification_id?: string;
    updates?: Partial<Notification>;
    timestamp: string;
}
export interface NotificationCallback {
    (notification: Notification): void;
}
export interface EventCallback {
    (event: TrackingEvent): void;
}
export interface SDKError extends Error {
    code: string;
    retryable: boolean;
    status?: number;
}
//# sourceMappingURL=index.d.ts.map