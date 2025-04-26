import CryptoJS from 'crypto-js'
import { toBase64UrlSafe, fromBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * 고정 IV를 외부에서 전달받아 암호화
 * @param data - 암호화할 평문
 * @param ivBase64 - URL-safe Base64로 인코딩된 16바이트 IV 문자열
 * @returns URL-safe Base64로 인코딩된 암호문
 */
export function encryptWithIv(data: string, ivBase64: string): string {
  const keyWA = CryptoJS.enc.Utf8.parse(getEncryptionKey())
  const ivWA  = CryptoJS.enc.Base64.parse(ivBase64)

  const encrypted = CryptoJS.AES.encrypt(data, keyWA, {
    iv: ivWA,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  // ciphertext → Base64 → URL-safe
  const base64Ct = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  return toBase64UrlSafe(base64Ct)
}
