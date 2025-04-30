/**
 * PermissionAction:
 * Firestore에서 가능한 작업들을 정의합니다.
 * 각 작업별로 어떤 역할(role)이 허용되는지 설정할 수 있습니다.
 */
export type PermissionAction = 'read' | 'create' | 'update' | 'delete'

/**
 * CollectionPermissions:
 * Firestore의 하나의 컬렉션(예: 상품, 카테고리 등)에 대한 설정을 정의하는 구조입니다.
 */
export interface CollectionPermissions {
  name: string
  key: string
  prefix: string
  permissions: {
    [key in PermissionAction]: string[]
  }
}

/**
 * PermissionAction:
 * Firestore에서 가능한 작업들을 정의합니다.
 * 각 작업별로 어떤 역할(role)이 허용되는지 설정할 수 있습니다.
 */

/**
 * CollectionPermissions:
 * Firestore의 하나의 컬렉션(예: 상품, 카테고리 등)에 대한 설정을 정의하는 구조입니다.
 */
export type StoreKey =
  | 'product'
  | 'category'
  | 'option'
  | 'optionGroup'
  | 'company'
  | 'user'
  | 'administrator'
  | 'order'
  | 'stampLog'
  | 'adminLog'
  | 'ordersWaiting'
  | 'counter'
  | 'couponIssued'

  /**
 * COLLECTION_PERMISSIONS:
 * StoreKey를 기반으로 각 컬렉션의 메타 정보를 정의한 객체입니다.
 * 실제 Firestore에서 사용할 컬렉션 이름과 권한 등을 포함하고 있습니다.
 */
export const COLLECTION_PERMISSIONS: Record<StoreKey, CollectionPermissions> = {
  counter: {
    name: 'v2_counter',
    key: 'counter',
    prefix: 'cnt',
    permissions: {
      read: ['super'],
      create: ['guest'],
      update: ['super'],
      delete: ['super'],
    },
  },
  company: {
    name: 'v2_companies',
    key: 'company',
    prefix: 'co',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  administrator: {
    name: 'v2_administrators',
    key: 'administrator',
    prefix: 'adm',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  user: {
    name: 'v2_users',
    key: 'user',
    prefix: 'u',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  option: {
    name: 'v2_options',
    key: 'option',
    prefix: 'opt',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  optionGroup: {
    name: 'v2_optionGroups',
    key: 'optionGroup',
    prefix: 'og',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  product: {
    name: 'v2_products',
    key: 'product',
    prefix: 'p',
    permissions: {
      read: ['admin', 'user', 'guest'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  order: {
    name: 'v2_orders',
    key: 'order',
    prefix: 'ord',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
  stampLog: {
    name: 'v2_stampLogs',
    key: 'stampLog',
    prefix: 'stl',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  adminLog: {
    name: 'v2_adminLogs',
    key: 'adminLog',
    prefix: 'adl',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  ordersWaiting: {
    name: 'v2_ordersWaiting',
    key: 'ordersWaiting',
    prefix: 'ow',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
  category: {
    name: 'v2_categories',
    key: 'category',
    prefix: 'ctg',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
  couponIssued: {
    name: 'v2_couponIssued',
    key: 'couponIssued',
    prefix: 'cis',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
}
