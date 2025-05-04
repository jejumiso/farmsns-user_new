
import { defineNuxtConfig } from 'nuxt/config' 


export default defineNuxtConfig({
  ssr: false, // CSR로 동작
  css: ['~/assets/css/main.css'],
  typescript: {
    typeCheck: true,
    strict: true,
  },

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0',
        },
      ],
    },
  },
  

  devtools: { enabled: true },
  modules: ['@pinia/nuxt','@nuxt/icon', '@nuxt/ui'],

  pinia: {
    autoImports: ['defineStore']
  },


  runtimeConfig: {
    public: {
      NODE_ENV: process.env.NODE_ENV || '',
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
      API_BASE_URL: process.env.API_BASE_URL || '',
      PAYMENT_RETURN_URL: process.env.PAYMENT_RETURN_URL || '',
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
      ENCRYPTION_IV: process.env.ENCRYPTION_IV || '',
    },
  },
  
  nitro: {
    serveStatic: true,
    output: {
      dir: 'dist', // 빌드된 파일을 dist 디렉토리에 저장
      // publicDir: 'dist', // 정적 파일도 dist 디렉토리에 저장
    },
  },

  compatibilityDate: '2025-03-23',
});