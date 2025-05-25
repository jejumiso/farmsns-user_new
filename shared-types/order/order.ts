// 📁 shared-types/order/order.ts
import type { CartItem, ProcessedOrderItem } from '@/shared-types/cart/cartItem'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'
import type { DeliveryAddress } from '../delivery-address/deliveryAddress'
import type { Timestamp } from '@/shared/firebase/firebaseTypes'
import type { UserSummary } from '../user/userSummary'
import type { PaymentMethod, SelectedMethod } from './orderTypes'

/**
 * 주문이 생성된 채널 (고객이 어떤 방식으로 주문했는가)
 */
export type OrderChannel = 
  | 'web'          // 웹사이트, 모바일 웹
  | 'kiosk'        // 키오스크, 포스기
  | 'admin'        // 매장 직원 수기입력
  | 'phone'        // 전화 주문
  | 'deliveryApp'  // 배달앱 주문 (배민, 요기요 등)
  | 'etc'          // 기타

/**
 * 결제 흐름 상태 (주문 생성 → 결제 성공/실패 → 취소 등)
 */
export type OrderStatus =
  | 'pending'              // 주문 생성됨
  | 'paymentProcessing'    // 결제 시도 중
  | 'completed'            // 결제 및 주문 완료
  | 'cancelled'            // 주문 취소됨
  | 'failed'               // 결제 실패
  | 'failed_system'        // 결제 승인됨 + 처리 실패

/**
 * 매장에서의 주문 처리 상태 (조리, 준비, 배달 등)
 */
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

  // interface PaymentLog {
  //   tid: string
  //   type: 'approved' | 'cancelled' | 'failed'
  //   method: 'card' | 'naverpay' | 'kakaopay' | 'easy'
  //   amount: number
  //   dateProcessed: Timestamp
  //   reason?: string // 취소 사유 등
  // }
  


  
/**
 * 결제 수단별 요약 정보 (카드, 포인트, 쿠폰 등 각각의 결제에 대한 상세)
 */
export interface PaymentSummary {
  method: PaymentMethod
  amount: number
  confirmed: boolean
  dateProcessed: Timestamp
  reason?: string

  pgData?: {
    tid?: string
    cardName?: string
    transactionNumber?: string
    raw?: any
  }

  readerData?: {
    tid?: string
    terminalId?: string
    cardName?: string
    issuer?: string
    transactionNumber?: string      // ✅ 추가
    approveTime?: string            // ✅ 추가
    companyName?: string            // ✅ 추가
    readerVendor?: string           // ✅ 추가
    installment?: string            // ✅ 추가
    batchNumber?: string            // ✅ 추가
    cardBin?: string                // ✅ 추가
    isSuccess?: boolean             // ✅ 추가
    raw: any
  }
}



  /**
 * 실제 주문 정보 전체
 */
  interface OrderBase<TItems> {

    id?: string // 주문 ID (firestore id 등)

    // 1. 주문 정보
    orderChannel: OrderChannel // 'kiosk', 'web' 등
    terminalId: string | null         // ✅ (kiosk일 때만) 사용되는 장비 ID
    companyId: string // 주문한 회사 ID
    uid: string // 주문한 고객 ID
    userSummary: UserSummary // ✅ 사용자 요약 정보 포함
    selectedMethod: SelectedMethod // 주문 방법 (포장, 매장, 배달)
  
    items: TItems[]
    selectedCoupons: IssuedCoupon[] // 선택한 쿠폰들
    paymentMethod: PaymentMethod // 결제 수단

    /** 2 금액 계산 정보 */
    cartTotalBase: number /** 상품 기본금액 총합 (옵션 미포함, 쿠폰 적용 전 실 판매가) */
    cartTotalWithOptions: number   /** 옵션 가격 포함된 총 상품 금액 (쿠폰 적용 전 실 판매가) */
    deliveryFee: number            // 배달비 (0원 가능)
    couponDiscountTotal: number // 선택된 쿠폰들의 총 할인 금액
    pointDiscountTotal: number // 사용된 포인트 할인 금액

    /** 3 배송 정보 (배달일 경우) */
    selectedAddress?: DeliveryAddress
    distance: number | null        // 매장 ↔ 고객 거리
    

    
    /** 4 주문 및 처리 상태 */
    orderStatus: OrderStatus
    processStatus: ProcessStatus

    /** 5. 결제 관련 정보 */
    paySummaries: PaymentSummary[] // 수단별 결제 처리 내역
    payLastConfirmedAt?: Timestamp // 가장 마지막으로 승인된 결제 시간    

    /** 6 생성 시각 및 통계용 */
    /** 적립 예정 혜택 */
    rewardPointPlanned: number
    rewardStampPlanned: number
    customerMemo: string    
    dateCreated: Timestamp
    dateModified: Timestamp
    dateCreatedYYYYmm: number
    dateCreatedYYYYmmdd: number
  }
  

export type Order = OrderBase<CartItem>
export type OrderToSave = OrderBase<ProcessedOrderItem>
  

export class OrderModel<TItem> {
  constructor(private order: OrderBase<TItem>) {}

  // 실제 저장된 원본
  get raw(): OrderBase<TItem> {
    return this.order
  }

  get items(): TItem[] {
    return this.order.items
  }

  /** 상품 + 배송비 */
  get finalAmount(): number {
    return this.order.cartTotalWithOptions + this.order.deliveryFee
  }

  /** 쿠폰 + 포인트 할인 금액 총합 */
  get discountTotal(): number {
    return this.order.couponDiscountTotal + this.order.pointDiscountTotal
  }

  /** 실제 결제해야 할 금액 */
  get payableAmount(): number {
    return this.finalAmount - this.discountTotal
  }

  /** 하나라도 결제 성공 여부 */
  get isPaymentConfirmed(): boolean {
    return this.order.paySummaries.some(p => p.confirmed)
  }

  /** 마지막 결제 완료 시각 */
  get payLastConfirmedAt(): Timestamp | undefined {
    return this.order.paySummaries
      .filter(p => p.confirmed)
      .sort((a, b) => b.dateProcessed.toMillis() - a.dateProcessed.toMillis())[0]?.dateProcessed
  }

  get confirmedPayAmount(): number {
    return this.order.paySummaries
      .filter(p => p.confirmed)
      .reduce((sum, p) => sum + p.amount, 0)
  }

  get primaryPaymentMethod(): string | undefined {
    return this.order.paySummaries.find(p => p.confirmed)?.method
  }

  get pgPaidAmount(): number {
    return this.order.paySummaries
      .filter(p => p.confirmed && p.method === 'card')
      .reduce((sum, p) => sum + p.amount, 0)
  }


}

