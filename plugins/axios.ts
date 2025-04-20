// plugins/api.client.ts
import { defineNuxtPlugin, useCookie, useRequestHeaders, useRuntimeConfig, useNuxtApp } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.API_BASE_URL as string | undefined

  const token = useCookie('token')
  const headers = useRequestHeaders(['cookie'])

  const { $firebaseAuth } = useNuxtApp()

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : undefined,
    },
  })

  instance.interceptors.request.use(async (config) => {
    const currentUser = $firebaseAuth.currentUser
    if (currentUser) {
      const idToken = await currentUser.getIdToken(true)
      config.headers.Authorization = `Bearer ${idToken}`
    }
    return config
  })

  // 💉 전역으로 주입
  return {
    provide: {
      api: instance,
    },
  }
})
