import { Timestamp } from '../../shared/firebase/firebaseTypes'

// 충돌 조합 정의: 특정 옵션값 간 충돌 및 경고 메시지 표시
export interface InvalidCombination {
  optionId: string // 대상 옵션 ID
  thisValue: string[] // 현재 옵션의 값
  otherValue: string[] // 충돌되는 옵션의 값
  warningMsg: string // 사용자에게 보여줄 안내 메시지
}

// 옵션 선택 방식
export type OptionType =
  | 'select'    // 드롭다운 / 선택형
  | 'check'     // 체크박스
  | 'quantity'  // 수량 조절형

// UI 스타일 종류
export type OptionStyleType =
  | 'default'
  | 'emphasized'
  | 'inline'
  | 'segmented'
  | 'required-highlight'

// 옵션 인터페이스
export interface Option {
  id: string // 옵션 ID
  useParentData: boolean
  parentOptionId: string

  optionName: string // 옵션명
  type: OptionType // 옵션 타입
  styleType: OptionStyleType // UI 스타일

  optionItems: string[] // 선택 가능한 항목들
  optionItemsPrice: number[] // 각 항목별 추가 가격

  msg: string // 하단 안내 메시지
  displayLevel: number // 정렬 우선순위

  invalidCombinations: InvalidCombination[] // 유효하지 않은 조합
  isDeleted: boolean // 삭제 여부

  dateCreated: Timestamp | null // 생성일
  dateModified: Timestamp | null // 수정일
}

// 빈 옵션 생성 함수
export function createEmptyOption(): Option {
  return {
    id: '',
    useParentData: false,
    parentOptionId: '',

    
    optionName: '',
    type: 'select',
    styleType: 'default',

    optionItems: [],
    optionItemsPrice: [],

    msg: '',
    displayLevel: 1000,

    invalidCombinations: [],
    isDeleted: false,
    dateCreated: null,
    dateModified: null,
  }
}
