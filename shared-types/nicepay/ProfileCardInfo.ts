// 📁 shared-types/payment/ProfileCardInfo.ts


  export interface ProfileCardInfo {
    id : string
    cardName: string        // 예: "삼성카드"
    cardCode: string        // 예: "51"
    cardPlainText : string       
    cardNoSuffix: string // 예: '1234'
    password: string        // 카드 비밀번호 앞 두자리
    authDate?: string       // 나이스페이에서 최초 발급일 각 회사별 카드 발급일은 다름.
  }