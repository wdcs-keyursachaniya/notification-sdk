"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.ApiClient = void 0;
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class ApiClient {
    constructor() { }
    static getInstance() {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    async makeRequest(endpoint, options = {}) {
        const baseUrl = config_1.config.getBaseUrl();
        const headers = config_1.config.getHeaders();
        const url = `${baseUrl}${endpoint}`;
        const requestOptions = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };
        try {
            logger_1.logger.debug(`Making request to: ${url}`);
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                const errorText = await response.text();
                logger_1.logger.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
                const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
                error.code = `HTTP_${response.status}`;
                error.retryable = response.status >= 500;
                error.status = response.status;
                throw error;
            }
            const data = await response.json();
            logger_1.logger.debug(`API response received for: ${endpoint}`);
            return data;
        }
        catch (error) {
            if (error instanceof Error && 'code' in error) {
                throw error;
            }
            logger_1.logger.error(`Network error for endpoint: ${endpoint}`, error);
            const sdkError = new Error('Network error');
            sdkError.code = 'NETWORK_ERROR';
            sdkError.retryable = true;
            throw sdkError;
        }
    }
    async get(endpoint) {
        return this.makeRequest(endpoint, { method: 'GET' });
    }
    async post(endpoint, data) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        else {
            // Even if no data, send empty JSON object to ensure proper Content-Type
            requestOptions.body = '{}';
        }
        return this.makeRequest(endpoint, requestOptions);
    }
    async put(endpoint, data) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        else {
            // Even if no data, send empty JSON object to ensure proper Content-Type
            requestOptions.body = '{}';
        }
        return this.makeRequest(endpoint, requestOptions);
    }
    async delete(endpoint) {
        return this.makeRequest(endpoint, { method: 'DELETE' });
    }
}
exports.ApiClient = ApiClient;
exports.apiClient = ApiClient.getInstance();
//# sourceMappingURL=ApiClient.js.map