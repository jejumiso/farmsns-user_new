<template>
  <div class="flex gap-6">
    <div class="w-1/2 space-y-4">
      <h2 class="text-xl font-bold">옵션 그룹 정보</h2>
      <FormInput label="옵션 그룹명" v-model="localGroup.optionGroupName" id="groupName" required />

      <div>
        <label class="block text-sm font-medium text-gray-700">선택된 옵션들</label>
        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="id in localGroup.optionIds"
            :key="id"
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
          >
            {{ getOptionNameById(id) }}
          </span>
        </div>
      </div>

      <div class="pt-4">
        <button @click="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ isEditMode ? '수정' : '추가' }}하기
        </button>
      </div>
    </div>

    <div class="w-1/2">
      <h2 class="text-xl font-bold mb-2">옵션 목록</h2>
      <ul class="space-y-2">
        <li
          v-for="opt in allOptions"
          :key="opt.id"
          @click="toggleOption(opt.id)"
          class="p-3 border rounded cursor-pointer hover:bg-gray-50"
          :class="{ 'bg-blue-100 border-blue-400': localGroup.optionIds.includes(opt.id) }"
        >
          {{ opt.optionName }} ({{ opt.optionItems.length }} 항목)
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { OptionGroup } from '@/shared-types/option/optionGroup';
import type { Option } from '@/shared-types/option/option';
import FormInput from '@/components/common/FormInput.vue';

const props = defineProps<{
  optionGroup: OptionGroup;
  allOptions: Option[];
  isEditMode: boolean;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', group: OptionGroup): void;
}>();

const localGroup = ref<OptionGroup>(JSON.parse(JSON.stringify(props.optionGroup)));

watch(() => props.optionGroup, (newVal) => {
  localGroup.value = JSON.parse(JSON.stringify(newVal));
});

const getOptionNameById = (id: string) =>
  props.allOptions.find(o => o.id === id)?.optionName || id;

const toggleOption = (optionId: string) => {
  const list = localGroup.value.optionIds;
  const index = list.indexOf(optionId);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(optionId);
  }
};

const submit = () => {
  emit('submit', localGroup.value);
};
</script>
