// Export the main SDK singleton
export { notificationManager as default } from './core/NotificationManager';

// Export individual components for advanced usage
export { NotificationManager } from './core/NotificationManager';
export { ApiClient } from './core/ApiClient';
export { WebSocketClient } from './core/WebSocketClient';
export { EventQueue } from './events/EventQueue';
export { Config } from './config';
export { Logger, LogLevel } from './utils/logger';

// Export all types
export * from './types';

// Export singleton instances
export { apiClient } from './core/ApiClient';
export { webSocketClient } from './core/WebSocketClient';
export { eventQueue } from './events/EventQueue';
export { config } from './config';
export { logger } from './utils/logger';
