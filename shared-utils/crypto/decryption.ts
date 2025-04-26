import CryptoJS from 'crypto-js'
import { fromBase64UrlSafe, toBase64UrlSafe } from '../base64/utils'
import { getEncryptionKey } from '@/env'

/**
 * @param encryptedUrlSafe   URL-safe Base64로 인코딩된 암호문
 * @param ivBase64           표준 Base64로 인코딩된 IV
 */
export function decryptWithIv(
  encryptedUrlSafe: string,
  ivBase64: string
): string {
  console.log('🔍 decryptWithIv 호출');
  console.log('encryptedUrlSafe:', encryptedUrlSafe);
  console.log('ivBase64:', ivBase64);

  try {
    // 1) URL-safe → 표준 Base64
    const base64Cipher = fromBase64UrlSafe(encryptedUrlSafe);
    console.log('1) base64Cipher:', base64Cipher);

    // 2) WordArray로 파싱
    const ciphertextWA = CryptoJS.enc.Base64.parse(base64Cipher);
    console.log('2) ciphertextWA (base64):', ciphertextWA.toString(CryptoJS.enc.Base64));
    
    const ivWA = CryptoJS.enc.Base64.parse(ivBase64);
    console.log('3) ivWA (base64):', ivWA.toString(CryptoJS.enc.Base64));

    // 3) 키 준비
    const rawKey = getEncryptionKey();
    console.log('4) getEncryptionKey():', rawKey);
    const keyWA = CryptoJS.enc.Utf8.parse(rawKey);
    console.log('5) keyWA (hex):', keyWA.toString());

    // 4) 복호화
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ciphertextWA });
    const decryptedWA = CryptoJS.AES.decrypt(cipherParams, keyWA, {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log('6) decryptedWA.sigBytes:', decryptedWA.sigBytes);
    const decryptedText = decryptedWA.toString(CryptoJS.enc.Utf8);
    console.log('7) decryptedText:', decryptedText);

    return decryptedText;
  } catch (err) {
    console.error('❌ decryptWithIv 중 에러 발생:', err);
    return '';
  }
}