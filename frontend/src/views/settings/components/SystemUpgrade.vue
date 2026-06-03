<!-- 系统升级 -->
<template>
  <div class="system-upgrade" :class="{ active: isActive }">
    <div class="tabs-header">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 0, focused: isActive && localZone === 'tabs' && activeTab === 0 }"
      >版本升级</div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 1, focused: isActive && localZone === 'tabs' && activeTab === 1 }"
      >服务升级</div>
    </div>

    <!-- 版本升级 -->
    <div class="tab-content" v-if="activeTab === 0">
      <div class="version-container">
        <img :src="versionImage" class="version-img" />
        <div class="version-status">{{ hasUsb ? 'U盘更新' : '当前已是最新版本' }}</div>

        <div 
          v-if="hasUsb" 
          class="file-selector" 
          :class="{ focused: isActive && localZone === 'version-content' && focusIndex === 0 }"
        >
          <span class="label">选择文件</span>
          <div class="select-box">
            <span>{{ selectedFile }}</span>
            <img :src="isDropdownOpen ? IconCollapse : IconDropdown" class="action-icon" />
          </div>
          <!-- Dropdown popup -->
          <div class="dropdown" v-if="isDropdownOpen">
            <div 
              v-for="(file, idx) in usbFiles" 
              :key="file" 
              class="dropdown-item" 
              :class="{ focused: popupIndex === idx }"
            >
              {{ file }}
            </div>
          </div>
        </div>

        <div class="version-text" :class="{ 'no-usb-margin': !hasUsb }">当前版本: Ver 1.2-0 Feb 7 2014</div>

        <div 
          class="action-btn" 
          :class="{ 
            disabled: !hasUsb, 
            focused: isActive && localZone === 'version-content' && focusIndex === (hasUsb ? 1 : 0) 
          }"
        >
          {{ hasUsb ? '立即更新' : '无需更新' }}
        </div>
      </div>
    </div>

    <!-- 服务升级 -->
    <div class="tab-content" v-if="activeTab === 1">
      <div class="service-container">
        <div class="table-header">服务列表</div>
        <div class="service-table">
          <div class="tr th">
            <div class="td col-no">NO</div>
            <div class="td col-name">服务名称</div>
            <div class="td col-time">最后一次更新时间</div>
            <div class="td col-action">操作</div>
          </div>
          <div 
            class="tr" 
            v-for="(item, index) in services" 
            :key="item.id" 
            :class="{ focused: isActive && localZone === 'service-content' && focusIndex === index }"
          >
            <div class="td col-no">{{ index + 1 }}</div>
            <div class="td col-name">{{ item.name }}</div>
            <div class="td col-time">{{ item.time }}</div>
            <div class="td col-action" :class="{ 'can-update': item.canUpdate }">
              {{ item.canUpdate ? '更新' : '--' }}
            </div>
          </div>
        </div>

        <div class="service-footer">
          <div 
            class="action-btn all-update-btn" 
            :class="{ focused: isActive && localZone === 'service-content' && focusIndex === services.length }"
          >
            一键更新
          </div>
          <div class="hint-text">提示：发现2个更新文件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import Update1 from '../../../assets/img/Update1.png'
import Update2 from '../../../assets/img/Update2.png'
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

const activeTab = ref(0) // 0: Version, 1: Service
const localZone = ref('tabs') // 'tabs', 'version-content', 'service-content'
const focusIndex = ref(0)

// 模拟是否有U盘插入的状态（此处默认true展示U盘状态，可修改为false查看无需更新状态）
const hasUsb = ref(true)

const versionImage = computed(() => {
  return hasUsb.value ? Update2 : Update1
})

const isDropdownOpen = ref(false)
const popupIndex = ref(0)
const usbFiles = ['dev/bus/usb/001/006', 'dev/bus/usb/001/007', 'dev/bus/usb/002/001']
const selectedFile = ref(usbFiles[0])

const services = ref([
  { id: 1, name: '名称1', time: '2026-04-30 16:05:20', canUpdate: false },
  { id: 2, name: '名称2', time: '2026-04-29 12:18:56', canUpdate: false },
  { id: 3, name: '名称3', time: '2026-04-30 16:05:20', canUpdate: true },
  { id: 4, name: '名称4', time: '2026-04-30 16:05:20', canUpdate: false },
  { id: 5, name: '名称1', time: '2026-04-30 16:05:20', canUpdate: true },
])

// 当重新进入页面时，重置状态
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    activeTab.value = 0
    localZone.value = 'tabs'
    focusIndex.value = 0
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive && activeZone?.value !== 'popup') return

  if (activeZone?.value === 'popup' && isDropdownOpen.value) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      popupIndex.value = (popupIndex.value - 1 + usbFiles.length) % usbFiles.length
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      popupIndex.value = (popupIndex.value + 1) % usbFiles.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectedFile.value = usbFiles[popupIndex.value]
      isDropdownOpen.value = false
      emit('popup-close')
    } else if (e.key === 'Escape') {
      e.preventDefault()
      isDropdownOpen.value = false
      emit('popup-close')
    }
    return
  }

  if (props.isActive) {
    if (e.key === 'Escape') {
      e.preventDefault()
      emit('back')
      return
    }

    if (localZone.value === 'tabs') {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (activeTab.value < 1) activeTab.value++
      } else if (e.key === 'ArrowLeft') {
        if (activeTab.value > 0) {
          e.preventDefault()
          activeTab.value--
        } else {
          e.preventDefault()
          emit('back')
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        localZone.value = activeTab.value === 0 ? 'version-content' : 'service-content'
        focusIndex.value = 0
      }
    } else if (localZone.value === 'version-content') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (focusIndex.value > 0) {
          focusIndex.value--
        } else {
          localZone.value = 'tabs'
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const max = hasUsb.value ? 1 : 0
        if (focusIndex.value < max) focusIndex.value++
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (hasUsb.value && focusIndex.value === 0) {
          // 打开下拉框
          isDropdownOpen.value = true
          popupIndex.value = usbFiles.indexOf(selectedFile.value)
          emit('popup-open')
        } else if (hasUsb.value && focusIndex.value === 1) {
          console.log('立即更新...')
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        emit('back')
      }
    } else if (localZone.value === 'service-content') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (focusIndex.value > 0) {
          focusIndex.value--
        } else {
          localZone.value = 'tabs'
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (focusIndex.value < services.value.length) focusIndex.value++
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (focusIndex.value < services.value.length) {
          const row = services.value[focusIndex.value]
          if (row.canUpdate) {
            console.log('单个更新服务:', row.name)
          }
        } else {
          console.log('一键更新所有服务...')
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        emit('back')
      }
    }
  }
}

defineExpose({ handleKeyDown })

// remove onMounted and onUnmounted
</script>

<style scoped>
.system-upgrade {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
  background-color: #0b1526;
  border-radius: 6px;
}

/* Tabs */
.tabs-header {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.tab-item {
  color: #8fa0b5;
  font-size: 18px;
  padding: 5px 0;
  border-bottom: 2px solid transparent;
  outline: 2px solid transparent;
  outline-offset: 4px;
}

.tab-item.active {
  color: #fff;
  border-bottom-color: #00bcd4;
}

.tab-item.focused {
  outline-color: #00bcd4;
  border-radius: 2px;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* Version Upgrade */
.version-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.version-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-top: 20px;
}

.version-status {
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 20px;
}

.file-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  position: relative;
  padding: 8px 15px;
  border: 2px solid transparent;
  border-radius: 6px;
}

.file-selector.focused {
  border-color: #00bcd4;
}

.file-selector .label {
  color: #8fa0b5;
  font-size: 16px;
}

.action-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.select-box {
  background-color: #1a273b;
  border: 1px solid #2a3a52;
  border-radius: 4px;
  padding: 8px 15px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 15px;
  width: 250px;
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
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-item.focused {
  background-color: #3a4a62;
  color: #00bcd4;
}

.version-text {
  color: #8fa0b5;
  font-size: 14px;
  margin-bottom: 30px;
}

.version-text.no-usb-margin {
  margin-top: 20px;
}

.action-btn {
  background-color: #1a273b;
  color: #fff;
  padding: 10px 40px;
  border-radius: 6px;
  font-size: 16px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.action-btn.disabled {
  opacity: 0.6;
  color: #8fa0b5;
}

.action-btn.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

/* Service Upgrade */
.service-container {
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-header {
  font-size: 16px;
  color: #8fa0b5;
  margin-bottom: 10px;
}

.service-table {
  background-color: #1a273b;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tr {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #2a3a52;
  border: 2px solid transparent;
}

.tr.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

.tr:last-child {
  border-bottom: none;
}

.th {
  color: #8fa0b5;
  border-bottom: 1px solid #2a3a52;
  padding: 15px 20px;
}

.td {
  flex: 1;
  text-align: left;
}

.col-no { flex: 0.5; text-align: center; }
.col-name { flex: 1.5; }
.col-time { flex: 2; text-align: center; }
.col-action { flex: 0.5; text-align: center; }

.can-update {
  color: #00bcd4;
}

.service-footer {
  margin-top: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.all-update-btn {
  background-color: #21334d;
  border: 2px solid transparent;
}

.hint-text {
  color: #8fa0b5;
  font-size: 14px;
}
</style>
