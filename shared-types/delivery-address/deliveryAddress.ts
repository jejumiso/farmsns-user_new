import type { GeoPoint } from "@/shared/firebase/firebaseTypes"

export interface DeliveryAddress {
  id: string                    // 배송지 문서 ID
  label: string                 // 주소 별칭 (예: '집', '회사', '엄마 집')

  // 🔓 카카오 API에서 받은 도로명/지번 주소 (표시용)
  address_name: string          // 전체 주소 문자열 (예: 서울 강남구 역삼동 737)
  road_address_name?: string    // 도로명 주소 (예: 서울 강남구 테헤란로 152)
  building_name?: string        // 건물명 (예: 강남파이낸스센터)

  // 🔐 개인정보 (암호화)
  encryptedDetailAddress: string   // 상세주소 (301호 등)
  encryptedRecipientName: string   // 수령자 이름
  encryptedPhoneNumber: string     // 수령자 전화번호

  // 📍 위치 정보
  geoPoint: GeoPoint               // 좌표 정보 (위도/경도)

  // 🛠️ 기타
  isDefault: boolean               // 기본 배송지 여부
  postCode?: string                // 우편번호 (선택)
  requestShop?: string            // 가게 요청사항 (문 앞에 두세요 등)
  meter?: number                  // 매장과의 거리 (미터 단위, 선택)
  index?: number                  // 정렬용 인덱스 (선택)
  createdAt?: Date                // 생성일 (선택)
}
