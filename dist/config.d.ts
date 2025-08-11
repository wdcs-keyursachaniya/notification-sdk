import { SDKConfig, DeviceMetadata } from './types';
export declare class Config {
    private static instance;
    private config;
    private constructor();
    static getInstance(): Config;
    initialize(config: SDKConfig): void;
    getConfig(): SDKConfig;
    getBaseUrl(): string;
    getAuthToken(): string;
    getDeviceId(): string;
    getDeviceMetadata(): DeviceMetadata | undefined;
    getHeaders(): Record<string, string>;
    isInitialized(): boolean;
}
export declare const config: Config;
//# sourceMappingURL=config.d.ts.map