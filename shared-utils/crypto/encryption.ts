import CryptoJS from 'crypto-js'
import { toBase64UrlSafe, fromBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * 고정 IV를 외부에서 전달받아 암호화
 * @param data - 암호화할 평문
 * @param ivStr - URL-safe Base64로 인코딩된 16바이트 IV 문자열
 * @returns URL-safe Base64로 인코딩된 암호문
 */
export function encryptWithIv(data: string, ivStr: string): string {
  const keyWA = CryptoJS.enc.Utf8.parse(getEncryptionKey())

  // URL-safe → 표준 Base64 → WordArray
  const base64Iv = fromBase64UrlSafe(ivStr)
  const ivWA     = CryptoJS.enc.Base64.parse(base64Iv)

  // 암호화
  const encrypted = CryptoJS.AES.encrypt(data, keyWA, {
    iv: ivWA,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // ciphertext만 Base64로 뽑아서 URL‑safe로 변환
  const base64Ct = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  return toBase64UrlSafe(base64Ct)
}
