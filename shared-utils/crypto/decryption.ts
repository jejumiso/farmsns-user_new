import CryptoJS from 'crypto-js'
import { fromBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * @param encryptedText URL-safe base64로 인코딩된 암호화 문자열
 * @param ivString base64 형식의 IV 문자열
 * @returns 복호화된 평문 문자열
 */
export function decryptWithIv(encryptedText: string, ivString: string): string {
  if (!encryptedText || !ivString) return ''

  try {
    const key = CryptoJS.enc.Utf8.parse(getEncryptionKey())

    // 📦 복호화 대상: 암호화된 본문
    const base64Ciphertext = fromBase64UrlSafe(encryptedText)
    const ciphertextWA = CryptoJS.enc.Base64.parse(base64Ciphertext)

    // 🔓 복호화용 IV
    const iv = CryptoJS.enc.Base64.parse(ivString)

    // ✅ CipherParams 객체 생성
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertextWA,
    })

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('❌ 복호화 실패:', error)
    return ''
  }
}
