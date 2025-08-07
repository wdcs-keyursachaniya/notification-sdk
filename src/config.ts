import { SDKConfig, DeviceMetadata } from './types';

export class Config {
  private static instance: Config;
  private config: SDKConfig | null = null;

  private constructor() {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  initialize(config: SDKConfig): void {
    this.config = {
      ...config,
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
    };
  }

  getConfig(): SDKConfig {
    if (!this.config) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }
    return this.config;
  }

  getBaseUrl(): string {
    return this.getConfig().baseUrl;
  }

  getAuthToken(): string {
    return this.getConfig().authToken;
  }

  getDeviceId(): string {
    return this.getConfig().deviceId;
  }

  getDeviceMetadata(): DeviceMetadata | undefined {
    return this.getConfig().deviceMetadata;
  }

  getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.getAuthToken()}`,
      'X-Device-ID': this.getDeviceId(),
      'Content-Type': 'application/json',
    };
  }

  isInitialized(): boolean {
    return this.config !== null;
  }
}

export const config = Config.getInstance();
