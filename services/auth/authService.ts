//services/auth/authService.ts
import { useApi } from '@/composables/useApi'
import { signInWithCustomToken, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { Administrator } from '@/shared-types/administrator/administrator';
import type { Company } from '@/shared-types/company/company';
import type { ApiResponse } from '@/shared-types/apiResponse';
import { getFirebaseAuth } from '../firebaseService';
import { createDocumentService } from '../common/documentService';
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile';

export function createAuthService() {
  const api = useApi() // ✅ 여기서 axios 인스턴스 생성
  const auth = getFirebaseAuth();





  return {




    async sendSms(phoneNumber: string): Promise<void> {
      try {
        const response = await api.post('/api/auth/send-sms', { phoneNumber }); // api 인스턴스 사용
        console.log('SMS sent successfully:', response.data);
      } catch (error: any) {
        console.error('Failed to send SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send SMS');
      }
    },
    async verifySms(phoneNumber: string, code: string): Promise<User | null> {
      try {
        const response = await api.post('/api/auth/verify-sms', { phoneNumber, code }); // api 인스턴스 사용

        console.log('response:', response);
        console.log('status:', response.status);
        if (!response.data?.customToken) {
          throw new Error('서버 응답에 customToken이 없습니다');
        }


        const { customToken } = response.data;

        console.log('SMS verified 성공 ',customToken);
        const userCredential = await signInWithCustomToken(auth, customToken);
        return userCredential.user;
      } catch (error: any) {
        console.error('Failed to verify SMS:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to verify SMS');
      }
    },
    // 회원가입 시 user와 company를 함께 생성해야 하므로
    // auth 흐름 안에서 addUserAndCompany로 처리함
    // 향후 복잡해질 경우 registrationService로 분리 고려
    async addAdministratorAndCompany(administrator: Administrator, company: Company): Promise<ApiResponse> {
      try {
        // Firebase Functions 엔드포인트 호출

        const response = await api.post('/api/auth/addAdministratorAndCompany', {
          administrator,
          company
        });
        console.log('User and company added via Firebase Functions:', response.data);
        return response.data as ApiResponse;
      } catch (error: any) {
        console.error('Failed to add user and company via Firebase Functions:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to add user and company');
      }
    },
    async logout(): Promise<void> {
      try {
        await signOut(auth);
        console.log('User logged out successfully');
      } catch (error: any) {
        console.error('Failed to log out:', error.message);
        throw new Error('Failed to log out');
      }
    },
    onAuthStateChange(callback: (user: User | null) => void): void {
      onAuthStateChanged(auth, callback);
    },

  };
}

export interface AuthService {
  login(email: string, password: string): Promise<User | null>;
  sendSms(phoneNumber: string): Promise<void>;
  verifySms(phoneNumber: string, code: string): Promise<User | null>;
  addAdministratorAndCompany(administrator: Administrator, company: Company): Promise<ApiResponse>;
  logout(): Promise<void>;
  onAuthStateChange(callback: (user: User | null) => void): void;
}