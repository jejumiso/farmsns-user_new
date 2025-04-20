// plugins/toast.client.ts
import Toast from 'vue-toastification'
import type { Plugin } from 'vue'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: 'top-center',
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
  })
})
