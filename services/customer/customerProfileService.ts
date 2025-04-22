// src/services/customer/customerProfileService.ts
import { createDocumentService } from '@/services/common/documentService'
import type { CustomerProfile } from '@/shared-types/customer-profile/customerProfile'

export const customerProfileService = createDocumentService<CustomerProfile>('user', 'guest')

export async function saveCustomerProfile(profile: CustomerProfile, companyId: string) {
  return await customerProfileService.save(companyId, profile)
}
