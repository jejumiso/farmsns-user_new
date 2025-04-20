import type { OrderItem } from './orderItem'
import type { CustomerProfile } from '../customer-profile/customerProfile'
import type { CustomerCompanyActivity } from '../customer-company-activity/customerCompanyActivity'
import type { DeliveryAddress } from '../delivery-address/deliveryAddress'
import type { Timestamp } from 'firebase/firestore'

export interface Order {
  id: string // 주문 ID
  uid: string // 사용자 UID
  companyId: string

  receiveType: '매장' | '포장' | '배달'
  deliveryAddress?: DeliveryAddress | null

  items: OrderItem[]
  totalProductPrice: number
  totalDiscount: number
  totalPrice: number

  payment: {
    coupon: number
    point: number
    money: number
    card: number
    onSite: number
    bankTransfer: number
  }

  stampEarned: number
  pointEarned: number

  requestShopMessage: string
  status: '주문접수' | '조리중' | '조리완료' | '배달중' | '완료' | '취소'
  isCompleted: boolean

  userProfile: CustomerProfile
  userCompanyActivity: CustomerCompanyActivity | null

  dateCreated: Timestamp
  dateUpdated: Timestamp
}
