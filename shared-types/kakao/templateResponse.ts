export type TemplateResponse = {
    code: number;
    message: string;
    list: KakaoAlimTemplate[];
    info: Info;
};

export type KakaoAlimTemplate = {
    templtContent: string;
    templtName: string;
    templateType: string;
    templateEmType: string;
    templateExtra: string;
    templateAdvert: string;
    templtTitle: string;
    templtSubtitle: string;
    templtImageName: string;
    templtImageUrl: string;
    block: string;
    dormant: string;
    securityFlag: string;
    status: string;
    inspStatus: string;
    senderKey: string;
    buttons: Button[];
    cdate: string;
    templtCode: string;
    comments: Comment[];
};
// Template 타입의 기본값을 생성하는 함수
export const createEmptyTemplate = (): KakaoAlimTemplate => ({
    templtContent: '',
    templtName: '',
    templateType: '',
    templateEmType: '',
    templateExtra: '',
    templateAdvert: '',
    templtTitle: '',
    templtSubtitle: '',
    templtImageName: '',
    templtImageUrl: '',
    block: '',
    dormant: '',
    securityFlag: '',
    status: '',
    inspStatus: 'REG',
    senderKey: '',
    buttons: [],
    cdate: '',
    templtCode: '',
    comments: []
})


export type Button = {
    ordering: string;
    name: string;
    linkType: string;
    linkTypeName: string;
    linkMo: string;
    linkPc: string;
    linkIos: string;
    linkAnd: string;
};

export type Comment = {
    cdate: string;
    name: string;
    id: string;
    userName: string;
    commentContent: string;
    createdAt: string;
    status: string;
};

export type Info = {
    REG: number;
    REQ: number;
    APR: number;
    REJ: number;
};
