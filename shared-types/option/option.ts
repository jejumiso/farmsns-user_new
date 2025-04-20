// /types/Option/optionModel.ts
import { Timestamp } from '../../shared/firebase/firebaseTypes';
export interface InvalidCombination {
  optionId: string;              // 다른 옵션 ID
  thisValue: string[];            // 현재 옵션의 특정 값
  otherValue: string[];           // 충돌되는 값
  warningMsg: string;           // 사용자에게 보여줄 안내 메시지
}

// 사용자가 선택할 수 있는 옵션 타입 정의
export type OptionType =
  | 'select'     // 항목 선택형 (가격은 0일 수도, 유료일 수도 있음)
  | 'check'      // 체크박스 선택
  | 'quantity';  // 수량 선택


export interface Option {
  id: string;
  docId: string; // 문서 ID (옵션이 속한 문서의 ID)

  useParentData: boolean;
  parentOptionId: string;

  optionName: string;
  type:  OptionType;
  styleType: string;

  optionItems: string[];
  optionItemsPrice: number[];

  msg: string;

  displayLevel: number;

  // 충돌 조합 정보 (단순 + 복합 대응 가능)
  invalidCombinations?: InvalidCombination[];
  isDeleted: boolean;
  dateCreated: Timestamp | null;
  dateModified: Timestamp | null;
}


// /types/Option/optionModel.ts (하단에 추가)
export function createEmptyOption(): Option {
  return {
    id: '',
    docId: '',

    useParentData: false,
    parentOptionId: '',

    optionName: '',
    type: 'select',
    styleType: '',

    optionItems: [],
    optionItemsPrice: [],

    msg: '',

    displayLevel: 1000,

    invalidCombinations: [],
    isDeleted: false,
    dateCreated: null,
    dateModified: null,
    
  };
}
