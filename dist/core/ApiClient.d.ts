import { ApiResponse } from '../types';
export declare class ApiClient {
    private static instance;
    private constructor();
    static getInstance(): ApiClient;
    private makeRequest;
    get<T>(endpoint: string): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}
export declare const apiClient: ApiClient;
//# sourceMappingURL=ApiClient.d.ts.map