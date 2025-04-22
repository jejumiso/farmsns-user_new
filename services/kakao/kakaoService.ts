//services/kakao/kakaoService.ts
import { useApi } from '@/composables/useApi'

import type { ApiResponse } from '@/shared-types/apiResponse'; // 상대 경로로 변경
import { decryptWithIv } from '@/shared-utils/crypto/decryption';

export function createKakaoService() {

  const api = useApi() // ✅ 여기서 axios 인스턴스 생성

  return {
    async profileAuth(plusid: string,phonenumber:string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/profileAuth', { plusid,phonenumber }); // api 인스턴스 사용
        console.log('SMS sent successfully:', response.data);
        return {
          isSuccess: response.data.code === 0,
          message: response.data.message,
          data: response.data.data, // 필요한 데이터만 반환
        }; // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('Failed to send SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },

    async profileAdd(plusid: string,authnum: string,phonenumber:string,categorycode: string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/profileAdd', { plusid,authnum, phonenumber ,categorycode}); // api 인스턴스 사용
        console.log('SMS sent successfully:', response.data);
        return {
          isSuccess: response.data.code === 0,
          message: response.data.message,
          data: response.data.data, // 필요한 데이터만 반환
        }; // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('Failed to send SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },

    //공통으로 쓰이기에는 좀그렇다
    // getFriendBySenderKey
    async getFriendBySenderKey(senderkey: string): Promise<ApiResponse> {
      try {
        const response = await api.post('/api/alligo/friendList', { senderkey}); // api 인스턴스 사용
        console.log('friendList successfully:', response.data);
        if(response.data.code === 0 && response.data.list.length === 0){
          return {
            isSuccess: false,
            message: '등록 된 키가 없습니다.',
            data: {}, // 필요한 데이터만 반환
          }; 
        }
        return {
          isSuccess: response.data.code === 0,
          message: response.data.message,
          data: response.data.list[0], // 필요한 데이터만 반환
        }; 
        
        
        // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('Failed to send friendList:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },


    async templateList(resSenderkey: string,iv:string): Promise<ApiResponse> {
      try {
        const senderkey = decryptWithIv(resSenderkey, iv);
        const response = await api.post('/api/alligo/templateList', { senderkey}); // api 인스턴스 사용
        console.log('템플릿 목록 호출 결과:', response.data);
        if(response.data.code === 0 && response.data.list.length === 0){
          return {
            isSuccess: false,
            message: '등록 된 템플릿이 없습니다.',
            data: {}, // 필요한 데이터만 반환
          }; 
        }
        return {
          isSuccess: response.data.code === 0,
          message: response.data.message,
          data: response.data, // 필요한 데이터만 반환
        }; 
        
        
        // ApiResponse 타입에 맞게 반환
      } catch (error: any) {
        console.error('템플릿 목록 읽기 에러:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || '템플릿 목록 읽기 에러');
      }
    },

  };
}

export interface AuthService {
  profileAuth(plusid: string,phonenumber:string): Promise<void>;
}