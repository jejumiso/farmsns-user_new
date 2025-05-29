// types/product/product.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
import type {  DocumentMetaOnly } from '../common/documentMeta'

export interface Product {
  id: string // 문서 ID
  companyId: string // 소속 회사 ID
  parentProductId: string // 부모 상품 ID (상속용)
  useParentData: boolean // 부모 상품 데이터 사용 여부

  categories: string[] // 속한 카테고리 ID 목록
  isPrivateProduct: boolean // 비공개 상품 여부

  productName: string // 상품명
  productNameShort: string // 짧은 상품명

  priceOriginal: number // 원래 가격
  priceDiscounted: number // 할인 가격

  imageThumbnailFileName: string // 썸네일 이미지 파일명
  imageGalleryFileNames: string[] // 갤러리 이미지 파일명 목록

  unit: string // 단위 (예: 개, 박스 등)
  description: string // 상품 설명
  stockQuantity: number // 재고 수량

  isVisible: boolean // 화면 노출 여부
  displayLevel: number // 정렬 우선순위

  optionGroupId: string // 옵션 그룹 ID
  optionIds: string[] // 옵션 ID 목록

  rewardStamp: number // 지급 스탬프 수
  rewardPoint: number // 지급 포인트 수

  parcelBundleValue: number // 📦 묶음 배송 단위 계산에 기여하는 수치 (기본 1)


  isDeleted: boolean // 삭제 여부 (soft delete) , deletedproduct카테고리에서 관리됨.

  dateCreated: Timestamp | null // 생성 시각
  dateModified: Timestamp | null // 수정 시각
}



// ✅ 기본값 생성 함수
export function createEmptyProduct(): Product {
  return {
    id: '',
    companyId: '',
    parentProductId: '',
    useParentData: false,
    categories: [],
    isPrivateProduct: false,
    productName: '',
    productNameShort: '',
    priceOriginal: 0,
    priceDiscounted: 0,
    imageThumbnailFileName: '',
    imageGalleryFileNames: [],
    unit: '',
    description: '상품설명',
    stockQuantity : 10000,
    isVisible : true,
    displayLevel: 1000,
    optionGroupId: '',
    // optionGroupName: undefined,
    optionIds: [],
    rewardStamp: 0,
    rewardPoint: 0,
    parcelBundleValue : 1,
    isDeleted: false,
    dateCreated: null,
    dateModified: null,
  }
}
