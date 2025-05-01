// // 📁 services/payment/saveRegisteredCard.ts

// import { db } from '@/firebaseAdmin'
// import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'
// import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'

// interface SaveRegisteredCardInput {
//   uid: string
//   companyId: string
//   cardId: string // hashedCardNumber
//   profileCardData: Partial<CustomerProfile['cards'][number]> & { passwordHash: string }
//   activityCardData: Partial<CustomerCompanyActivity['bids'][string]>
// }

// export async function saveRegisteredCard(input: SaveRegisteredCardInput) {
//   const { uid, companyId, cardId, profileCardData, activityCardData } = input

//   const userRef = db.collection('v2_users').doc(uid)
//   const companyUserRef = db
//     .collection('v2_companies')
//     .doc(companyId)
//     .collection('v2_users')
//     .doc(uid)

//   await db.runTransaction(async (tx) => {
//     const userSnap = await tx.get(userRef)
//     const companyUserSnap = await tx.get(companyUserRef)

//     const profileData = userSnap.exists ? userSnap.data() || {} : {}
//     const companyData = companyUserSnap.exists ? companyUserSnap.data() || {} : {}

//     // 1. CustomerProfile 카드 저장
//     const profileCards = profileData.cards || {}
//     profileCards[cardId] = {
//       ...profileCardData,
//     }
//     tx.set(userRef, { cards: profileCards }, { merge: true })

//     // 2. CustomerCompanyActivity bid 저장
//     const activityBids = companyData.bids || {}
//     activityBids[cardId] = {
//       ...activityCardData,
//     }
//     tx.set(companyUserRef, { bids: activityBids }, { merge: true })
//   })
// }
