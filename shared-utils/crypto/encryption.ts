import CryptoJS from 'crypto-js'
import { toBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * 고정 IV를 외부에서 전달받아 암호화
 * @param data - 암호화할 평문
 * @param ivStr - 외부에서 전달받은 16바이트 IV 문자열
 * @returns URL-safe Base64로 인코딩된 암호문
 */
export function encryptWithIv(data: string, ivStr: string): string {
    const key = CryptoJS.enc.Utf8.parse(getEncryptionKey())
    const iv = CryptoJS.enc.Utf8.parse(ivStr)
  
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
  
    const base64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    return toBase64UrlSafe(base64)
  }