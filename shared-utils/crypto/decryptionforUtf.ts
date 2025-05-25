import CryptoJS from 'crypto-js'
import { fromBase64UrlSafe, toBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * @param encryptedUrlSafe   URL-safe Base64로 인코딩된 암호문
 * @param ivUtf8           표준 Base64로 인코딩된 IV
 */


//구버전 리다이렉트할때 복호화 전용임
//function서버에만 필요하지만 모드 프로젝트에 일단은 추가하겠음.
//구버전 리다이렉안하게 되면 없애도 됨.
//1년 정도 유지 예정
export function decryptionforUtf(
  encryptedUrlSafe: string,
  ivUtf8: string
): string {
  // console.log('🔍 decryptWithIv 호출');
  // console.log('encryptedUrlSafe:', encryptedUrlSafe);
  // console.log('ivBase64:', ivBase64);

  try {
    const base64Cipher = fromBase64UrlSafe(encryptedUrlSafe);
    const ciphertextWA = CryptoJS.enc.Base64.parse(base64Cipher);

    const ivWA = CryptoJS.enc.Utf8.parse(ivUtf8); // ✅ 핵심 수정

    const rawKey = getEncryptionKey();
    const keyWA = CryptoJS.enc.Utf8.parse(rawKey);

    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ciphertextWA });
    const decryptedWA = CryptoJS.AES.decrypt(cipherParams, keyWA, {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decryptedWA.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('❌ decryptWithIv 중 에러 발생:', err);
    return '';
  }
}