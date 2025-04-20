import { GeoPoint, Timestamp } from '../../shared/firebase/firebaseTypes';
import { type DeliveryAddress } from '../delivery-address/deliveryAddress';

export interface CustomerProfile {
  id: string; // Firebase UID (문서 ID)
  securedPhone: string; // 암호화된 전화번호
  photoURL: string | null; // 프로필 이미지
  companyIds: string[]; // 가입/이용한 업체 ID 목록
  userName: string; // 사용자 이름 또는 닉네임
  isMember: boolean; // 멤버십 가입 여부
  deliveryAddressList: DeliveryAddress[]; // 배송지 최대 5개
  customerRating: string; // 고객 등급 (예: silver)
  orderTotalCount: number; // 누적 주문 수
  orderTotalPrice: number; // 누적 주문 금액
  rewardCount: number; // 누적 리워드 수
  rewardCompany: string; // 마지막 리워드 지급 업체
  dateLastOrder: Timestamp |null ; // 마지막 주문 시각
  dateCreated: Timestamp ; // 생성일
  dateModified: Timestamp ; // 수정일
  dateLastAccess: Timestamp ; // 마지막 접속일
  version: number; // 데이터 구조 버전
}


export function createEmptyUserModel(params: {
  uid: string
  securedPhone: string
}): CustomerProfile {
  const now = Timestamp.now()

  return {
    id: params.uid,
    securedPhone: params.securedPhone,
    photoURL: null,
    companyIds: [],
    userName: '',
    isMember: false,
    deliveryAddressList: [],
    customerRating: '',
    orderTotalCount: 0,
    orderTotalPrice: 0,
    rewardCount: 0,
    rewardCompany: '',
    dateLastOrder: null,
    dateCreated: now,
    dateModified: now,
    dateLastAccess: now,
    version: 1,
  }
}
