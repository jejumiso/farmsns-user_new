# 📦 상품(Product) 모듈


## 관련 Store

`useProductStore`


## 스토어 ID

`'product'`


## 캐시 키

`'product'`


## 동기화 방식

- `createVersionedStore` 기반  
- `getModified(companyId, since)` / `getDeleted(companyId)` 호출 후 병합  
- 변경된 데이터만 효율적으로 반영


## 저장 방식

- 현재 `saveItem`, `saveItems`, `deleteItem` 미사용 상태 (비활성화 주석 처리됨)  
- 향후 관리자 웹에서 활성화 예상


## 관련 API

- `createProductService('guest').getModified(...)`  
- `createProductService('guest').getDeleted(...)`


## 연관 유틸

- `getCompanyCache`, `setCompanyCache` (로컬 캐시)  
- `watchCompanyRealtime` (실시간 반영)


## 관련 화면/라우팅

- `/products` 경로로 접근  
- 하단 네비게이션 메뉴에서 진입 가능 (`🎁 상품목록`)


## 실시간 반영 여부

- ✅ 있음  
- 회사 변경 시 `handleCompanyChange` 내에서 `watchCompanyRealtime` 호출됨
