import { useUserAuthStore } from "~/stores/userAuth/useUserAuthStore";

export function getCompanyId(): string | null {
    return useUserAuthStore().customerCompanyActivity?.id || null
  }
  