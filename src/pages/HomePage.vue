<template>
  <header class="welcome-header">
    <div class="content">
      <h1 class="title">{{ msg }}</h1>
      <p class="description">开启智能协作云图库之旅，畅享便捷的图片管理与协作体验。</p>
    </div>
  </header>
</template>

<script setup lang="ts">
const msg = "欢迎使用智能协作云图库平台";
</script>

<style scoped>
.welcome-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height  : 100vh;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
}

.content {
  text-align: center;
  color: #333;
  z-index: 1;
  animation: fadeInUp 1s ease;
}

.title {
  font-size: 48px;
  font-weight: 300; /* 调整字体粗细 */
  margin-bottom: 20px;
  color: #555; /* 调整字体颜色 */
}

.description {
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 30px;
  opacity: 0.8;
  color: #666; /*调整字体颜色 */
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-header::before {
  content: '';
  position: absolute;
  top  : 0;
  left : 0;
  width : 100%;
  height : 100%;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
