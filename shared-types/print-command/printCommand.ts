import type { Timestamp } from "@/shared/firebase/firebaseTypes"

// shared-types/print-command/printCommand.ts
export interface PrintCommand {
  id: string
  name: string
  template: string     // 텍스트 기반 명령어 시퀀스
  dateCreated: Timestamp
}
