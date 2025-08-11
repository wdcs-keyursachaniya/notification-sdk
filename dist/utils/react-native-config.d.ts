import { PlatformInfo } from './platform';
import { DeviceMetadata } from '../types';
export interface ReactNativeSDKConfig {
    baseUrl: string;
    authToken: string;
    deviceId?: string;
    appVersion?: string;
    deviceMetadata?: Partial<DeviceMetadata>;
}
export declare class ReactNativeConfig {
    /**
     * Initialize the SDK with React Native specific configuration
     * This method automatically detects platform information and sets up the SDK
     */
    static initialize(sdkConfig: ReactNativeSDKConfig): void;
    /**
     * Get the current platform information
     */
    static getPlatformInfo(): PlatformInfo;
    /**
     * Check if running in React Native environment
     */
    static isReactNative(): boolean;
    /**
     * Get device ID (auto-generated if not set)
     */
    static getDeviceId(): string;
    /**
     * Update push token (call this when you receive a new push token)
     */
    static updatePushToken(token: string): void;
    /**
     * Update app version (call this when app version changes)
     */
    static updateAppVersion(version: string): void;
}
//# sourceMappingURL=react-native-config.d.ts.map