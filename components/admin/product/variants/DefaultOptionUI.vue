<template>
  <div class="space-y-2">
    <!-- 옵션 이름 -->
    <!-- <p class="font-bold text-green-800 text-lg">{{ option.optionName }}</p> -->

<!-- SELECT -->
<div v-if="option.type === 'select'" class="space-y-2">
  <div class="flex items-start gap-3">
    <!-- 옵션 이름 -->
    <p class="text-sm font-semibold text-gray-800 whitespace-nowrap pt-2 w-20">
      {{ option.optionName }}
    </p>

    <!-- 버튼 목록 -->
    <div class="grid grid-cols-2 gap-2 flex-1">
      <button
        v-for="(item, i) in option.optionItems"
        :key="i"
        @click="selected[option.id] = i"
        :class="[
          'py-2 px-3 rounded-lg border text-sm font-medium transition leading-tight text-center',
          selected[option.id] === i
            ? 'bg-green-600 text-white shadow'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        ]"
      >
        {{ /^[a-zA-Z]+$/.test(item) ? item.toUpperCase() : item }}
        <span
          v-if="option.optionItemsPrice[i] > 0"
          class="block text-xs text-gray-500 font-normal"
        >
          ({{ option.optionItemsPrice[i].toLocaleString() }}원)
        </span>
      </button>
    </div>
  </div>
</div>


    <!-- CHECK -->
<div v-else-if="option.type === 'check'" class="space-y-2">
  <div class="flex items-start gap-3">
    <!-- 옵션 이름 -->
    <p class="text-sm font-semibold text-gray-800 whitespace-nowrap pt-2 w-20">
      {{ option.optionName }}
    </p>

    <!-- 체크박스 버튼 목록 -->
    <div class="grid grid-cols-2 gap-2 flex-1">
      <button
        v-for="(item, i) in option.optionItems"
        :key="i"
        @click="toggleCheck(option.id, i)"
        :class="[
          'py-2 px-3 rounded-lg border text-sm font-medium transition leading-tight text-center',
          selected[option.id]?.includes(i)
            ? 'bg-green-600 text-white shadow'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        ]"
      >
        {{ /^[a-zA-Z]+$/.test(item) ? item.toUpperCase() : item }}
        <span
          v-if="option.optionItemsPrice[i] > 0"
          class="block text-xs text-gray-500 font-normal"
        >
          (+₩{{ option.optionItemsPrice[i].toLocaleString() }})
        </span>
      </button>
    </div>
  </div>
</div>


    <!-- QUANTITY -->
    <div
      v-else-if="option.type === 'quantity'"
      class="flex items-center justify-between"

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
