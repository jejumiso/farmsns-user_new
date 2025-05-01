// utils/hash.ts
import CryptoJS from 'crypto-js'

export function hashString(input: string): string {
  const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Base64)
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
