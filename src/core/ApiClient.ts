import { config } from '../config';
import { ApiResponse, SDKError } from '../types';
import { logger } from '../utils/logger';

export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseUrl = config.getBaseUrl();
    const headers = config.getHeaders();
    
    const url = `${baseUrl}${endpoint}`;
    const requestOptions: RequestInit = {
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
        
        const error = new Error(`API request failed: ${response.status} ${response.statusText}`) as SDKError;
        error.code = `HTTP_${response.status}`;
        error.retryable = response.status >= 500;
        error.status = response.status;
        
        throw error;
      }

      const data = await response.json();
      logger.debug(`API response received for: ${endpoint}`);
      
      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        throw error;
      }
      
      logger.error(`Network error for endpoint: ${endpoint}`, error);
      const sdkError = new Error('Network error') as SDKError;
      sdkError.code = 'NETWORK_ERROR';
      sdkError.retryable = true;
      throw sdkError;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      method: 'POST',
    };
    
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    return this.makeRequest<T>(endpoint, requestOptions);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      method: 'PUT',
    };
    
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    return this.makeRequest<T>(endpoint, requestOptions);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();
