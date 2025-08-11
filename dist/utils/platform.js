// Conditional React Native imports
let Platform;
let Dimensions;
let StatusBar;
try {
    const RN = require('react-native');
    Platform = RN.Platform;
    Dimensions = RN.Dimensions;
    StatusBar = RN.StatusBar;
}
catch (error) {
    // Fallback for non-React Native environments
    Platform = {
        OS: 'web',
        Version: '1.0.0',
    };
    Dimensions = {
        get: () => ({ width: 1024, height: 768 }),
    };
    StatusBar = {
        currentHeight: 0,
    };
}
export class PlatformUtils {
    static getPlatformInfo() {
        const { width, height } = Dimensions.get('window');
        return {
            platform: Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web',
            osVersion: Platform.Version?.toString() || 'Unknown',
            appVersion: '1.0.0', // This should be replaced with actual app version from your app config
            deviceModel: Platform.OS === 'ios' ? 'iPhone' : 'Android Device', // This should be replaced with actual device model
            screenSize: {
                width,
                height
            },
            statusBarHeight: StatusBar.currentHeight || 0
        };
    }
    static isReactNative() {
        return typeof Platform !== 'undefined' && Platform.OS !== undefined;
    }
    static isIOS() {
        return Platform.OS === 'ios';
    }
    static isAndroid() {
        return Platform.OS === 'android';
    }
    static isWeb() {
        return Platform.OS === 'web';
    }
    static getDeviceId() {
        // In React Native, you should use a proper device ID library
        // For now, we'll use a fallback approach
        if (this.isReactNative()) {
            // You should implement proper device ID generation here
            // Consider using libraries like react-native-device-info
            return `rn_${Platform.OS}_${Date.now()}`;
        }
        // Fallback for web
        return `web_${Date.now()}`;
    }
    static getPushToken() {
        // This should be implemented with your push notification setup
        // For now, return null as placeholder
        return null;
    }
    static getLanguage() {
        // In React Native, you can get this from device locale
        // For now, return a default
        return 'en-US';
    }
    static getCountry() {
        // In React Native, you can get this from device locale
        // For now, return a default
        return 'US';
    }
}
//# sourceMappingURL=platform.js.map