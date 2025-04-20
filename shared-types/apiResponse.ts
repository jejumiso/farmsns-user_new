// types/apiResponse.ts
export interface ApiResponse<T = any> {
    isSuccess: boolean;
    statusCode?: number;  // 응답 상태 코드 추가
    data?: T;
    error?: string;
    message?: string;
}  

