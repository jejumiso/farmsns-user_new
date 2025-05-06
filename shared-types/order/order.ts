import type { CartItem, ProcessedOrderItem } from '@/shared-types/cart/cartItem'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'
import type { DeliveryAddress } from '../delivery-address/deliveryAddress'
import type { Timestamp } from '@/shared/firebase/firebaseTypes'

// types/orderStatus.ts
type OrderStatus =
  | 'pending'              // 주문 생성됨
  | 'paymentProcessing'    // 결제 시도 중
  | 'completed'            // 결제 및 주문 완료
  | 'cancelled'            // 주문 취소됨
  | 'failed'               // 결제 실패
  | 'failed_system'        // 결제 승인됨 + 처리 실패

// types/processStatus.ts
export type ProcessStatus = 
  | 'waitingConfirm' // ✅ 접수 대기 (사장님 미확인)
  | 'ordered'        // 주문 접수됨 (사장님 확인함)
  | 'cooking'        // 조리중
  | 'ready'          // 조리 완료
  | 'waitingPickup'  // 픽업/배달 대기
  | 'delivering'     // 배달중
  | 'delivered'      // 배달 완료
  | 'completed'      // 최종 완료
  | 'cancelled'      // 주문 취소

  interface PaymentLog {
    tid: string
    type: 'approved' | 'cancelled' | 'failed'
    method: 'card' | 'naverpay' | 'kakaopay' | 'easy'
    amount: number
    dateProcessed: Timestamp
    reason?: string // 취소 사유 등
  }
  

  
  export interface Order {
    id?: string // 주문 ID (firestore id 등)
    
    companyId: string // 주문한 회사 ID
    customerId: string // 주문한 고객 ID
  
    cartItems: CartItem[] // 장바구니 상품 목록
    selectedCoupons: IssuedCoupon[] // 선택한 쿠폰들
    usedPoint: number // 사용한 포인트
    paymentMethod: 'zeropay' | 'onsite' | 'card' | 'bank' | 'naverpay' | 'kakaopay' | 'easy' // 결제 수단
    selectedMethod: 'takeout' | 'dinein' | 'delivery' // 주문 방법 (포장, 매장, 배달)

    cartTotalBase: number /** 상품 기본금액 총합 (옵션 미포함, 쿠폰 적용 전 실 판매가) */
    cartTotalWithOptions: number   /** 옵션 가격 포함된 총 상품 금액 (쿠폰 적용 전 실 판매가) */
    couponDiscountTotal: number // 선택된 쿠폰들의 총 할인 금액
  
    finalAmount: number // 최종 결제 금액
    deliveryFee: number // 배송비
    distance: number | null // 매장 ↔ 배송지 거리 (배달일 경우)
  
    selectedAddress: DeliveryAddress // 선택된 배송지 (배달일 경우)
  
    orderStatus: OrderStatus   // 결제 흐름
    processStatus: ProcessStatus // 주문 처리 흐름
  
    dateCreated: Timestamp // 주문 생성 타임스탬프 (millisecond)
    dateModified: Timestamp // 수정 시각
  
    rewardPointPlanned: number // 예정 포인트
    rewardStampPlanned: number // 예정 스탬프
    customerMemo: string 



    dateCreatedYYYYmmdd: number // 주문 생성 시각 (YYYYMMDD)
    dateCreatedYYYYmm: number // 주문 생성 시각 (YYYYMM)
    
  
    // ✅ 결제 요약 정보 추가
    pgPaidAmount : number // PG사에 결제 요청된 금액 (누적 잔액)
    paymentLogs: PaymentLog[] // 결제 시도/승인/취소 로그 목록

    paidAmount: number // 실제 결제된 금액 (누적 잔액)
    datePayment: Timestamp // 가장 최근 결제 완료 시각
    paymentConfirmed: boolean // 결제 완료 여부 (성공한 경우만 true)
  }
  

  export interface OrderToSave extends Omit<Order, 'cartItems'> {
    orderItems: ProcessedOrderItem[] // 더 정확한 형태
  }
  