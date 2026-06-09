<!-- 设置 -->
<template>
  <div class="settings-page">
    <header class="settings-header">
      <div class="logo">
        <img src="../../assets/img/logo.png" alt="logo" />
      </div>
      <div class="status-bar">
        <span class="time">{{ currentTime }}</span>
        <img :src="wifiIcon" alt="wifi" class="icon" />
        <img :src="btIcon" alt="bluetooth" class="icon" />
        <div class="battery-container">
          <div class="battery-icon" :class="batteryClass">
            <div class="battery-level" :style="{ width: batteryLevel + '%' }"></div>
          </div>
          <img v-if="isCharging" src="../../assets/img/cdz.png" class="charging-icon" />
          <span class="battery-text">{{ batteryLevel }}%</span>
        </div>
      </div>  
    </header>
    
    <div class="settings-body">
      <div class="settings-menu">
        <div 
          v-for="(item, index) in menus" 
          :key="item.id"
          class="menu-item"
          :class="{ active: currentMenuIndex === index, focused: activeZone === 'menu' && menuIndex === index }"
        >
          <img :src="getMenuIcon(item.iconBase, activeZone === 'menu' && menuIndex === index)" />
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="settings-content" :class="{ focused: activeZone === 'content' }">
        <component 
          :is="currentMenuComponent" 
          ref="contentComponent"
          :is-active="activeZone === 'content'" 
          @popup-open="handlePopupOpen"
          @popup-close="handlePopupClose"
          @back="handleBackToMenu"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, markRaw } from 'vue'
import BasicInfo from './components/BasicInfo.vue'
import NetworkConfig from './components/NetworkConfig.vue'
import SystemUpgrade from './components/SystemUpgrade.vue'
import FactoryReset from './components/FactoryReset.vue'
import DataExport from './components/DataExport.vue'
import VoiceDispatch from './components/VoiceDispatch.vue'

// Time logic
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

// Status logic
const wifiStatus = ref('normal') // 'none', 'connecting', 'normal'
const getImageUrl = (name: string) => {
  return new URL(`../../assets/img/${name}`, import.meta.url).href
}
const wifiIcon = computed(() => {
  if (wifiStatus.value === 'none') return getImageUrl('wwl.png')
  if (wifiStatus.value === 'connecting') return getImageUrl('wllj.png')
  return getImageUrl('wllj.png')
})

const btStatus = ref('on')
const btIcon = computed(() => {
  if (btStatus.value === 'on') return getImageUrl('lykq.png')
  return getImageUrl('lygb.png')
})

const batteryLevel = ref(90)
const isCharging = ref(false)
const batteryClass = computed(() => {
  if (batteryLevel.value <= 20) return 'red'
  if (batteryLevel.value <= 50) return 'yellow'
  return 'green'
})

// Menus
const menus = [
  { id: 'basic', label: '基本信息', iconBase: 'jbxx', component: markRaw(BasicInfo) },
  { id: 'network', label: '网络配置', iconBase: 'wlpz', component: markRaw(NetworkConfig) },
  { id: 'upgrade', label: '系统升级', iconBase: 'xtsj', component: markRaw(SystemUpgrade) },
  { id: 'export', label: '数据导出', iconBase: 'sjdc', component: markRaw(DataExport) },
  { id: 'check', label: '设备自检', iconBase: 'sbzj', component: markRaw(BasicInfo) },
  { id: 'topology', label: '网络拓扑', iconBase: 'wltb', component: markRaw(BasicInfo) },
  { id: 'voice', label: '语音调度', iconBase: 'yydd', component: markRaw(VoiceDispatch) },
  { id: 'reset', label: '恢复出厂', iconBase: 'hfcc', component: markRaw(FactoryReset) },
]

const getMenuIcon = (base: string, isFocused: boolean) => {
  const suffix = isFocused ? '2' : '1'
  return getImageUrl(`icon-${base}${suffix}.png`)
}

// Navigation State
type Zone = 'menu' | 'content' | 'popup'
const activeZone = ref<Zone>('menu')
const menuIndex = ref(0)
const currentMenuIndex = ref(0) 

const contentComponent = ref<any>(null)

const currentMenuComponent = computed(() => menus[currentMenuIndex.value].component)

provide('activeZone', activeZone)

const handlePopupOpen = () => {
  activeZone.value = 'popup'
}

const handlePopupClose = () => {
  activeZone.value = 'content'
}

const handleBackToMenu = () => {
  activeZone.value = 'menu'
  menuIndex.value = currentMenuIndex.value
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'F6') return
  
  if (activeZone.value === 'menu') {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      menuIndex.value = (menuIndex.value - 1 + menus.length) % menus.length
      currentMenuIndex.value = menuIndex.value
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      menuIndex.value = (menuIndex.value + 1) % menus.length
      currentMenuIndex.value = menuIndex.value
    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault()
      currentMenuIndex.value = menuIndex.value
      activeZone.value = 'content'
      
      // 添加延时或nextTick确保组件渲染完成并暴露方法
      setTimeout(() => {
        if (contentComponent.value && typeof contentComponent.value.handleKeyDown === 'function') {
          // 初始化子组件的焦点
        }
      }, 0)
    }
  } else if (activeZone.value === 'content' || activeZone.value === 'popup') {
    if (contentComponent.value && typeof contentComponent.value.handleKeyDown === 'function') {
      contentComponent.value.handleKeyDown(e)
    }
  }
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  clearInterval(timeInterval)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  width: 1280px;
  height: 800px;
  background-color: #0b1526;
  color: #fff;
  font-family: sans-serif;
  overflow: hidden;
  margin: 0 auto; /* 保证如果在更大屏幕下能居中，不过在纯1280x800下刚好占满 */
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: rgba(33, 51, 70, 1);
  height: 72px;
  flex-shrink: 0;
}

.logo img {
  height: 36px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 16px;
  color: #a4b4c4;
}

.icon {
  width: 24px;
  height: 24px;
}

.battery-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.battery-icon {
  width: 32px;
  height: 16px;
  border: 1px solid #666;
  border-radius: 2px;
  padding: 1px;
  position: relative;
}
.battery-icon::after {
  content: '';
  position: absolute;
  right: -4px;
  top: 3px;
  width: 2px;
  height: 8px;
  background: #666;
  border-radius: 0 2px 2px 0;
}
.battery-level {
  height: 100%;
  border-radius: 1px;
}
.battery-icon.green .battery-level { background-color: #4caf50; }
.battery-icon.yellow .battery-level { background-color: #ffeb3b; }
.battery-icon.red .battery-level { background-color: #f44336; }

.charging-icon {
  width: 16px;
  height: 16px;
}

.settings-body {
  display: flex;
  height: 728px;
  width: 1280px;
}

.settings-menu {
  width: 272px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  gap: 16px;
  flex-shrink: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 240px;
  height: 72px;
  padding: 0 24px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  border: 2px solid transparent;
  color: #fff;
  font-size: 23px;
  box-sizing: border-box;
  transition: all 0.2s;
}

.menu-item.active {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.15); /* 选中时稍微提亮一点 */
}

.menu-item.focused {
  border-color: #00bcd4;
}

.menu-item img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.settings-content {
  flex: 1;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}
</style>
