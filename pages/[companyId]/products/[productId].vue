<!-- 📁 pages/[companyId]/products/[productId].vue -->
<template>
    <ProductDetailModal :productId="productId" @close="handleClose" />
  </template>
  
  <script setup lang="ts">
  import ProductDetailModal from '@/components/admin/product/ProductDetailModal.vue'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const productId = route.params.productId as string
  
  function handleClose() {
    router.back()
  }
  </script>
  