export interface PlatformInfo {
    platform: 'iOS' | 'Android' | 'Web';
    osVersion: string;
    appVersion: string;
    deviceModel: string;
    screenSize: {
        width: number;
        height: number;
    };
    statusBarHeight: number;
}
export declare class PlatformUtils {
    static getPlatformInfo(): PlatformInfo;
    static isReactNative(): boolean;
    static isIOS(): boolean;
    static isAndroid(): boolean;
    static isWeb(): boolean;
    static getDeviceId(): string;
    static getPushToken(): string | null;
    static getLanguage(): string;
    static getCountry(): string;
}
//# sourceMappingURL=platform.d.ts.map