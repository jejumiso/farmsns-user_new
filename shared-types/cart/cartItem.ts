export interface CartItemOption {
  optionId: string
  optionName: string
  selectedValue: string
  price: number
}

export interface CartItem {
  id: number
  productId: string
  productName: string
  priceOriginal: number
  priceDiscounted: number
  quantity: number
  image: string
  rewardStamp: number
  rewardPoint: number
  rewardExcludedQuantity: number
  parcelBundleValue? : number // 📦 묶음 배송 단위 계산에 기여하는 수치 (기본 1)
  options: CartItemOption[]
}


// export interface OrderItemOption {
//   optionId: string
//   optionName: string
//   selectedValue: string
//   price: number
// }



export interface ProcessedOrderItem {
  productId: string
  productName: string
  priceOriginal: number
  priceDiscounted: number
  image: string
  rewardPoint: number
  rewardStamp: number
  quantity: number
  parcelBundleValue? : number // 📦 묶음 배송 단위 계산에 기여하는 수치 (기본 1)
  options: CartItemOption[]  // 타입 명확히 정의 가능
}

