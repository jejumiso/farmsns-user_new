<template>
  <div class="welcome-page">
    <section class="intro-section">
      <h2 class="section-title">회사 소개</h2>
      <p class="section-description">
        FarmSNS는 농업 관련 SNS 플랫폼으로, 농업인과 소비자를 연결합니다.
      </p>
    </section>
    <section class="navigation-section">
      <h2 class="section-title">페이지 이동</h2>
      <button
        @click="navigate"
        class="navigation-button"
      >
        {{ buttonText }}
      </button>
    </section>
  </div>
</template>

<script setup>
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'; // authStore 가져오기
import { navigateTo } from '#app'; // Nuxt의 navigateTo 함수 가져오기

const authStore = useUserAuthStore(); // authStore 인스턴스 생성

const buttonText = computed(() =>
  authStore.user ? '대시보드로 이동' : '로그인 페이지로 이동'
);

function navigate() {
  if (authStore.user) {
    navigateTo('/dashboard'); // 로그인된 경우 대시보드로 이동
  } else {
    navigateTo('/login'); // 로그인되지 않은 경우 로그인 페이지로 이동
  }
}
</script>

<style scoped>
/* 전체 화면 배경 설정 */
.welcome-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 화면 전체 높이 */
  padding: 20px;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #007bff, #0056b3); /* 그라데이션 배경 */
  color: #ffffff;
}

.intro-section,
.navigation-section {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* 반투명 흰색 배경 */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333333;
}

.section-description {
  font-size: 1rem;
  color: #555555;
}

.navigation-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.navigation-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* 버튼 확대 효과 */
}
</style>