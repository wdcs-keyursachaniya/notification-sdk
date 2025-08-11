"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.Config = void 0;
class Config {
    constructor() {
        this.config = null;
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
    initialize(config) {
        this.config = {
            ...config,
            baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
        };
    }
    getConfig() {
        if (!this.config) {
            throw new Error('SDK not initialized. Call initialize() first.');
        }
        return this.config;
    }
    getBaseUrl() {
        return this.getConfig().baseUrl;
    }
    getAuthToken() {
        return this.getConfig().authToken;
    }
    getDeviceId() {
        return this.getConfig().deviceId;
    }
    getDeviceMetadata() {
        return this.getConfig().deviceMetadata;
    }
    getHeaders() {
        return {
            Authorization: `Bearer ${this.getAuthToken()}`,
            'X-Device-ID': this.getDeviceId(),
            'Content-Type': 'application/json',
        };
    }
    isInitialized() {
        return this.config !== null;
    }
}
exports.Config = Config;
exports.config = Config.getInstance();
//# sourceMappingURL=config.js.map