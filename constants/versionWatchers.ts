// src/constants/versionWatchers.ts

import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import type { Store } from 'pinia'
import type { Product } from '@/shared-types/product/product'
import type { Category } from '@/shared-types/category/category'
import type { Option } from '@/shared-types/option/option'
import type { OptionGroup } from '@/shared-types/option/optionGroup'

/**
 * 버전 키 목록
 */
export const versionKeys = [
  'productVersion',
  'categoryVersion',
  'optionVersion',
  'optionGroupVersion',
] as const

/**
 * 버전 키 타입 (자동 추론)
 */
export type VersionKey = (typeof versionKeys)[number]

type StoreMap = {
  productVersion: Store<any, { items: Product[]; loading: boolean; error: string | null }, {}, any>
  categoryVersion: Store<any, { items: Category[]; loading: boolean; error: string | null }, {}, any>
  optionVersion: Store<any, { items: Option[]; loading: boolean; error: string | null }, {}, any>
  optionGroupVersion: Store<any, { items: OptionGroup[]; loading: boolean; error: string | null }, {}, any>
}

export type VersionWatcherMap = {
  [K in VersionKey]: {
    label: string
    store: () => StoreMap[K]
  }
}

export const versionWatchers: VersionWatcherMap = {
  productVersion: {
    label: '상품',
    store: () => useProductStore(),
  },
  categoryVersion: {
    label: '카테고리',
    store: () => useCategoryStore(),
  },
  optionVersion: {
    label: '옵션',
    store: () => useOptionStore(),
  },
  optionGroupVersion: {
    label: '옵션 그룹',
    store: () => useOptionGroupStore(),
  },
}
