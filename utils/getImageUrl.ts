import { STORAGE_BASE_URL } from "~/shared-constants/constants"

export const getImageUrl = (fileName?: string) => {
  return fileName?.trim()
    ? `${STORAGE_BASE_URL}/${fileName}`
    : '/assets/imgs/no-image.png' // ✅ public/imgs/no-image.png 에 위치해야 합니다
}
