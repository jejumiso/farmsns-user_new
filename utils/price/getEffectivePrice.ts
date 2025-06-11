// utils/price/getEffectivePrice.ts
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import type { Product } from '~/shared-types/product/product'

export function getEffectivePrice(product: Product): number {
  const authStore = useUserAuthStore()
  if (
    authStore.friendtalkReceiver &&
    product.priceFriendtalk &&
    product.priceFriendtalk > 0 &&
    product.priceDiscounted > product.priceFriendtalk
  ) {
    return product.priceFriendtalk
  }
  return product.priceDiscounted
}
