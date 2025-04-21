import { Timestamp } from '../../shared/firebase/firebaseTypes'

export interface OptionGroup {
  id: string                 // 옵션 그룹 ID (문서 ID)
  useParentData: boolean    // 부모 그룹 데이터 사용 여부
  parentOptionGroupId: string // 부모 그룹 ID (상속용)
  optionGroupName: string   // 그룹 이름
  displayLevel: number      // 정렬 우선순위
  optionIds: string[]       // 포함된 옵션 ID 목록
  dateCreated: Timestamp    // 생성일
  dateModified: Timestamp   // 수정일
}

export function createEmptyOptionGroup(): OptionGroup {
  return {
    id: '',
    useParentData: false,
    parentOptionGroupId: '',
    optionGroupName: '',
    displayLevel: 1000,
    optionIds: [],
    dateCreated: Timestamp.now(),
    dateModified: Timestamp.now(),
  }
}
