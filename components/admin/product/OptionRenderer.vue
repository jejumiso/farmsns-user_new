<!-- 📁 components/admin/product/OptionRenderer.vue -->
<template>
  <component
    :is="resolvedComponent"
    :option="option"
    :selected="selected"
    :toggleCheck="toggleCheck"
    :increaseQty="increaseQty"
    :decreaseQty="decreaseQty"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Option } from '@/shared-types/option/option'

import DefaultOptionUI from './variants/DefaultOptionUI.vue'
import EmphasizedOptionUI from './variants/EmphasizedOptionUI.vue'
import InlineOptionUI from './variants/InlineOptionUI.vue'
import SegmentedOptionUI from './variants/SegmentedOptionUI.vue'
import RequiredHighlightOptionUI from './variants/RequiredHighlightOptionUI.vue'

const props = defineProps<{
  option: Option
  selected: Record<string, any>
  toggleCheck: (optionId: string, index: number) => void
  increaseQty: (optionId: string) => void
  decreaseQty: (optionId: string) => void
}>()

const resolvedComponent = computed(() => {
  switch (props.option.styleType) {
    case 'emphasized':
      return EmphasizedOptionUI
    case 'inline':
      return InlineOptionUI
    case 'segmented':
      return SegmentedOptionUI
    case 'required-highlight':
      return RequiredHighlightOptionUI
    default:
      return DefaultOptionUI
  }
})
</script>
