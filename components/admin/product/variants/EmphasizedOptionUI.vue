<template>
    <div class="space-y-2">
      <!-- <p class="font-bold text-green-800 text-lg">{{ option.optionName }}</p> -->
  
      <div v-if="option.type === 'select'" class="grid grid-cols-2 gap-3">
        <button
          v-for="(item, i) in option.optionItems"
          :key="i"
          @click="selected[option.id] = i"
          :class="[
            'py-3 px-4 rounded-lg border text-base font-semibold',
            selected[option.id] === i
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-800'
          ]"
        >
          {{ item }}
          <span v-if="option.optionItemsPrice[i] > 0" class="text-sm text-gray-500">
            (+₩{{ option.optionItemsPrice[i].toLocaleString() }})
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Option } from '@/shared-types/option/option'
  defineProps<{
    option: Option
    selected: Record<string, any>
  }>()
  </script>
  