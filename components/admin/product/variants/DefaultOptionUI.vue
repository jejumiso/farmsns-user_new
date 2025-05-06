<template>
  <div class="space-y-2">
    <!-- 옵션 이름 -->
    <!-- <p class="font-bold text-green-800 text-lg">{{ option.optionName }}</p> -->

    <!-- SELECT -->
    <div v-if="option.type === 'select'" class="grid grid-cols-2 gap-3">
      <button
        v-for="(item, i) in option.optionItems"
        :key="i"
        @click="selected[option.id] = i"
        :class="[
          'py-3 px-4 rounded-lg border text-base font-semibold transition',
          selected[option.id] === i
            ? 'bg-green-600 text-white shadow'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        ]"
      >
        {{ item }}
        <span
          v-if="option.optionItemsPrice[i] > 0"
          class="block text-sm text-gray-500 font-normal"
        >
          ({{ option.optionItemsPrice[i].toLocaleString() }} 원)
        </span>
      </button>
    </div>

    <!-- CHECK -->
    <div v-else-if="option.type === 'check'" class="grid grid-cols-2 gap-3">
      <button
        v-for="(item, i) in option.optionItems"
        :key="i"
        @click="toggleCheck(option.id, i)"
        :class="[
          'py-3 px-4 rounded-lg border text-base font-semibold transition',
          selected[option.id]?.includes(i)
            ? 'bg-green-600 text-white shadow'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        ]"
      >
        {{ item }}
        <span
          v-if="option.optionItemsPrice[i] > 0"
          class="block text-sm text-gray-500 font-normal"
        >
          (+₩{{ option.optionItemsPrice[i].toLocaleString() }})
        </span>
      </button>
    </div>

    <!-- QUANTITY -->
    <div
      v-else-if="option.type === 'quantity'"
      class="flex items-center justify-between border-t pt-3 mt-3"
    >
      <p class="text-sm text-gray-800 font-semibold">{{ option.optionName }}</p>
      <div class="flex items-center gap-2">
        <p class="text-green-700 font-bold w-16 text-right text-sm">
          {{ option.optionItemsPrice[0]?.toLocaleString?.() + ' 원' || '무료' }}
        </p>
        <button
          @click="decreaseQty(option.id)"
          class="w-8 h-8 bg-gray-200 text-gray-800 rounded font-bold"
        >-</button>
        <span class="w-6 text-center font-medium text-sm">{{ selected[option.id] || 0 }}</span>
        <button
          @click="increaseQty(option.id)"
          class="w-8 h-8 bg-gray-200 text-gray-800 rounded font-bold"
        >+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Option } from '@/shared-types/option/option'

defineProps<{
  option: Option
  selected: Record<string, any>
  toggleCheck: (optionId: string, index: number) => void
  increaseQty: (optionId: string) => void
  decreaseQty: (optionId: string) => void
}>()
</script>
