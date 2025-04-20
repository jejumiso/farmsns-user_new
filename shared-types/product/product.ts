// types/product/product.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
import type {  DocumentMetaOnly } from '../common/documentMeta'

export interface Product {
  id: string
  companyId: string
  parentProductId: string
  useParentData: boolean
  categories: string[]
  isPrivateProduct: boolean
  productName: string
  productNameShort: string
  priceOri: number
  priceSale: number
  imageThumbnailFileName : string
  imageGalleryFileNames: string[]
  unit: string
  explanation: string
  stockQuantity : number
  isDisplay: boolean
  displayLevel: number
  specialPrice: number
  specialUsedQty: number
  optionGroupId: string
  // optionGroupName?: string
  optionIds: string[]
  rewardStamp: number
  rewardPoint: number
  isDeleted: boolean
  dateCreated: Timestamp | null
  dateModified: Timestamp | null
  docId : string
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
    productName: ' 상품이름',
    productNameShort: '',
    priceOri: 0,
    priceSale: 0,
    imageThumbnailFileName: '',
    imageGalleryFileNames: [],
    unit: '',
    explanation: '상품설명',
    stockQuantity : -1,
    isDisplay: false,
    displayLevel: 1000,
    specialPrice: 0,
    specialUsedQty: 0,
    optionGroupId: '',
    // optionGroupName: undefined,
    optionIds: [],
    rewardStamp: 0,
    rewardPoint: 0,
    isDeleted: false,
    dateCreated: null,
    dateModified: null,
    docId : '',
  }
}
