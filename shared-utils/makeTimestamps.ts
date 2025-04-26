import { Timestamp } from "@/shared/firebase/firebaseTypes";

export function makeTimestamps() {
  const nowTs = Timestamp.now();
  const d = nowTs.toDate();
  const yyyy = d.getFullYear();               // e.g. 2025
  const MM   = d.getMonth() + 1;               // 1월=0 이니 +1 (1..12)
  const dd   = d.getDate();                    // 1..31

  return {
    dateCreated: nowTs,
    dateModified: nowTs,
    dateCreatedyyyy: yyyy,                     // 2025
    dateCreatedyyyyMM: yyyy * 100 + MM,        // 202501..202512
    dateCreatedyyyyMMdd: yyyy * 10000 + MM * 100 + dd, // 20250101..20251231
  };
}

