# 🧩 createVersionedStore 사용 가이드

## 📌 개요

`createVersionedStore`는 회사별 데이터를 효율적으로 동기화하고, 캐시를 활용하며, 서버와의 최소 통신을 통해 최신 상태를 유지하기 위한 **버전 기반 Pinia 스토어 생성기**입니다.  
상품, 카테고리, 옵션 등 다양한 도메인에 범용적으로 적용할 수 있습니다.

---

## 📁 파일 위치



복원(restoreCache) → 로컬 캐시 반영
↓
동기화(syncWithServer) → 변경된 항목만 서버로부터 받음
↓
삭제 및 수정 반영 → 로컬 상태 병합
↓
setCompanyCache() → 최신 상태 저장
