<!-- 数据导出 -->
<template>
  <div class="data-export" :class="{ active: isActive }">
    <div class="export-container">
      
      <!-- U盘状态展示区 -->
      <div class="usb-status-box">
        <img :src="usbIcon" class="usb-img" />
        <div class="usb-text" :class="{ 'text-normal': status !== 'unplugged' }">
          {{ statusText }}
        </div>
      </div>

      <!-- 路径选择区 -->
      <div class="path-selector-row" :class="{ disabled: status === 'unplugged' }">
        <span class="label">U盘路径</span>
        
        <div 
          class="select-box-wrapper"
          :class="{ focused: isActive && localZone === 'content' && focusIndex === 0 && status !== 'unplugged' && !isDropdownOpen }"
        >
          <div class="select-box">
            <span>{{ selectedPath }}</span>
            <img :src="isDropdownOpen ? IconCollapse : IconDropdown" class="action-icon" />
          </div>

          <!-- 下拉弹窗 -->
          <div class="dropdown" v-if="isDropdownOpen">
            <div 
              v-for="(path, idx) in usbPaths" 
              :key="path" 
              class="dropdown-item" 
              :class="{ focused: popupIndex === idx }"
            >
              {{ path }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作与进度区 -->
      <div class="footer-area">
        <!-- 未开始导出，显示导出按钮 -->
        <div 
          v-if="status === 'unplugged' || status === 'ready'"
          class="export-btn"
          :class="{ 
            disabled: status === 'unplugged', 
            focused: isActive && localZone === 'content' && focusIndex === 1 && status !== 'unplugged' 
          }"
        >
          数据导出
        </div>

        <!-- 导出进度条 -->
        <div v-else-if="status === 'exporting'" class="progress-wrapper">
          <div class="progress-bg">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">正在导出数据... {{ progress }}%</div>
        </div>

        <!-- 导出成功 -->
        <div v-else-if="status === 'success'" class="success-bar">
          <div class="success-icon"></div>
          <span>导出成功</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import U1 from '../../../assets/img/U1.png'
import U2 from '../../../assets/img/U2.png'
import IconCollapse from '../../../assets/img/iocn-collapse.png'
import IconDropdown from '../../../assets/img/icon-dropdown.png'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['popup-open', 'popup-close', 'back'])
const activeZone = inject('activeZone') as any

// 页面内部焦点区域：'content'
const localZone = ref('content')
// focusIndex 0: 下拉框, 1: 导出按钮
const focusIndex = ref(0) 

// 状态机: 'unplugged' 未插入, 'ready' 已插入(准备就绪), 'exporting' 导出中, 'success' 导出成功
// 可以在这里手动修改初值来查看不同状态
const status = ref<'unplugged'|'ready'|'exporting'|'success'>('ready') 
const progress = ref(0)

// U盘信息
const usbPaths = ['/', 'dev/bus/usb/001/006', 'dev/bus/usb/002/001']
const selectedPath = ref(usbPaths[0])
const isDropdownOpen = ref(false)
const popupIndex = ref(0)

const usbIcon = computed(() => {
  return status.value === 'unplugged' ? U2 : U1
})

const statusText = computed(() => {
  if (status.value === 'unplugged') return '请先插入U盘'
  return 'U盘 (64GB可用，共128G)'
})

// 模拟导出过程
const startExport = () => {
  if (status.value !== 'ready') return
  status.value = 'exporting'
  progress.value = 0
  
  const timer = setInterval(() => {
    progress.value += Math.floor(Math.random() * 10) + 5
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
      setTimeout(() => {
        status.value = 'success'
        // 3秒后恢复到 ready 状态
        setTimeout(() => {
          status.value = 'ready'
          progress.value = 0
        }, 3000)
      }, 500)
    }
  }, 200)
}

// 每次进入页面时重置焦点
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    localZone.value = 'content'
    focusIndex.value = status.value === 'unplugged' ? 0 : 0 
    isDropdownOpen.value = false
  }
})

// 按键处理逻辑
const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive && activeZone?.value !== 'popup') return

  // 处理下拉框弹窗时的按键
  if (activeZone?.value === 'popup' && isDropdownOpen.value) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      popupIndex.value = (popupIndex.value - 1 + usbPaths.length) % usbPaths.length
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      popupIndex.value = (popupIndex.value + 1) % usbPaths.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectedPath.value = usbPaths[popupIndex.value]
      isDropdownOpen.value = false
      emit('popup-close')
    } else if (e.key === 'Escape' || e.key === 'ArrowLeft') {
      e.preventDefault()
      isDropdownOpen.value = false
      emit('popup-close')
    }
    return
  }

  // 正常页面内容按键
  if (props.isActive) {
    // 导出中禁止操作
    if (status.value === 'exporting') return 

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusIndex.value > 0) focusIndex.value--
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (focusIndex.value < 1 && status.value !== 'unplugged') focusIndex.value++
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      emit('back')
    } else if (e.key === 'ArrowRight') {
      // 保持当前焦点，阻止默认行为，或按需处理
      e.preventDefault()
    } else if (e.key === 'Enter') {
      e.preventDefault()

      if (focusIndex.value === 0) {
        // 打开下拉框
        isDropdownOpen.value = true
        popupIndex.value = Math.max(0, usbPaths.indexOf(selectedPath.value))
        emit('popup-open')
      } else if (focusIndex.value === 1 && status.value === 'ready') {
        // 开始导出
        startExport()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      emit('back')
    }
  }
}

defineExpose({ handleKeyDown })
</script>

<style scoped>
.data-export {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
  background-color: transparent;
  border-radius: 6px;
}

.export-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

/* U盘状态展示区 */
.usb-status-box {
  width: 500px;
  height: 200px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.usb-img {
  width: 48px;
  height: auto;
  object-fit: contain;
}

.usb-text {
  font-size: 20px;
  color: #8fa0b5;
}

.usb-text.text-normal {
  color: #fff;
}

/* 路径选择区 */
.path-selector-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  width: 500px;
}

.path-selector-row.disabled {
  opacity: 0.5;
}

.path-selector-row .label {
  color: #8fa0b5;
  font-size: 20px;
  white-space: nowrap;
}

.select-box-wrapper {
  flex: 1;
  position: relative;
  border: 2px solid transparent;
  border-radius: 6px;
}

.select-box-wrapper.focused {
  border-color: #00bcd4;
}

.select-box {
  background-color: #1a273b;
  border: 1px solid #2a3a52;
  border-radius: 4px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}

.action-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* 下拉弹窗 */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #21334d;
  border: 1px solid #3a4a62;
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.dropdown-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 20px;
}

.dropdown-item.focused {
  background-color: #3a4a62;
  color: #00bcd4;
}

/* 底部操作与进度区 */
.footer-area {
  width: 500px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 导出按钮 */
.export-btn {
  background-color: #1a273b;
  color: #fff;
  font-size: 20px;
  padding: 12px 40px;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: all 0.2s;
  min-width: 160px;
  text-align: center;
}

.export-btn.disabled {
  background-color: #111b2b;
  color: #4a5a72;
}

.export-btn.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

/* 进度条 */
.progress-wrapper {
  width: 100%;
  height: 48px;
  background-color: #1a273b;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  border: 1px solid #2a3a52;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* 导出成功 */
.success-bar {
  width: 100%;
  height: 48px;
  background-color: #4caf50;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 20px;
}

.success-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  color: #4caf50;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.success-icon::after {
  content: '✓';
  font-weight: bold;
  font-size: 16px;
}
</style>
