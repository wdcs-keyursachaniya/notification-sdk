import { config } from '../config';
import { logger } from '../utils/logger';
export class ApiClient {
    constructor() { }
    static getInstance() {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    async makeRequest(endpoint, options = {}) {
        const baseUrl = config.getBaseUrl();
        const headers = config.getHeaders();
        const url = `${baseUrl}${endpoint}`;
        const requestOptions = {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };
        try {
            logger.debug(`Making request to: ${url}`);
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
                const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
                error.code = `HTTP_${response.status}`;
                error.retryable = response.status >= 500;
                error.status = response.status;
                throw error;
            }
            const data = await response.json();
            logger.debug(`API response received for: ${endpoint}`);
            return data;
        }
        catch (error) {
            if (error instanceof Error && 'code' in error) {
                throw error;
            }
            logger.error(`Network error for endpoint: ${endpoint}`, error);
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
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        return this.makeRequest(endpoint, requestOptions);
    }
    async put(endpoint, data) {
        const requestOptions = {
            method: 'PUT',
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        return this.makeRequest(endpoint, requestOptions);
    }
    async delete(endpoint) {
        return this.makeRequest(endpoint, { method: 'DELETE' });
    }
}
export const apiClient = ApiClient.getInstance();
//# sourceMappingURL=ApiClient.js.map