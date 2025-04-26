import { Timestamp } from '@/shared/firebase/firebaseTypes'

export interface TabletSettings {
  id: string             // 문서 ID (tabletId)
  useStandbyScreen: boolean        // 대기 화면 사용 여부
  allowTouchOnStandby: boolean     // 대기 화면에서 터치 허용 여부
  useRewardInputScreen: boolean    // 리워드 입력 화면 사용 여부
  usePhoneInputScreen: boolean     // 전화번호 입력 화면 사용 여부

  rewardType: 'stamp' | 'point'    // 리워드 방식: 스탬프 또는 포인트
  pendingRewardAmount: number     // 누적 리워드 수량 (적립 대기 중)

  dateCreated: Timestamp | null   // 설정 생성일
}

export function createEmptyTabletSettings(): TabletSettings {
  return {
    id: '', // 문서 ID (tabletId)
    useStandbyScreen: true,
    allowTouchOnStandby: true,
    useRewardInputScreen: true,
    usePhoneInputScreen: true,

    rewardType: 'stamp',
    pendingRewardAmount: -1, // 리스닝을 위해 기본값을 -1로 주었음.

    dateCreated: Timestamp.now(), // 현재 시간으로 초기화
  }
}
