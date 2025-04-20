// path: src/types/company/company.ts
import { Timestamp, GeoPoint } from '../../shared/firebase/firebaseTypes';
import type { DeliveryCost } from '../deliveryCost/deliveryCost'
import type { Product } from '../product/product'
import type { Category } from '../category/category'
import type { Option } from '../option/option'
import type { TabletSettings } from '../tablet-settings/tabletSettings'

export interface Company {
  id: string
  storeType: string
  isOpen: boolean
  parentCompanyId: string
  isHeadCompany: boolean
  shopName: string
  imgUrl: string
  imgUrls: string[]
  timeNowClose: Timestamp | null
  timeOrderOpen: Timestamp | null
  timeOrderClose: Timestamp | null
  timeShopClose: Timestamp | null
  timeShopOpen: Timestamp | null
  isOpenYearRound: boolean
  isOpen24Hours: boolean
  notice: string
  isNoticeDisplay: boolean
  saveType: string
  savedRatePrepaidPoint: number
  savedRatePrepaidCash: number
  savedRatePrepaidCard: number
  savedRateDeferredpayCard: number
  savedRateDeferredpayCash: number
  password: string
  kakaoChannelId: string
  resPhoneNumber: string
  resPhoneNumber2: string
  senderKey: string
  sender: string
  resSenderKey: string
  resSender: string
  kakaoInfo: {
    kakaoChannelId: string
    noticeCodeDeliveryStart: string
    noticeCodeGiftRecipient: string
    noticeCodeGiftSender: string
    noticeCodeOrderComplete: string
    noticeCodeOrderReady: string
    noticeCodePurchaseStamp: string
    resSender: string
    resSenderKey: string
  }
  templates: string[]
  templatesStanby: string[]
  isReceivePacking: boolean
  isReceiveInside: boolean
  isReceiveDelivery: boolean
  brandName: string
  ceoName: string
  accountNum: string
  accountName: string
  accountBank: string
  postCode: string
  address1: string
  address2: string
  geoLatitude: number
  geoLongitude: number
  geoPoint: GeoPoint | null
  geoHash: string
  deliveryCost: DeliveryCost | null
  dateCreated: Timestamp | null
  dateModified: Timestamp | null
  productsUser: Product[]
  categoriesUser: Category[]
  optionsUser: Option[]
  idCompany: string
  tabletSettings: TabletSettings
  productVersion : number
  categoryVersion : number
  optionVersion: number
  optionGroupVersion: number
  supportTakeout: boolean      // 포장
  supportDineIn: boolean       // 매장
  supportDelivery: boolean     // 배달
  supportParcel: boolean       // 택배
}

export function createEmptyCompany(): Company {
  return {
    id: '',
    storeType: '',
    isOpen: false,
    parentCompanyId: '',
    isHeadCompany: false,
    shopName: '',
    imgUrl: '',
    imgUrls: [],
    timeNowClose: null,
    timeOrderOpen: null,
    timeOrderClose: null,
    timeShopClose: null,
    timeShopOpen: null,
    isOpenYearRound: false,
    isOpen24Hours: false,
    notice: '',
    isNoticeDisplay: false,
    saveType: '',
    savedRatePrepaidPoint: 0,
    savedRatePrepaidCash: 0,
    savedRatePrepaidCard: 0,
    savedRateDeferredpayCard: 0,
    savedRateDeferredpayCash: 0,
    password: '',
    kakaoChannelId: '',
    resPhoneNumber: '',
    resPhoneNumber2: '',
    senderKey: '',
    sender: '',
    resSenderKey: '',
    resSender: '',
    kakaoInfo: {
      kakaoChannelId: '',
      noticeCodeDeliveryStart: '',
      noticeCodeGiftRecipient: '',
      noticeCodeGiftSender: '',
      noticeCodeOrderComplete: '',
      noticeCodeOrderReady: '',
      noticeCodePurchaseStamp: '',
      resSender: '',
      resSenderKey: '',
    },
    templates: [],
    templatesStanby: [],
    isReceivePacking: false,
    isReceiveInside: false,
    isReceiveDelivery: false,
    brandName: '',
    ceoName: '',
    accountNum: '',
    accountName: '',
    accountBank: '',
    postCode: '',
    address1: '',
    address2: '',
    geoLatitude: 0,
    geoLongitude: 0,
    geoPoint: null,
    geoHash: '',
    deliveryCost: {
      basicCost: 0,
      basicM: 0,
      addCost: 0,
      addM: 0,
      supportStrCost: ''
    },
    dateCreated: null,
    dateModified: null,
    productsUser: [],
    categoriesUser: [],
    optionsUser: [],
    idCompany: '',
    tabletSettings: {
      useStandbyScreen: false,
      allowTouchOnStandby: false,
      useRewardInputScreen: false,
      usePhoneInputScreen: true,
      rewardType: 'stamp',
      pendingRewardAmount: 0,
      rewardResetValue: 0,
      dateCreated: null,
    } as TabletSettings,
    productVersion: 0,
    categoryVersion: 0,
    optionVersion: 0,
    optionGroupVersion: 0,
    supportTakeout: false,      // 포장
    supportDineIn: false,       // 매장
    supportDelivery: false,     // 배달
    supportParcel: false        // 택배
  }
}


