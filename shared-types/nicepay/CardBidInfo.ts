// 📁 shared-types/payment/CardBidInfo.ts

export interface CardBidInfo {
    id: string             // 카드 BID (문서 ID)
    bid: string             // 나이스페이 발급 BID
    authDate?: string       // 인증 날짜 (있을 경우)
  }
  