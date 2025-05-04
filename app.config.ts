// app.config.ts

export default defineAppConfig({
    // 💡 커스텀 앱 설정
    app: {
      name: 'MyNuxtApp',
      version: '1.0.0',
      enableFeatureX: true
    },
  
    // 🎨 Nuxt UI 테마 설정 (Nuxt UI 사용 시)
    ui: {
      icons: 'heroicons', // 또는 'tabler', 'mdi' 등
      primary: 'green',   // Tailwind 색상: 'blue', 'red', 'gray' 등
      gray: 'neutral',    // 회색 톤
      container: 'xl',    // 최대 컨테이너 너비: 'xl', '2xl', '7xl' 등
      rounded: 'lg',      // 전역 border-radius
  
      themes: {
        default: {
          colors: {
            text: 'gray-900',      // 기본 텍스트 색
            muted: 'gray-600',     // 서브 텍스트
            dimmed: 'gray-400',    // 비활성 텍스트
            primary: 'green'       // 주요 색상 (버튼 등)
          }
        }
      }
    }
  })
  