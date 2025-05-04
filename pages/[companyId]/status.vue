<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center space-y-4">
        <h1 class="text-2xl font-bold">
          {{ isOpen ? '현재 운영 중입니다 🟢' : '마감하였습니다 🔴' }}
        </h1>
        <p class="text-gray-500">방문해 주셔서 감사합니다.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useCompanyStore } from '@/stores/company/useCompanyStore'
  
  const companyStore = useCompanyStore()
  
  const isOpen = computed(() => {
    return companyStore.currentCompany?.isOpen ?? false
  })
  </script>
  