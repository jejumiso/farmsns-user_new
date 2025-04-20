import type { OrderProductSnapshot } from './orderProductSnapshot'

export interface OrderItem {
  id: string // 고유 ID (timestamp 등)
  quantity: number // 주문 수량
  totalPrice: number // 옵션 포함 단가 × 수량

  snapshot: OrderProductSnapshot // 주문 당시 상품 정보 스냅샷
}
