// 📁 src/shared-types/nicepay/registerNiceCard.ts

export interface RegisterNiceCardResult {
    bid: string         // 나이스페이에서 발급한 카드 식별값
    authDate: string    // 인증 날짜 (ex: 20240430)
    cardCode: string    // 카드사 코드 (예: '51' → 삼성카드)
    cardName: string    // 카드사 이름 (예: '삼성카드')
  }
  