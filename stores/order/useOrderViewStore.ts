// // stores/view/order/useOrderViewStore.ts
// import { defineStore } from 'pinia';
// import { useCartStore } from '@/stores/cart/useCartStore';
// import { useCompanyStore } from '@/stores/company/useCompanyStore';
// import { computed } from 'vue';
// import type { IssuedCoupon } from '~/shared-types/coupon/issuedCoupon';
// import type { OrderSummary } from '~/shared-types/order/orderSummary';

// export const useOrderViewStore = defineStore('orderView', {
//   state: () => ({
//     selectedMethod: 'takeout', // 주문 방식 (포장, 매장, 배달)
//     usedPoint: 0,
//     selectedCoupons: [] as IssuedCoupon[], // 쿠폰 객체 배열로 관리
//     paymentMethod: 'easy', // 결제 방법
//     scrollTop: 0,
//   }),

//   actions: {
//     reset() {
//       this.selectedMethod = 'takeout';
//       this.usedPoint = 0;
//       this.selectedCoupons = [];
//       this.paymentMethod = 'easy';
//       this.scrollTop = 0;
//     },

//     // OrderSummary 객체 초기화
//     initializeOrderSummary() {
//       const cartStore = useCartStore();
//       const companyStore = useCompanyStore();

//       const orderSummary: OrderSummary = {
//         items: cartStore.items, // 장바구니 아이템
//         totalAmount: cartStore.cartTotal, // 총 금액
//         selectedCoupons: this.selectedCoupons, // 선택된 쿠폰들
//         deliveryFee: cartStore.deliveryFee, // 배송비
//         paymentMethod: this.paymentMethod, // 결제 방법
//         usedPoint: this.usedPoint, // 사용된 포인트
//         selectedAddress: companyStore.currentCompany?.businessInfo.geoPoint, // 배송지
//         distance: null, // 거리 (예시로 초기값 null)
//       };

//       // 주문 요약 계산 후 처리 (예: 거리 계산 등)
//       if (this.selectedMethod === 'delivery') {
//         // 거리 계산 로직 (예: haversine 함수 사용)
//         orderSummary.distance = this.calculateDistance(); // 거리 계산 함수 호출
//       }

//       return orderSummary;
//     },

//     // 거리 계산 함수 (예시)
//     calculateDistance() {
//       const selectedAddress = this.selectedAddress;
//       const businessLocation = useCompanyStore().currentCompany?.businessInfo.geoPoint;
      
//       if (!selectedAddress || !businessLocation) return null;
      
//       const lat1 = selectedAddress.latitude;
//       const lon1 = selectedAddress.longitude;
//       const lat2 = businessLocation.latitude;
//       const lon2 = businessLocation.longitude;
      
//       // 거리 계산 로직 (haversine)
//       const R = 6371; // 지구 반경 (km)
//       const dLat = (lat2 - lat1) * Math.PI / 180;
//       const dLon = (lon2 - lon1) * Math.PI / 180;
//       const a = Math.sin(dLat / 2) ** 2 +
//                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//                 Math.sin(dLon / 2) ** 2;
//       const c = 2 * Math.asin(Math.sqrt(a));
//       const distance = R * c * 1000; // 거리 (m)
//       return distance;
//     },
//   },
// });
