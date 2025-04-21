import { DocumentReference, Timestamp } from "@/shared/firebase/firebaseTypes"
import { type ContactInfo } from "../company/company"



export interface Administrator {
  id: string // Firebase UID (문서 ID)

  // 🔐 개인정보
  contactInfo: ContactInfo

  securedUserName: string // 암호화된 사용자 이름
  securedUserNameHash: string // 해시된 사용자 이름 (검색용)

  // 📧 프로필 정보
  photoURL: string | null // 프로필 사진

  // 🏢 회사 정보
  companyId: string // 대표 회사 ID
  companyIds: string[] // 권한이 부여된 회사 ID 목록

  // 🛡️ 권한
  roles: string[] // 관리자 역할 (예: ['admin', 'staff'])

  // 📌 상태
  status:
    | 'new'
    | 'registered'
    | 'pending_approval'
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'deleted' // 관리자 계정 상태

  searchField: string[] // 검색을 위한 키워드 (예: 전화번호 끝 4자리, 이메일 해시 등)  

  // 🕒 메타 정보
  dateCreated: Timestamp // 생성 시각
  dateModified: Timestamp // 수정 시각

  // 🔐 암호화 키
  iv: string // 문서 암호화 IV
}

export function createEmptyAdministrator(params: {
  uid: string
  securedPhone: string
  phoneSuffix: string
  searchField : string[]
  iv: string
}): Administrator {
  const now = Timestamp.now()

  return {
    id: params.uid,
    contactInfo: {
      securedPhoneMain: params.securedPhone,
      securedPhoneSub1: '',
      securedPhoneSub2: '',
      securedLandlineMain:'',
      phoneSuffix: params.phoneSuffix,
      securedEmail: '',
      emailHash: '',
    },
    securedUserName: '',
    securedUserNameHash: '',

    photoURL: null,

    companyId: '',
    companyIds: [],

    roles: [],

    status: 'new',

    searchField: params.searchField,
    dateCreated: now,
    dateModified: now,

    iv: params.iv,
  }
}
