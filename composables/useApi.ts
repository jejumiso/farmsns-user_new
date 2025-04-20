import { useCookie, useRequestHeaders } from '#app'
import axios from 'axios'
import { useNuxtApp } from '#app' // 👈 이거 추가

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.API_BASE_URL as string | undefined

  const token = useCookie('token') // 클라이언트 쿠키 (초기 값용)
  const headers = useRequestHeaders(['cookie']) // SSR 디버깅용



  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : undefined,
    },
  })
  const { $firebaseAuth } = useNuxtApp()

  // ✅ 인터셉터: 항상 최신 토큰을 헤더에 설정
  instance.interceptors.request.use(async (config) => {
    const currentUser = $firebaseAuth.currentUser
    if (currentUser) {
      const token  = await currentUser.getIdToken(true)
      // console.log('🔐 [useApi] Authorization 
      // 
      // 토큰:', token ) // ✅ 로그 출력

      config.headers.Authorization = `Bearer ${token }`
    }
    return config
  })

  return instance
}
