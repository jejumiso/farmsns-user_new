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
  rewardExcludedQuantity: number // ✅ 추가
  options: {
    optionId: string
    optionName: string
    selectedValue: string
    price: number
  }[]
}