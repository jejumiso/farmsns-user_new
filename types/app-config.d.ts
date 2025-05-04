// types/app-config.d.ts

export {}

declare global {
  const defineAppConfig: typeof import('nuxt/schema')['defineAppConfig']
}
