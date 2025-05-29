# 🧩 Store 및 캐시 네이밍 정책 (`storeId`, `cacheKey`, `entityKey`)

## 📌 목적

이 문서는 Pinia 스토어 생성 및 회사별 데이터 캐시 구조에서 사용되는  
`storeId`, `cacheKey`, `entityKey` 등의 네이밍 규칙과 책임을 정의합니다.

---

## 🧱 키 용어 정의

| 키 이름     | 용도 및 역할 |
|-------------|--------------|
| `storeId`   | Pinia 스토어의 고유 식별자 (필수) |
| `cacheKey`  | 캐시(LocalStorage) 저장 시 사용할 키 (회사별 분기 포함) |
| `entityKey` | 데이터 도메인 식별용 (옵션, 추상화 단계에서 활용 가능) |

---

## 🎯 `storeId`

- 사용 위치: `defineStore(storeId, () => { ... })`
- Pinia에서 내부적으로 store를 구분하는 **고유 ID**로 사용됨
- **중복 불가**. 동일한 `storeId`를 여러 번 등록하면 충돌 발생

✅ 예시:
```ts
defineStore('product', () => { ... }) // 'product'는 storeId
