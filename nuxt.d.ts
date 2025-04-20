// /// <reference types="nuxt" />
// // 루트 디렉토리 : nuxt.d.ts
// import type { AxiosInstance } from 'axios'
// import type { Auth } from 'firebase/auth'  // firebase/auth에서 Auth 타입 가져오기
// import { Router } from 'vue-router'
// export {}

// import type { AuthService } from '@/services/auth/authService';

// declare module '#app' {
//   interface NuxtApp {
//     $auth: Auth
//   }
// }

// declare module '#app' {
//   interface NuxtApp {
//     $router: Router
//   }
// }

// declare module '#app' {
//   interface NuxtApp {
//     $authService: AuthService; // AuthService 타입 추가
//   }
// }

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $authService: AuthService; // Vue 컴포넌트에서 $authService 사용 가능
//   }
// }

// declare global {
//   const defineNuxtRouteMiddleware: typeof import('#app')['defineNuxtRouteMiddleware']
//   const navigateTo: typeof import('#app')['navigateTo']
//   const definePageMeta: typeof import('#app')['definePageMeta'] // ✅ 이거!

// }


