import { Timestamp } from '../../shared/firebase/firebaseTypes';

export interface OptionGroup {
  id: string;
  useParentData: boolean;
  parentOptionGroupId: string;
  optionGroupName: string;
  displayLevel: number
  optionIds: string[];
  docId: string; 
  isDeleted: boolean;
  dateModified: Timestamp;
  dateCreated: Timestamp;
}

// 비어있는 값으로 초기화된 OptionGroupModelType 객체 생성 함수
export function createEmptyOptionGroup(): OptionGroup {
  return {
    id: '',
    useParentData: false,
    parentOptionGroupId: '',
    optionGroupName: '',
    displayLevel: 1000,
    optionIds: [],
    docId: '', 
    isDeleted: false,  
    dateCreated: Timestamp.fromDate(new Date(0)),
    dateModified: Timestamp.fromDate(new Date(0)), // 초기값: 1970-01-01
  };
}
