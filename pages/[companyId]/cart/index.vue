<template>
  <CartModal @close="handleClose" />
</template>

<script setup lang="ts">
import CartModal from '@/components/admin/cart/CartModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleClose() {
  router.back()
}
</script>
