import type { CustomerProfile } from "../customer-profile/customerProfile";
import type { CustomerCompanyActivity } from "../customer-company-activity/customerCompanyActivity";

export type CartModel = {
    id: string;
    couponUsage: { couponId: string; usedAmount: number }[]; // 사용된 쿠폰 ID와 금액

    idUser: string;
    idCompany: string;
    status: string;
    orderNum: number; // 당일 주문 접수 순번
    completion: boolean; // 취소, 완료 처리 상태
    receiveType: string;
    stringEstimateTime: string; // 고객 도착 예상 시간
    phoneNumber: string;
    resPhoneNumber: string;
    deliveryCharge: number; // 배송비
    // deliveryAddress?: DeliveryAddressModel | null;
    timeOfReceipt?: Date | null;
    timeOfReady?: Date | null;
    itemOfFinish?: Date | null;
    requestShop: string;
    totalGetStamp: number;
    totalProductPrice: number; // 총 상품 가격
    totalPrice: number; // 총 가격
    totalGetPoint: number; // 획득 포인트
    paymentWooriCard: number; // 우리포인트 카드 결제 금액
    paymentWooriMoney: number; // 우리포인트 머니로 결제한 금액
    paymentWooriPoint: number; // 우리포인트 포인트로 결제한 금액
    pamentShopOnSite: number; // 현장 결제 금액
    pamentShopCreditCommerce: number; // 외상 거래 금액
    paymentShopCard: number; // 카드 결제 금액
    paymentShopMoney: number; // 머니 결제 금액
    paymentShopPoint: number; // 포인트 결제 금액
    paymentCouponPoint: number; // 쿠폰 결제 포인트
    userInCompany?: CustomerCompanyActivity | null;
    userInWooriPoint?: CustomerProfile | null;
    // couponUsedLogList: CouponUsedLogModel[];
    // depositList: DepositModel[];
    // pointSaveList?: PointSaveModel | null;
    // cartProducts: CartProductModel[];
    dateCreated: Date; // 주문 생성 시간
    dateCreatedyyyyMMdd: number;
    dateCreatedyyyyMM: number;
    dateCreatedyyyy: number;
};
