// plugins/1.authService.ts
import { createAuthService } from '@/services/auth/authService';
import {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseDb,
} from '@/services/firebaseService'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // ✅ 디버깅 로그
  console.log('🛠️ Nuxt Plugin 초기화 중...');
  console.log('Runtime Config (public):', config.public);

  // Firebase 초기화
  initializeFirebase({
    apiKey: config.public.FIREBASE_API_KEY as string,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN as string,
    projectId: config.public.FIREBASE_PROJECT_ID as string,
    appId: config.public.FIREBASE_APP_ID as string,
  });
  // 🔍 디버깅용 출력
console.log('✅ Firebase 초기화 완료');
console.log('🔧 연결된 Firebase 프로젝트 ID:', config.public.FIREBASE_PROJECT_ID);

  const authService = createAuthService();

  return {
    provide: {
      authService,
      firebaseAuth: getFirebaseAuth(), // 👈 여기에 추가!
      firebaseDb: getFirebaseDb(),     // 👈 여기에 추가!

    },
  };
});
