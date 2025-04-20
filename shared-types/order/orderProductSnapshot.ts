export interface OrderProductSnapshot {
    productId: string
    name: string
    price: number
    image: string
    description?: string
  
    options: {
      optionId: string
      optionName: string
      selectedValue: string
      price: number
    }[]
  }
  