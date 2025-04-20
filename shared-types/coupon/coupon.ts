import { Timestamp } from "@/shared/firebase/firebaseTypes"

export interface Coupon {
    id: string
    type: 'discount' | 'freeDrink' | 'gift'
    name: string
    isUsed: boolean
    expiresAt?: Timestamp
  }
  