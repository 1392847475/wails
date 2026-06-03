<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  // 模拟加载进度
  const interval = setInterval(() => {
    if (progress.value < 100) {
      // 随机增加 2% 到 15% 的进度
      const increment = Math.floor(Math.random() * 14) + 2
      progress.value = Math.min(progress.value + increment, 100)
    } else {
      clearInterval(interval)
      // 稍微延迟一下，让用户看清 100% 然后再隐藏
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 300)
})
</script>

<template>
  <div class="index-container">
    <!-- 初始化加载浮层 -->
    <div  class="loading-overlay" v-if="isLoading">
      <div class="title-container">
        <h1 class="system-title">欢迎进入KJ12 AI智能分站监测管控系统</h1>
      </div>
      <div class="progress-box">
        <p class="text-p">正在初始化，请稍后......</p>
      <div class="progress-container"> 
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }">
          </div>
        </div>
    
        <p class="loading-text" :style="{ left: progress + '%' }">{{ progress }}%</p>
      </div>
      </div>
      <div class="footer-container">
        <p class="company-text">创信数智（河南）科技有限公司</p>
      </div>
    </div>

    <!-- 系统主页面内容 -->
    <div v-else class="main-content">
      <h1 style="color: #fff; text-align: center; margin-top: 20vh;">系统主界面 (已加载完毕)</h1>
    </div>
  </div>
</template>

<style scoped>
.index-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #0b1426; /* 兜底深色背景 */
}

/* 浮层整体样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/bghome.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 18vh 0 6vh 0;
  box-sizing: border-box;
}

/* 标题部分 */
.title-container {
  text-align: center;
}

.system-title {
  font-size: 42px;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 4px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  margin: 0;
}
.progress-box {
  .text-p {
    text-align: center;
  }
}
/* 进度条部分 */
.progress-container {
  width: 35%;
  min-width: 400px;
  max-width: 600px;
  /* margin-top: -10vh; 微调垂直位置 */
  position: relative;
  display: flex;
  align-items: center;
}

.loading-text {
  position: absolute;
  top: 50%;
  transform: translate(15px, -50%);
  font-size: 16px;
  color: rgba(255, 255, 255, .8);
  letter-spacing: 2px;
  opacity: 0.9;
  white-space: nowrap;
  margin: 0;
  transition: left 0.3s ease-out;
}

.progress-bar-bg {
  flex: 1;
  height: 20px;
  background: rgba(13, 31, 61, 0.7);
  border: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 10px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.8), 0 0 10px rgba(24, 144, 255, 0.2);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #3a8ee6 50%, #7ec6ff 100%);
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.8);
  border-radius: 10px;
  transition: width 0.3s ease-out;
}

/* 底部公司名称 */
.footer-container {
  text-align: center;
}

.company-text {
  font-size: 16px;
  color: rgba(255, 255, 255, .4);
  letter-spacing: 2px;
  margin: 0;
}

/* 主内容区 */
.main-content {
  width: 100%;
  height: 100%;
}
</style>
