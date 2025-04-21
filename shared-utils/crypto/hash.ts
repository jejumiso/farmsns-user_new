import CryptoJS from 'crypto-js'

/**
 * 문자열을 SHA-256 해시 처리하고, Base64 URL-safe 형식으로 반환합니다.
 * @param input 해시할 문자열
 * @returns 해시된 문자열 (URL-safe Base64)
 */
export function hashString(input: string): string {
  const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Base64)
  return hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
