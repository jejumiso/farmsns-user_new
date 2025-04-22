# createVersionedStore - Pinia Setup API 기반 공통 스토어

## 🎯 개요

`createVersionedStore`는 Pinia의 `defineStore`를 기반으로 하는 재사용 가능한 공통 스토어 생성 함수입니다.  
Vue 3의 Composition API(Setup API) 스타일을 따르며, 각 회사(companyId)별로 데이터를 구분하고, 서버 동기화 및 캐시 기능을 제공합니다.

---

## ✅ 주요 기능

- `items`: 항목 목록 (T[])
- `syncWithServer()`: 서버와 데이터 동기화
- `restoreCache()`: 로컬 캐시에서 데이터 복원
- `saveItem(item)`: 단일 항목 저장
- `saveItems(items)`: 여러 항목 저장
- `deleteItem(id)`: 항목 삭제
- `itemCount`: 항목 수 반환 (getter)
- `allItems`: 전체 항목 반환 (getter)

---

## 🧱 state 구조

```ts
const items = ref<T[]>([])
const dateLastFetched = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
