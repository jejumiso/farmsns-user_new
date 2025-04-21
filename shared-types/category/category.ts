import { Timestamp } from '../../shared/firebase/firebaseTypes'

export interface Category {
  id: string                   // 고유 ID (또는 문서 ID)
  
  useParentData: boolean
  parentCategoryId: string
  categoryName: string         // 카테고리 이름
  displayLevel: number         // 정렬 우선순위 (낮을수록 먼저 표시됨)
  dateCreated: Timestamp | null // 생성 시각
  dateModified: Timestamp | null // 수정 시각
}

// 기본값 생성 함수
export function createEmptyCategory(): Category {
  return {
    id: '',
    useParentData: false,
    parentCategoryId: '',
    categoryName: '',
    displayLevel: 1000,
    dateCreated: null,
    dateModified: null,
  }
}
