// category.ts

import { Timestamp } from '../../shared/firebase/firebaseTypes';

export interface Category {
    id: string
    docId: string
    categoryName: string
    displayLevel: number
    useParentData: boolean
    parentCategoryId: string
    isDeleted: boolean
    dateCreated: Timestamp | null;
    dateModified: Timestamp | null;
  }
  
  // 기본값 생성 함수
  export function createEmptyCategory(): Category {
    return {
      id: '',
      docId: '',
      categoryName: '',
      displayLevel: 1000,
      useParentData: false,
      parentCategoryId: '',
      isDeleted: false,  
      dateCreated: null,
      dateModified: null,
    };
  }
  
  