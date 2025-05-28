import type { BusinessHours } from '@/shared-types/company/company'

export function getNextOpenMessage(businessHours: BusinessHours): string {
  if (!businessHours) return '영업 시간이 설정되지 않았습니다.'

  const now = new Date()
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  type DayKey = typeof dayMap[number]

  const todayIndex = now.getDay()

  for (let i = 1; i <= 7; i++) {
    const nextIndex = (todayIndex + i) % 7
    const nextKey = dayMap[nextIndex] as DayKey
    const day = businessHours.weeklyHours[nextKey]

    if (day?.isOpen) {
      const h = String(day.openHour).padStart(2, '0')
      const m = String(day.openMinute).padStart(2, '0')
      const h2 = String(day.closeHour).padStart(2, '0')
      const m2 = String(day.closeMinute).padStart(2, '0')
      const label = i === 1 ? '내일' : `${['일', '월', '화', '수', '목', '금', '토'][nextIndex]}요일`
      return `⛔️ 영업 종료. <strong class="text-green-600">${label} ${h}시${m}분~${h2}시${m2}분</strong>에 다시 열어요 😊`.replaceAll('00분','')
    }
  }

  return '⛔️ 현재 영업이 종료되었으며 예정된 오픈 시간이 없습니다.'
}
