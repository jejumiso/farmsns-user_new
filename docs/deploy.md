## 📦 Nuxt 3 + Firebase Hosting 배포 가이드 (`deploy.md`)

### 프로젝트 준비

* Nuxt 3.17 이상
* 정적 사이트 (`ssr: false`)
* Firebase CLI 설치 필요

---
npm run generate && firebase deploy

### ✅ 1. Nuxt 설정 (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    serveStatic: true,
    output: {
      dir: 'dist',
      // ⚠️ publicDir 설정은 제거 또는 주석
    },
  },
})
```

---

### ✅ 2. Nuxt 정적 빌드

```bash
npm run generate
```

* `dist/public/index.html` 생성 확인

---

### ✅ 3. Firebase 초기화 (1개 필요)

```bash
firebase init
```

* Hosting only 선택
* `dist/public` 입력
* SPA? → Yes
* `index.html` 덮어쓰기? → No

---

### ✅ 4. `firebase.json` 파일 확인

```json
{
  "hosting": {
    "public": "dist/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### ✅ 5. 배포 실행

```bash
firebase deploy
```

---

### 🔄 캐시 및 반영 유의사항

* 반영까지 **수 초 질여**
* 새로고침(Ctrl+Shift+R)으로 캐시 무시 가능

---

### ✅ 구조 예시

```
project-root/
├── dist/
│   └── public/
│       ├── index.html
│       ├── _nuxt/
├── firebase.json
├── nuxt.config.ts
```

---

### 🔺 배포 완료

> 🎉 `firebase deploy` 후 CLI에서 배포 URL 확인
> 기본: `https://<your-project>.web.app/`

---

원하시면 404.html, 캐시 허드, GitHub Actions 자동 배포도 추가로 보여드립니다.
