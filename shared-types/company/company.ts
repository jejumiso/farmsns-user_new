// shared-types/company/company.ts
import { Timestamp, GeoPoint, DocumentReference } from '@/shared/firebase/firebaseTypes'
import type { DeliveryCost } from '@/shared-types/deliveryCost/deliveryCost'

export interface RewardPolicy {
  saveType: 'point' | 'stamp'
  savedRatePrepaidPoint: number
  savedRatePrepaidCash: number
  savedRatePrepaidCard: number
  savedRateDeferredpayCard: number
  savedRateDeferredpayCash: number
  stampRules: {
    stampCount: number
    couponId: string
  }[]
}

export interface KakaoInfo {
  kakaoChannelId: string
  noticeCodeDeliveryStart: string
  noticeCodeGiftRecipient: string
  noticeCodeGiftSender: string
  noticeCodeOrderComplete: string
  noticeCodeOrderReady: string
  noticeCodePurchaseStamp: string
  securedSender: string
  securedSenderKey: string
}

export interface BusinessHours {
  timeNowClose: Timestamp | null
  timeOrderOpen: Timestamp | null
  timeOrderClose: Timestamp | null
  timeShopOpen: Timestamp | null
  timeShopClose: Timestamp | null
  isOpenYearRound: boolean
  isOpen24Hours: boolean
}

export interface BusinessInfo {
  shopName: string
  brandName: string
  ceoName: string
  address_name: string
  road_address_name: string
  building_name: string
  encryptedDetailAddress: string
  postCode: string
  geoPoint: GeoPoint | null
  geoHash: string
  businessRegistrationNumber: string // 사업자 등록번호
  permitNumber: string // 영업 허가번호
  telecomBusinessNumber: string // 통신판매업 번호
}

export interface ContactInfo {
  securedPhoneMain: string // 대표 핸드폰번호
  securedPhoneSub1: string
  securedPhoneSub2: string
  securedLandlineMain: string // 대표 유선전화
  phoneSuffix: string
  securedEmail: string
  emailHash: string
}

export interface VersionInfo {
  productVersion: number
  categoryVersion: number
  optionVersion: number
  optionGroupVersion: number
}

export interface OrderSupport {
  supportTakeout: boolean
  supportDineIn: boolean
  supportDelivery: boolean
  supportParcel: boolean
}

export interface Company {
  id: string


  // 소속 관계
  companyParentRef: DocumentReference | null
  isHeadCompany: boolean

  // 운영 상태
  isOpen: boolean

  // 영업 시간 및 정책
  businessHours: BusinessHours

  // 위치 정보
  businessInfo: BusinessInfo

  // 이미지
  imageThumbnailFileName: string
  imageGalleryFileNames: string[]

  // 공지
  notice: string
  isNoticeDisplay: boolean

  // 주문 지원
  orderSupport: OrderSupport

  // 배송비
  deliveryCost: DeliveryCost

  // 적립 정책
  rewardPolicy: RewardPolicy

  // 연락처 및 인증 정보
  contactInfo: ContactInfo

  // 카카오 알림톡 설정
  kakaoInfo: KakaoInfo

  // 버전 정보
  versionInfo: VersionInfo

  searchField: string[] // 검색을 위한 키워드 (예: 전화번호 끝 4자리, 이메일 해시 등)


  // 메타
  dateCreated: Timestamp | null
  dateModified: Timestamp | null
  iv: string // 🔐 문서 암호화 IV
}
export function createEmptyCompany(): Company {
  const now = Timestamp.now()

  return {
    id: '',


    companyParentRef: null,
    isHeadCompany: false,

    isOpen: false,

    businessHours: {
      isOpenYearRound: false,
      isOpen24Hours: false,
      timeNowClose: null,
      timeOrderOpen: null,
      timeOrderClose: null,
      timeShopOpen: null,
      timeShopClose: null,
    },

    businessInfo: {
      shopName: '',
      brandName: '',
      ceoName: '',
      address_name: '',
      road_address_name: '',
      building_name: '',
      encryptedDetailAddress: '',
      postCode: '',
      geoPoint: null,
      geoHash: '',
      businessRegistrationNumber: '',
      permitNumber: '',
      telecomBusinessNumber: ''
    },

    imageThumbnailFileName: '',
    imageGalleryFileNames: [],

    notice: '',
    isNoticeDisplay: false,

    orderSupport: {
      supportTakeout: false,
      supportDineIn: false,
      supportDelivery: false,
      supportParcel: false,
    },

    deliveryCost: {
      basicCost: 0,
      basicM: 0,
      addCost: 0,
      addM: 0,
      supportStrCost: '',
    },

    rewardPolicy: {
      saveType: 'point',
      savedRatePrepaidPoint: 0,
      savedRatePrepaidCash: 0,
      savedRatePrepaidCard: 0,
      savedRateDeferredpayCard: 0,
      savedRateDeferredpayCash: 0,
      stampRules: [],
    },

    contactInfo: {
      securedPhoneMain: '',
      securedPhoneSub1: '',
      securedPhoneSub2: '',
      securedLandlineMain:'',
      phoneSuffix: '',
      securedEmail: '',
      emailHash: '',
    },

    kakaoInfo: {
      kakaoChannelId: '',
      noticeCodeDeliveryStart: '',
      noticeCodeGiftRecipient: '',
      noticeCodeGiftSender: '',
      noticeCodeOrderComplete: '',
      noticeCodeOrderReady: '',
      noticeCodePurchaseStamp: '',
      securedSender: '',
      securedSenderKey: '',
    },

    versionInfo: {
      productVersion: 0,
      categoryVersion: 0,
      optionVersion: 0,
      optionGroupVersion: 0,
    },
    searchField: [], // 검색을 위한 키워드 (예: 전화번호 끝 4자리, 이메일 해시 등)


    dateCreated: now,
    dateModified: now,
    iv: '', // 🔐 문서 암호화 IV
  }
}
