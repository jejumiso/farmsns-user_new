<template>
  <div class="space-y-4">
    <OptionRenderer
      v-for="option in options"
      :key="option.id"
      :option="option"
      :selected="selectedOptions"
      :toggleCheck="toggleCheck"
      :increaseQty="increaseQty"
      :decreaseQty="decreaseQty"
    />

    <!-- 총 수량 -->
    <div class="flex items-center justify-between border-t pt-4">
      <p class="font-medium">총 수량</p>
      <div class="flex items-center gap-2">
        <button @click="quantity--" :disabled="quantity <= 1" class="px-2 py-1 bg-gray-200 rounded">-</button>
        <span class="w-6 text-center">{{ quantity }}</span>
        <button @click="quantity++" class="px-2 py-1 bg-gray-200 rounded">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/shared-types/product/product'
import type { Option } from '@/shared-types/option/option'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import OptionRenderer from './OptionRenderer.vue'

const props = defineProps<{
  product: Product
  selectedOptions?: Record<string, any>
  quantity?: number
}>()

const emit = defineEmits<{
  (e: 'update:selectedOptions', value: Record<string, any>): void
  (e: 'update:quantity', value: number): void
}>()

const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()

const selectedOptions = ref<Record<string, any>>(props.selectedOptions ?? {})
const quantity = ref<number>(props.quantity ?? 1)

// 양방향 바인딩
watch(selectedOptions, (val) => emit('update:selectedOptions', val), { deep: true })
watch(quantity, (val) => emit('update:quantity', val))

// 옵션 목록
const options = computed<Option[]>(() => {
  if (props.product.optionGroupId) {
    const group = optionGroupStore.items.find(g => g.id === props.product.optionGroupId)
    return group
      ? optionStore.items.filter(opt => group.optionIds.includes(opt.id))
      : []
  } else {
    return optionStore.items.filter(opt => props.product.optionIds.includes(opt.id))
  }
})

// 초기화 - select 타입은 기본 선택
watch(options, () => {
  for (const opt of options.value) {
    if (opt.type === 'select' && selectedOptions.value[opt.id] === undefined) {
      selectedOptions.value[opt.id] = 0
    }
  }
}, { immediate: true })

// 체크형 옵션 toggle
function toggleCheck(optionId: string, itemIndex: number) {
  const selected = selectedOptions.value[optionId] || []
  if (selected.includes(itemIndex)) {
    selectedOptions.value[optionId] = selected.filter((i: number) => i !== itemIndex)
  } else {
    selectedOptions.value[optionId] = [...selected, itemIndex]
  }
}

// 수량형 옵션 조절
function increaseQty(optionId: string) {
  selectedOptions.value[optionId] = (selectedOptions.value[optionId] || 0) + 1
}

function decreaseQty(optionId: string) {
  if (selectedOptions.value[optionId] > 0) {
    selectedOptions.value[optionId]--
  }
}
</script>
