// globals.d.ts

/// <reference types="nuxt" />
export {}

import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { AuthService } from '@/services/auth/authService'
import type { Router } from 'vue-router'
import type { AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance
  }
}

declare global {
  interface Window {
    recaptchaVerifier?: any
    FlutterChannel?: {
      postMessage: (message: string) => void
    }
  }

  const defineNuxtPlugin: typeof import('#app')['defineNuxtPlugin']
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig']
  const defineNuxtRouteMiddleware: typeof import('#app')['defineNuxtRouteMiddleware']
  const navigateTo: typeof import('#app')['navigateTo']
  const definePageMeta: typeof import('#app')['definePageMeta']
}

declare module '#app' {
  interface NuxtApp {
    $firebaseAuth: Auth
    $firebaseDb: Firestore
    $authService: AuthService
    $auth: Auth
    $router: Router
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $authService: AuthService
  }
}
