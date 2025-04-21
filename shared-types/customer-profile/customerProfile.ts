import { Timestamp } from '@/shared/firebase/firebaseTypes'
import type { DeliveryAddress } from '@/shared-types/delivery-address/deliveryAddress'
import { type ContactInfo } from '../company/company'

export interface CustomerProfile {
  id: string // Firebase UID (문서 ID)
  contactInfo: ContactInfo

  securedUserName: string // 암호화된 사용자 이름
  securedUserNameHash: string // 해시된 사용자 이름 (검색용)
  photoURL: string | null // 프로필 사진
  companyIds: string[] // 가입한 업체 목록
  isMember: boolean // 멤버십 여부
  deliveryAddressList: DeliveryAddress[] // 배송지 목록
  customerRating: string // 고객 등급
  orderTotalCount: number // 총 주문 횟수
  orderTotalPrice: number // 총 주문 금액
  rewardCount: number // 리워드 횟수
  rewardCompany: string // 리워드 지급 업체
  version: number // 데이터 구조 버전

  searchField: string[] // 검색을 위한 키워드 (예: 전화번호 끝 4자리, 이메일 해시 등)  
  dateLastOrder: Timestamp | null // 마지막 주문 시각
  dateCreated: Timestamp // 생성 시각
  dateModified: Timestamp // 수정 시각
  dateLastAccess: Timestamp // 마지막 접속 시각
  iv: string // 🔐 문서 암호화 IV
}

export function createEmptyCustomerProfile(params: {
  uid: string
  securedPhone: string
  phoneSuffix: string
  searchField : string[]
  iv: string
}): CustomerProfile {
  const now = Timestamp.now()

  return {
    id: params.uid,
    contactInfo: {
      securedPhoneMain: params.securedPhone,
      securedPhoneSub1: '',
      securedPhoneSub2: '',
      securedLandlineMain:'',
      phoneSuffix: params.phoneSuffix,
      securedEmail: '',
      emailHash: '',
    },
    securedUserName: '',
    securedUserNameHash: '',
    photoURL: null,
    companyIds: [],
    isMember: false,
    deliveryAddressList: [],
    customerRating: '',
    orderTotalCount: 0,
    orderTotalPrice: 0,
    rewardCount: 0,
    rewardCompany: '',

    version: 1,

    searchField: params.searchField,
    dateLastOrder: null,
    dateCreated: now,
    dateModified: now,
    dateLastAccess: now,
    iv: params.iv,
  }
}
