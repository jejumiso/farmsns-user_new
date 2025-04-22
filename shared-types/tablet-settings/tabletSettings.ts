import { Timestamp } from '@/shared/firebase/firebaseTypes'

export interface TabletSettings {
  useStandbyScreen: boolean        // 대기 화면 사용 여부
  allowTouchOnStandby: boolean     // 대기 화면에서 터치 허용 여부
  useRewardInputScreen: boolean    // 리워드 입력 화면 사용 여부
  usePhoneInputScreen: boolean     // 전화번호 입력 화면 사용 여부

  rewardType: 'stamp' | 'point'    // 리워드 방식: 스탬프 또는 포인트
  pendingRewardAmount: number     // 누적 리워드 수량 (적립 대기 중)
  rewardResetValue: number        // 리워드 초기화 기준값 (예: 스탬프 10개 → 1개 교환)

  dateCreated: Timestamp | null   // 설정 생성일
}

export function createEmptyTabletSettings(): TabletSettings {
  return {
    useStandbyScreen: false,
    allowTouchOnStandby: false,
    useRewardInputScreen: false,
    usePhoneInputScreen: true,

    rewardType: 'stamp',
    pendingRewardAmount: 0,
    rewardResetValue: 0,

    dateCreated: Timestamp.now(), // 현재 시간으로 초기화
  }
}
