// 일반 Base64 → URL-safe Base64
export function toBase64UrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// URL-safe Base64 → 일반 Base64
export function fromBase64UrlSafe(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  return base64
}
