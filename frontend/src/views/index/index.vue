
<template>
  <div class="index-container">
    <!-- 初始化加载浮层 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="title-container">
        <h1 class="system-title">欢迎进入KJ12 AI智能分站监测管控系统</h1>
      </div>
      <div class="progress-box">
        <p class="text-p">正在初始化，请稍后......</p>
        <div class="progress-container"> 
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
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
      <!-- 顶部 Header -->
      <header class="header">
        <div class="logo">
          <img src="../../assets/img/logo.png" alt="logo" />
        </div>
        
        <div class="tabs-container">
          <div 
            v-for="(tab, idx) in tabs" 
            :key="idx"
            class="tab-item"
            :class="{ active: activeTab === idx, focused: localZone === 'tabs' && activeTab === idx }"
          >
            {{ tab }}
          </div>
        </div>

        <div class="status-bar">
          <span class="time">{{ currentTime }}</span>
          <img src="../../assets/img/wllj.png" alt="wifi" class="icon" />
          <img src="../../assets/img/lykq.png" alt="bluetooth" class="icon" />
          <div class="battery-container">
            <div class="battery-icon" :class="batteryClass">
              <div class="battery-level" :style="{ width: batteryLevel + '%' }"></div>
            </div>
            <span class="battery-text">{{ batteryLevel }}%</span>
          </div>
        </div>
      </header>

      <!-- 预警消息跑马灯 -->
      <div class="marquee-bar">
        <div class="marquee-content">
          【预警消息】：1、当前趋势异常明显，请注意加大巷道通风力度；2、CH₄测点离线时长过长，请排查传感器接头是否中断
        </div>
      </div>

      <!-- 中间主体区域 -->
      <div class="dashboard-body">
        <!-- 左侧列 -->
        <div class="col-left">
          <!-- 总体态势评估 -->
          <div class="card card-trend" :class="{ focused: localZone === 'left-top' }">
            <div class="card-header">
              <span class="card-title">总体态势评估</span>
              <div class="score-box">
                <span class="score-val">55.5</span>
                <span class="score-unit">分</span>
                <span class="score-tag safe">安全</span>
              </div>
            </div>
            <div class="chart-wrapper">
              <span class="y-unit">分</span>
              <TrendChart :data="trendData" />
            </div>
            <div class="trend-alert">
              <span class="alert-dot"></span>
              <span class="alert-text">11:30 态势评分下降，请关注一氧化碳指标</span>
            </div>
          </div>

          <!-- 环境数据 -->
          <div class="card card-env" :class="{ focused: localZone === 'left-bottom' }">
            <div class="env-item">
              <div class="env-header">
                <img :src="getImg('icon-temperature')" class="env-icon" />
                <div class="env-info">
                  <div class="env-name">温差</div>
                  <div class="env-val">0.5 <span class="unit">℃</span></div>
                </div>
              </div>
              <div class="env-details">
                <div class="detail-row"><span>密闭温度</span><span>24.0</span></div>
                <div class="detail-row"><span>环境温度</span><span>23.5</span></div>
              </div>
            </div>
            
            <div class="env-divider"></div>

            <div class="env-item">
              <div class="env-header">
                <img :src="getImg('icon-pressure')" class="env-icon" />
                <div class="env-info">
                  <div class="env-name">压强差</div>
                  <div class="env-val">199.5 <span class="unit">kPa</span></div>
                </div>
              </div>
              <div class="env-details">
                <div class="detail-row"><span>密闭压强</span><span>98.5</span></div>
                <div class="detail-row"><span>环境压强</span><span>-101.0</span></div>
              </div>
            </div>

            <div class="env-divider"></div>

            <div class="env-item">
              <div class="env-header">
                <img :src="getImg('icon-CH4')" class="env-icon" />
                <div class="env-info">
                  <div class="env-name">甲烷</div>
                  <div class="env-val">0~0.8 <span class="unit">%</span></div>
                </div>
              </div>
              <div class="env-details">
                <div class="detail-row"><span>密闭甲烷</span><span>0.42</span></div>
                <div class="detail-row"><span>环境甲烷</span><span>0.20</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧网格列 -->
        <div class="col-right">
          <div 
            v-for="(item, idx) in gasList" 
            :key="item.id"
            class="card card-gas"
            :class="[item.status, { focused: localZone === 'right-grid' && focusIndex === idx }]"
          >
            <div class="gas-header">
              <div class="gas-title">
                <img :src="item.icon" class="gas-icon" />
                <span>{{ item.name }}</span>
              </div>
              <div class="gas-status" :style="{ color: getStatusColor(item.status) }">
                <span class="status-dot" :style="{ backgroundColor: getStatusColor(item.status) }"></span>
                {{ getStatusText(item.status) }}
              </div>
            </div>
            
            <div class="gas-body">
              <div class="gas-val-box">
                <span class="gas-val">{{ item.value }}</span>
                <span class="gas-unit">{{ item.unit }}</span>
              </div>
              <div class="gas-chart-box">
                <GasChart :data="item.data" :color="getStatusColor(item.status)" />
              </div>
            </div>

            <div class="gas-footer">
              更新: {{ item.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部接口状态 -->
      <footer class="footer-ports">
        <div 
          v-for="(port, idx) in ports" 
          :key="port"
          class="port-item"
          :class="{ focused: localZone === 'ports' && focusIndex === idx }"
        >
          <img :src="getImg(`port${port > 3 ? 3 : port}`)" class="port-icon" />
          <span class="port-num">{{ port }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import GasChart from './components/GasChart.vue'
import TrendChart from './components/TrendChart.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(true)
const progress = ref(0)

// 顶部状态栏
const currentTime = ref('')
let timeInterval: any
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

const batteryLevel = ref(90)
const batteryClass = computed(() => {
  if (batteryLevel.value <= 20) return 'red'
  if (batteryLevel.value <= 50) return 'yellow'
  return 'green'
})

// 顶部 Tabs
const tabs = ['00001工作面监测', '00002工作面监测']
const activeTab = ref(0)

// 焦点控制
const localZone = ref('tabs') // 'tabs', 'left-top', 'left-bottom', 'right-grid', 'ports'
const focusIndex = ref(0) // 右侧网格索引或底部端口索引

// 模拟气体数据
const getImg = (name: string) => new URL(`../../assets/img/home/${name}.png`, import.meta.url).href
const getBaseImg = (name: string) => new URL(`../../assets/img/${name}.png`, import.meta.url).href

// 密集一点的折线图数据
const generateDenseData = (base: number, variance: number, points: number = 20) => {
  return Array.from({ length: points }, () => base + (Math.random() - 0.5) * variance)
}

const gasList = ref([
  { id: 'CH4', name: '甲烷', icon: getImg('CH4'), value: 0.42, unit: '%', status: 'normal', time: '4/28 11:30:00', data: generateDenseData(20, 15) },
  { id: 'CO2', name: '二氧化碳', icon: getImg('CO2'), value: 0.38, unit: '%', status: 'offline', time: '4/28 11:30:00', data: generateDenseData(15, 10) },
  { id: 'CO', name: '一氧化碳', icon: getImg('CO'), value: 7, unit: 'ppm', status: 'warning', time: '4/28 11:30:00', data: generateDenseData(10, 8) },
  { id: 'O2', name: '氧气', icon: getImg('O2'), value: 20.3, unit: '%', status: 'normal', time: '4/28 11:30:00', data: generateDenseData(20.3, 0.5) },
  { id: 'C2H2', name: '乙炔', icon: getImg('C2H2'), value: 0, unit: 'ppm', status: 'normal', time: '4/28 11:30:00', data: Array(20).fill(0) },
  { id: 'C2H4', name: '乙烯', icon: getImg('C2H4'), value: 0, unit: 'ppm', status: 'normal', time: '4/28 11:30:00', data: Array(20).fill(0) }
])

const getStatusColor = (status: string) => {
  if (status === 'normal') return 'rgba(45, 220, 127, 1)'
  if (status === 'warning') return 'rgba(255, 152, 0, 1)'
  if (status === 'danger') return 'rgba(244, 67, 54, 1)'
  return 'rgba(143, 160, 181, 1)'
}

const getStatusText = (status: string) => {
  if (status === 'normal') return '正常'
  if (status === 'warning') return '预警'
  if (status === 'danger') return '报警'
  return '离线'
}

// 模拟趋势数据
const trendData = ref([
  { time: '08:00', value: 90 }, { time: '08:15', value: 85 }, { time: '08:30', value: 80 },
  { time: '08:45', value: 70 }, { time: '09:00', value: 75 }, { time: '09:15', value: 80 },
  { time: '09:30', value: 85 }, { time: '09:45', value: 80 }, { time: '10:00', value: 85 },
  { time: '10:15', value: 80 }, { time: '10:30', value: 82 }, { time: '10:45', value: 80 },
  { time: '11:00', value: 75 }, { time: '11:15', value: 65 }, { time: '11:30', value: 45 }
])

const ports = [1, 2, 3, 4]

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (isLoading.value) return
  
  if (e.key === 'F6') {
    e.preventDefault()
    router.push('/settings')
    return
  }

  // 简单的上下左右导航逻辑
  if (localZone.value === 'tabs') {
    if (e.key === 'ArrowRight') {
      if (activeTab.value < tabs.length - 1) activeTab.value++
    } else if (e.key === 'ArrowLeft') {
      if (activeTab.value > 0) activeTab.value--
    } else if (e.key === 'ArrowDown') {
      localZone.value = 'left-top'
    }
  } else if (localZone.value === 'left-top') {
    if (e.key === 'ArrowUp') localZone.value = 'tabs'
    else if (e.key === 'ArrowDown') localZone.value = 'left-bottom'
    else if (e.key === 'ArrowRight') {
      localZone.value = 'right-grid'
      focusIndex.value = 0
    }
  } else if (localZone.value === 'left-bottom') {
    if (e.key === 'ArrowUp') localZone.value = 'left-top'
    else if (e.key === 'ArrowDown') {
      localZone.value = 'ports'
      focusIndex.value = 0
    }
    else if (e.key === 'ArrowRight') {
      localZone.value = 'right-grid'
      focusIndex.value = 4
    }
  } else if (localZone.value === 'right-grid') {
    if (e.key === 'ArrowUp') {
      if (focusIndex.value >= 2) focusIndex.value -= 2
      else localZone.value = 'tabs'
    } else if (e.key === 'ArrowDown') {
      if (focusIndex.value < 4) focusIndex.value += 2
      else {
        localZone.value = 'ports'
        focusIndex.value = 0
      }
    } else if (e.key === 'ArrowLeft') {
      if (focusIndex.value % 2 !== 0) focusIndex.value--
      else localZone.value = focusIndex.value < 4 ? 'left-top' : 'left-bottom'
    } else if (e.key === 'ArrowRight') {
      if (focusIndex.value % 2 === 0 && focusIndex.value + 1 < gasList.value.length) {
        focusIndex.value++
      }
    }
  } else if (localZone.value === 'ports') {
    if (e.key === 'ArrowUp') {
      localZone.value = 'left-bottom'
    } else if (e.key === 'ArrowLeft') {
      if (focusIndex.value > 0) focusIndex.value--
    } else if (e.key === 'ArrowRight') {
      if (focusIndex.value < ports.length - 1) focusIndex.value++
    }
  }
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  window.addEventListener('keydown', handleKeyDown)
  
  // 模拟加载进度
  const interval = setInterval(() => {
    if (progress.value < 100) {
      const increment = Math.floor(Math.random() * 14) + 2
      progress.value = Math.min(progress.value + increment, 100)
    } else {
      clearInterval(interval)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 150)
})

onUnmounted(() => {
  clearInterval(timeInterval)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.index-container {
  width: 1280px;
  height: 800px;
  overflow: hidden;
  background-color: #0b1526;
  margin: 0 auto;
  color: #fff;
  font-family: sans-serif;
}

/* Loading 浮层 */
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
.title-container { text-align: center; }
.system-title {
  font-size: 42px;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 4px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  margin: 0;
}
.progress-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-box .text-p { text-align: center; color: #fff; font-size: 18px; margin-bottom: 20px;}
.progress-container {
  width: 35%;
  min-width: 400px;
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
  margin: 0;
  transition: left 0.3s ease-out;
}
.progress-bar-bg {
  flex: 1;
  height: 20px;
  background: rgba(13, 31, 61, 0.7);
  border: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #3a8ee6 50%, #7ec6ff 100%);
  border-radius: 10px;
  transition: width 0.3s ease-out;
}
.footer-container { text-align: center; }
.company-text { font-size: 16px; color: rgba(255, 255, 255, .4); margin: 0; }

/* 主界面 */
.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  padding: 0 24px;
  background-color: rgba(33, 51, 70, 1);
}
.logo img { height: 36px; }
.tabs-container {
  display: flex;
  gap: 40px;
  height: 100%;
}
.tab-item {
  font-size: 26px;
  color: #8fa0b5;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: all 0.2s;
  outline: 2px solid transparent;
  outline-offset: -2px;
  font-style: italic; /* 斜体 */
  font-weight: 900; /* 加粗 */
  position: relative;
}
.tab-item.active {
  color: #fff;
  background: linear-gradient(90deg, rgba(0, 188, 212, 0) 0%, rgba(55, 131, 238, 0.50) 50%, rgba(0, 188, 212, 0) 100%);
}
/* .tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(0, 188, 212, 0) 0%, rgba(0, 188, 212, 1) 50%, rgba(0, 188, 212, 0) 100%);
} */
.tab-item.focused {
  outline-color: #00bcd4;
  background-color: rgba(0, 188, 212, 0.1);
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 16px;
  color: #a4b4c4;
}
.icon { width: 24px; height: 24px; }
.battery-container { display: flex; align-items: center; gap: 8px; }
.battery-icon {
  width: 32px; height: 16px;
  border: 1px solid #666; border-radius: 2px;
  padding: 1px; position: relative;
}
.battery-icon::after {
  content: ''; position: absolute; right: -4px; top: 3px;
  width: 2px; height: 8px; background: #666; border-radius: 0 2px 2px 0;
}
.battery-level { height: 100%; border-radius: 1px; }
.battery-icon.green .battery-level { background-color: #4caf50; }
.battery-icon.yellow .battery-level { background-color: #ffeb3b; }
.battery-icon.red .battery-level { background-color: #f44336; }

/* 预警消息 */
.marquee-bar {
  position: absolute;
  top: 68px; /* 紧贴在高度为72px的header下方 */
  left: 0;
  right: 0;
  width: 1280px;
  z-index: 10;
  height: 40px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.05); /* 半透明底色，或者可以跟设计图再微调 */
  display: flex;
  align-items: center;
  overflow: hidden;
  border-top: 1px solid rgba(249, 205, 28, 0.2);
  border-bottom: 1px solid rgba(249, 205, 28, 0.2);
  box-shadow: inset 0 0px 20px 8px rgba(249, 205, 28, 0.5);
  padding: 0 24px;
  box-sizing: border-box;
}
.marquee-content {
  color: rgba(249, 205, 28, 1);
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Dashboard Body */
.dashboard-body {
  flex: 1;
  padding: 32px 32px;
  display: flex;
  gap: 24px;
  background-color: rgba(15, 35, 55, 1);
}

.card {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 2px solid transparent;
  box-sizing: border-box;
}
.card.focused {
  border-color: #00bcd4;
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
}

/* Left Column */
.col-left {
  width: 576px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-trend {
  width: 576px;
  height: 404px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.card-title {
  font-size: 22px;
  color: #fff;
}
.score-box {
  display: flex;
  align-items: baseline;
  gap: 5px;
}
.score-val { font-size: 36px; font-weight: bold; color: #fff; }
.score-unit { font-size: 16px; color: #8fa0b5; }
.score-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 10px;
}
.score-tag.safe { background-color: #4caf50; color: #fff; }

.chart-wrapper {
  flex: 1;
  position: relative;
  margin-top: 10px;
  width: 100%;
}
.y-unit {
  position: absolute;
  top: -10px;
  left: 10px;
  font-size: 14px;
  color: #8fa0b5;
}
.trend-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 6px;
  margin-top: 15px;
}
.alert-dot {
  width: 8px; height: 8px;
  background-color: #ff9800;
  border-radius: 50%;
}
.alert-text {
  color: #8fa0b5;
  font-size: 14px;
}

.card-env {
  width: 576px;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.env-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.env-divider {
  width: 1px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.1);
}
.env-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.env-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.env-name {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: normal;
}
.env-val {
  font-size: 24px;
  font-weight: normal;
  color: rgba(255, 255, 255, 1);
}
.env-val .unit {
  font-size: 16px;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.65);
}
.env-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 16px;
}
.detail-row span:first-child { color: rgba(255, 255, 255, 0.65); }
.detail-row span:last-child { color: rgba(255, 255, 255, 1); font-size: 22px; }

/* Right Column */
.col-right {
  width: 612px; /* 296 * 2 + 20 */
  display: grid;
  grid-template-columns: repeat(2, 296px);
  grid-template-rows: repeat(3, 190px);
  gap: 24px;
}

.card-gas {
  width: 296px;
  height: 190px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* 状态边框变色 */
.card-gas.warning { border-color: rgba(255, 152, 0, 0.5); 
box-shadow: inset 0 0px 10px 2px rgba(255, 152, 0, 0.5);}
.card-gas.danger { border-color: rgba(244, 67, 54, 0.5); }
.card-gas.focused {
  border-color: #00bcd4; /* 焦点优先 */
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
}

.gas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gas-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #8fa0b5;
}
.gas-icon {
  height: 20px;
  object-fit: contain;
}
.gas-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}

.gas-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
}
.gas-val-box {
  display: flex;
  align-items: baseline;
  gap: 5px;
}
.gas-val {
  font-size: 46px;
  font-weight: bold;
  color: #fff;
  line-height: 1;
}
.gas-unit {
  font-size: 18px;
  color: #8fa0b5;
}
.gas-chart-box {
  width: 100px;
  height: 50px;
}

.gas-footer {
  font-size: 14px;
  color: #66788f;
  margin-top: 10px;
}

/* Footer Ports */
.footer-ports {
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 20px;
  background-color: rgba(255, 255, 255, 0.1);
}
.port-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 2px solid transparent;
}
.port-item.focused {
  border-color: #00bcd4;
  background-color: rgba(0, 188, 212, 0.1);
}
.port-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.port-num {
  font-size: 18px;
  color: #8fa0b5;
}
</style>
