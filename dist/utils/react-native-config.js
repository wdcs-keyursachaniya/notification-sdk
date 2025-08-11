import { PlatformUtils } from './platform';
import { config } from '../config';
export class ReactNativeConfig {
    /**
     * Initialize the SDK with React Native specific configuration
     * This method automatically detects platform information and sets up the SDK
     */
    static initialize(sdkConfig) {
        const platformInfo = PlatformUtils.getPlatformInfo();
        // Auto-generate device ID if not provided
        const deviceId = sdkConfig.deviceId || PlatformUtils.getDeviceId();
        // Use provided app version or auto-detect
        const appVersion = sdkConfig.appVersion || platformInfo.appVersion;
        // Get push token (may be null)
        const pushToken = PlatformUtils.getPushToken();
        // Merge provided device metadata with auto-detected platform info
        const deviceMetadata = {
            platform: platformInfo.platform,
            os_version: platformInfo.osVersion,
            app_version: appVersion,
            country: PlatformUtils.getCountry(),
            lang: PlatformUtils.getLanguage(),
            ...(pushToken && { push_token: pushToken }), // Only include if not null
            ...sdkConfig.deviceMetadata
        };
        const fullConfig = {
            baseUrl: sdkConfig.baseUrl,
            authToken: sdkConfig.authToken,
            deviceId,
            deviceMetadata
        };
        config.initialize(fullConfig);
    }
    /**
     * Get the current platform information
     */
    static getPlatformInfo() {
        return PlatformUtils.getPlatformInfo();
    }
    /**
     * Check if running in React Native environment
     */
    static isReactNative() {
        return PlatformUtils.isReactNative();
    }
    /**
     * Get device ID (auto-generated if not set)
     */
    static getDeviceId() {
        return PlatformUtils.getDeviceId();
    }
    /**
     * Update push token (call this when you receive a new push token)
     */
    static updatePushToken(token) {
        if (config.isInitialized()) {
            const currentConfig = config.getConfig();
            const updatedMetadata = {
                ...currentConfig.deviceMetadata,
                push_token: token
            };
            config.initialize({
                ...currentConfig,
                deviceMetadata: updatedMetadata
            });
        }
    }
    /**
     * Update app version (call this when app version changes)
     */
    static updateAppVersion(version) {
        if (config.isInitialized()) {
            const currentConfig = config.getConfig();
            const updatedMetadata = {
                ...currentConfig.deviceMetadata,
                app_version: version
            };
            config.initialize({
                ...currentConfig,
                deviceMetadata: updatedMetadata
            });
        }
    }
}
//# sourceMappingURL=react-native-config.js.map