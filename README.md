# Notification SDK

A TypeScript-based client SDK for interacting with a backend notification system. This SDK is designed for React Native and web applications to manage notifications, track events, and receive real-time updates.

## Features

- 🔔 **Notification Management**: Sync, dismiss, and track notifications
- 📡 **Real-time Updates**: WebSocket connection for instant notification delivery
- 📊 **Event Tracking**: Batch processing of analytics events
- 🔐 **Authentication**: Token-based authentication with device identification
- 📱 **Cross-platform**: Works with React Native, web, and mobile apps
- 🚀 **TypeScript**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
# Using Yarn
yarn add notification-sdk

# Using npm
npm install notification-sdk
```

## Quick Start

### Basic Setup

```typescript
import NotificationSDK from 'notification-sdk';

// Initialize the SDK
NotificationSDK.initialize({
  baseUrl: 'https://api.notifications.com',
  authToken: 'your-auth-token',
  deviceId: 'unique-device-id',
  deviceMetadata: {
    platform: 'iOS',
    os_version: '17.2',
    app_version: '2.3.1',
    country: 'US',
    lang: 'en'
  }
});
```

### Sync Notifications

```typescript
// Get all active notifications for the device
const notifications = await NotificationSDK.syncNotifications();
console.log('Active notifications:', notifications);
```

### Real-time Updates

```typescript
// Connect to WebSocket for real-time notifications
await NotificationSDK.connectWebSocket();

// Listen for new notifications
NotificationSDK.onNotification((notification) => {
  console.log('New notification received:', notification);
  // Handle the notification (show toast, update UI, etc.)
});
```

### Event Tracking

```typescript
// Track a single event
NotificationSDK.trackEvent({
  event_type: 'notification_viewed',
  notification_id: 'notif_123',
  device_id: 'device_456',
  properties: {
    time_to_view: 45,
    user_state: 'active'
  }
});

// Track multiple events in batch
NotificationSDK.trackBatch([
  {
    event_type: 'notification_clicked',
    notification_id: 'notif_123',
    device_id: 'device_456'
  },
  {
    event_type: 'app_opened',
    device_id: 'device_456'
  }
]);
```

### Dismiss Notifications

```typescript
// Dismiss a notification
await NotificationSDK.dismissNotification('notif_123');
```

## API Reference

### Initialization

#### `initialize(config: SDKConfig): void`

Initialize the SDK with configuration.

```typescript
interface SDKConfig {
  baseUrl: string;           // Backend API URL
  authToken: string;         // Authentication token
  deviceId: string;          // Unique device identifier
  deviceMetadata?: DeviceMetadata; // Optional device info
}
```

### Device Management

#### `registerDevice(deviceMetadata: DeviceMetadata): Promise<void>`

Register the device with the server.

```typescript
interface DeviceMetadata {
  platform: 'iOS' | 'Android' | 'Web';
  os_version: string;
  app_version: string;
  country?: string;
  lang?: string;
  push_token?: string;
}
```

### Notifications

#### `syncNotifications(): Promise<Notification[]>`

Fetch active notifications for the device.

#### `dismissNotification(notificationId: string): Promise<void>`

Mark a notification as dismissed.

#### `onNotification(callback: NotificationCallback): void`

Register callback for real-time notification events.

### WebSocket

#### `connectWebSocket(): Promise<void>`

Connect to WebSocket for real-time updates.

#### `disconnectWebSocket(): void`

Disconnect from WebSocket.

#### `isWebSocketConnected(): boolean`

Check if WebSocket is connected.

### Event Tracking

#### `trackEvent(event: TrackingEvent): void`

Track a single analytics event.

#### `trackBatch(events: TrackingEvent[]): void`

Track multiple events in batch.

#### `flushEvents(): Promise<void>`

Force flush all pending events.

#### `getEventQueueSize(): number`

Get current number of queued events.

### Utility Methods

#### `isInitialized(): boolean`

Check if SDK is initialized.

#### `clearEvents(): void`

Clear all pending events.

## Data Models

### Notification

```typescript
interface Notification {
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
```

### TrackingEvent

```typescript
interface TrackingEvent {
  event_id: string;          // Auto-generated
  event_type: string;        // Event type (e.g., 'notification_viewed')
  notification_id?: string;  // Optional notification ID
  device_id: string;         // Device identifier
  timestamp: string;         // Auto-generated ISO timestamp
  properties?: Record<string, any>; // Custom properties
}
```

## Advanced Usage

### Custom Event Tracking

```typescript
// Track custom events
NotificationSDK.trackEvent({
  event_type: 'feature_used',
  device_id: 'device_456',
  properties: {
    feature_name: 'push_notifications',
    user_segment: 'premium',
    session_duration: 1800
  }
});
```

### Error Handling

```typescript
try {
  await NotificationSDK.syncNotifications();
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Handle network errors
    console.log('Network error, will retry later');
  } else if (error.code === 'NOT_INITIALIZED') {
    // Handle initialization errors
    console.log('SDK not initialized');
  }
}
```

### WebSocket Connection Management

```typescript
// Listen for connection changes
NotificationSDK.onConnectionChange((connected) => {
  if (connected) {
    console.log('WebSocket connected');
  } else {
    console.log('WebSocket disconnected');
  }
});

// Manual connection management
await NotificationSDK.connectWebSocket();
// ... later
NotificationSDK.disconnectWebSocket();
```

### Batch Event Processing

The SDK automatically batches events and sends them to the server:
- Maximum 50 events per batch
- Flush every 30 seconds
- Automatic retry on failure
- Exponential backoff for retries

```typescript
// Check queue status
const queueSize = NotificationSDK.getEventQueueSize();
console.log(`Events in queue: ${queueSize}`);

// Force flush all events
await NotificationSDK.flushEvents();
```

## Configuration

### Environment Variables

```bash
# Backend API URL
NOTIFICATION_API_URL=https://api.notifications.com

# Authentication token
NOTIFICATION_AUTH_TOKEN=your-token-here

# Device ID (should be unique per device)
DEVICE_ID=unique-device-identifier
```

### Logging

```typescript
import { logger, LogLevel } from 'notification-sdk';

// Configure logging
logger.setLevel(LogLevel.DEBUG);
logger.setEnabled(true);

// Custom logger
logger.info('SDK initialized');
logger.debug('Event tracked', { event_type: 'notification_viewed' });
logger.error('API request failed', error);
```

## Development

### Building

```bash
# Install dependencies
yarn install

# Build the SDK
yarn build

# Watch mode for development
yarn dev

# Lint code
yarn lint

# Format code
yarn format
```

### Testing

```bash
# Run tests
yarn test
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Notification SDK                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │Notification │  │ WebSocket    │  │   Event Queue   │  │
│  │  Manager    │  │   Client     │  │                 │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
│         │                │                    │            │
│         ▼                ▼                    ▼            │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   API       │  │   Real-time  │  │   Batch         │  │
│  │  Client     │  │   Updates    │  │   Processing    │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Error Codes

| Code | Description | Retryable |
|------|-------------|-----------|
| `NOT_INITIALIZED` | SDK not initialized | No |
| `NETWORK_ERROR` | Network connection failed | Yes |
| `HTTP_401` | Unauthorized | No |
| `HTTP_403` | Forbidden | No |
| `HTTP_500` | Server error | Yes |

## License

MIT License - see LICENSE file for details.

