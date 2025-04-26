import { GeoPoint } from '@/shared/firebase/firebaseTypes'

export interface DeliveryAddress {
  id: string // 배송지 고유 ID
  label: string // '집', '회사' 등

  address_name: string // 전체 주소 (지번 또는 도로명)
  road_address_name?: string // 도로명 주소
  building_name?: string // 건물명

  encryptedDetailAddress: string // 암호화된 상세 주소 (예: 301호)
  encryptedRecipientName: string // 암호화된 수령인
  encryptedPhoneNumber: string // 암호화된 연락처

  geoPoint: GeoPoint // 좌표 정보
  geoHash: string // 좌표 해시

  isDefault: boolean // 기본 배송지 여부
  postCode: string // 우편번호 (선택)
  requestShop: string // 배달 요청사항 (예: 문 앞에 두세요)
  index?: number // 정렬용 인덱스
  dateCreated?: Date // 생성일
}

export function createEmptyDeliveryAddress(): DeliveryAddress {
  return {
    id: '',
    label: '',
    address_name: '',
    road_address_name: '',
    building_name: '',

    encryptedDetailAddress: '',
    encryptedRecipientName: '',
    encryptedPhoneNumber: '',

    geoPoint: new GeoPoint(0, 0), // ✅ 수정된 부분
    geoHash: '',

    isDefault: false,
    postCode: '',
    requestShop: '',
    index: 100,
    dateCreated: new Date(),
  }
}
