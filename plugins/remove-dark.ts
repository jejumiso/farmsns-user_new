// plugins/remove-dark.ts

export default defineNuxtPlugin(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
  })
  