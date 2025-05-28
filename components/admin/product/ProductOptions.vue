<!-- 📁 components/admin/product/ProductOptions.vue-->
<template>
<!-- 옵션 전체를 명확히 감싼 박스 -->
<div class="bg-gray-100 border border-gray-500 rounded-lg p-4 space-y-4 shadow-sm mt-6">

  <!-- 옵션 목록 -->
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
}>()

const emit = defineEmits<{
  (e: 'update:selectedOptions', value: Record<string, any>): void
}>()

const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()

const selectedOptions = ref<Record<string, any>>(props.selectedOptions ?? {})

// 양방향 바인딩
watch(selectedOptions, (val) => emit('update:selectedOptions', val), { deep: true })

// 옵션 목록
const options = computed<Option[]>(() => {
  if (props.product.optionGroupId) {
    const group = optionGroupStore.items.find(g => g.id === props.product.optionGroupId)
    return group
      ? optionStore.items
          .filter(opt => group.optionIds.includes(opt.id))
          .sort((a, b) => a.displayLevel - b.displayLevel)
      : []
  } else {
    return optionStore.items
      .filter(opt => props.product.optionIds.includes(opt.id))
      .sort((a, b) => a.displayLevel - b.displayLevel)
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
