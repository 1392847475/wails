<!-- 基本信息 -->
<template>
  <div class="basic-info" :class="{ active: isActive }">
    <div class="card card-1" :class="{ focused: isActive && localZone === 'cards' && focusIndex === 0 }">
      <div class="label">分站编号</div>
      <div class="value">204-210</div>
    </div>
    
    <div class="card card-2" :class="{ focused: isActive && localZone === 'cards' && focusIndex === 1 }">
      <div class="label">系统类型</div>
      <div class="value-with-icon inner-box">
        <span class="value">{{ systemType }}</span>
        <img :src="isDropdownOpen ? IconCollapse : IconDropdown" class="action-icon" />
      </div>
      
      <!-- Dropdown popup -->
      <div class="dropdown" v-if="isDropdownOpen">
        <div 
          v-for="(type, idx) in systemTypes" 
          :key="type" 
          class="dropdown-item" 
          :class="{ focused: popupIndex === idx }"
        >
          {{ type }}
        </div>
      </div>
    </div>
    
    <div class="card card-3 storage-card" :class="{ focused: isActive && localZone === 'cards' && focusIndex === 2 }">
      <div class="label">储存空间</div>
      <div class="storage-content">
        <div class="chart-placeholder">
          <!-- Circular progress chart placeholder -->
          <div class="circle">
            <span class="percent">95%</span>
            <span class="desc">已用</span>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="dot used"></span><span class="legend-label">已用</span> <span class="num">11.58G</span>
          </div>
          <div class="legend-item">
            <span class="dot total"></span><span class="legend-label">总共</span> <span class="num">13.26G</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card card-4" :class="{ focused: isActive && localZone === 'cards' && focusIndex === 3 }">
      <div class="label">分站位置</div>
      <div class="value inner-box">{{ location }}</div>
    </div>
    
    <div class="card card-5" :class="{ focused: isActive && localZone === 'cards' && focusIndex === 4 }">
      <div class="label">系统描述</div>
      <div class="value-with-icon top-right">
        <img :src="IconEdit" class="action-icon" />
      </div>
      <div class="value desc-text">
        {{ desc1 }}<br/>
        {{ desc2 }}
      </div>
    </div>
    <!-- Modal for editing description -->
    <div class="modal-overlay" v-if="isModalOpen">
      <div class="modal-content">
        <div class="modal-title">系统描述</div>
        <div class="modal-body">
          <div class="input-row">
            <span class="input-label">描述1</span>
            <div class="input-box" :class="{ focused: localZone === 'modal' && modalIndex === 0 }">
              {{ tempDesc1 }}
            </div>
          </div>
          <div class="input-row">
            <span class="input-label">描述2</span>
            <div class="input-box" :class="{ focused: localZone === 'modal' && modalIndex === 1 }">
              {{ tempDesc2 }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="btn" :class="{ focused: localZone === 'modal' && modalIndex === 2 }">取消</div>
          <div class="btn" :class="{ focused: localZone === 'modal' && modalIndex === 3 }">保存</div>
        </div>
      </div>
    </div>
    
    <!-- Virtual Keyboard -->
    <VirtualKeyboard 
      ref="vkbRef"
      :is-active="isKeyboardOpen"
      @input="handleKeyboardInput"
      @backspace="handleKeyboardBackspace"
      @close="handleKeyboardClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import IconCollapse from '../../../assets/img/iocn-collapse.png'
import IconDropdown from '../../../assets/img/icon-dropdown.png'
import IconEdit from '../../../assets/img/icon-edit.png'
import VirtualKeyboard from '../../components/VirtualKeyboard.vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['popup-open', 'popup-close', 'back'])
const activeZone = inject('activeZone') as any

const localZone = ref('cards') // 'cards', 'dropdown', 'modal', 'keyboard'
const focusIndex = ref(0)
// const totalCards = 5 // Not used directly in new logic but kept for reference


// System Type
const systemType = ref('KJ967瓦斯巡检系统')
const systemTypes = ['KJ967瓦斯巡检系统', 'XXXXX监测系统', 'XXXXXX巡检系统']
const isDropdownOpen = ref(false)
const popupIndex = ref(0)

// Location
const location = ref('11054回风巷')

// System Description Modal
const desc1 = ref('第一个描述文本')
const desc2 = ref('第二个描述文本')
const isModalOpen = ref(false)
const modalIndex = ref(0) // 0: desc1, 1: desc2, 2: cancel, 3: save
const tempDesc1 = ref('')
const tempDesc2 = ref('')
const activeInput = ref(0) // 0: desc1, 1: desc2, 2: location

// Virtual Keyboard
const isKeyboardOpen = ref(false)
const vkbRef = ref<any>(null)

const handleKeyboardInput = (char: string) => {
  if (activeInput.value === 0) tempDesc1.value += char
  else if (activeInput.value === 1) tempDesc2.value += char
  else if (activeInput.value === 2) location.value += char
}

const handleKeyboardBackspace = () => {
  if (activeInput.value === 0) tempDesc1.value = tempDesc1.value.slice(0, -1)
  else if (activeInput.value === 1) tempDesc2.value = tempDesc2.value.slice(0, -1)
  else if (activeInput.value === 2) location.value = location.value.slice(0, -1)
}

const handleKeyboardClose = () => {
  isKeyboardOpen.value = false
  if (activeInput.value === 2) {
    localZone.value = 'cards'
    emit('popup-close')
  } else {
    localZone.value = 'modal'
  }
}

// 当组件再次变为 active 时，重置焦点状态
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    localZone.value = 'cards'
    focusIndex.value = 0
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive && activeZone?.value !== 'popup') return

  if (activeZone?.value === 'popup') {
    if (localZone.value === 'dropdown') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        popupIndex.value = (popupIndex.value - 1 + systemTypes.length) % systemTypes.length
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        popupIndex.value = (popupIndex.value + 1) % systemTypes.length
      } else if (e.key === 'Enter') {
        e.preventDefault()
        systemType.value = systemTypes[popupIndex.value]
        isDropdownOpen.value = false
        localZone.value = 'cards'
        emit('popup-close')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        isDropdownOpen.value = false
        localZone.value = 'cards'
        emit('popup-close')
      }
    } else if (localZone.value === 'modal') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (modalIndex.value === 2 || modalIndex.value === 3) modalIndex.value = 1
        else if (modalIndex.value === 1) modalIndex.value = 0
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (modalIndex.value === 0) modalIndex.value = 1
        else if (modalIndex.value === 1) modalIndex.value = 2
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (modalIndex.value === 3) modalIndex.value = 2
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (modalIndex.value === 2) modalIndex.value = 3
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (modalIndex.value === 0 || modalIndex.value === 1) {
          activeInput.value = modalIndex.value
          isKeyboardOpen.value = true
          localZone.value = 'keyboard'
        } else if (modalIndex.value === 2) { // Cancel
          isModalOpen.value = false
          localZone.value = 'cards'
          emit('popup-close')
        } else if (modalIndex.value === 3) { // Save
          desc1.value = tempDesc1.value
          desc2.value = tempDesc2.value
          isModalOpen.value = false
          localZone.value = 'cards'
          emit('popup-close')
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        isModalOpen.value = false
        localZone.value = 'cards'
        emit('popup-close')
      }
    } else if (localZone.value === 'keyboard') {
      if (vkbRef.value) {
        vkbRef.value.handleKeyDown(e)
      }
    }
    return
  }

  if (props.isActive && localZone.value === 'cards') {
    // Basic navigation: Up/Down/Left/Right logic for cards
    // 0: 分站编号, 1: 系统类型, 2: 储存空间 (span 2 rows), 3: 分站位置, 4: 系统描述
    // Layout roughly:
    // [0] [1]
    // [2] [3]
    // [2] [4]
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusIndex.value === 2) focusIndex.value = 0
      else if (focusIndex.value === 3) focusIndex.value = 1
      else if (focusIndex.value === 4) focusIndex.value = 3
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (focusIndex.value === 0) focusIndex.value = 2
      else if (focusIndex.value === 1) focusIndex.value = 3
      else if (focusIndex.value === 3) focusIndex.value = 4
    } else if (e.key === 'ArrowLeft') {
      if (focusIndex.value === 1) {
        e.preventDefault()
        focusIndex.value = 0
      } else if (focusIndex.value === 3 || focusIndex.value === 4) {
        e.preventDefault()
        focusIndex.value = 2
      } else {
        e.preventDefault()
        emit('back')
      }
    } else if (e.key === 'ArrowRight') {
      if (focusIndex.value === 0) {
        e.preventDefault()
        focusIndex.value = 1
      } else if (focusIndex.value === 2) {
        e.preventDefault()
        focusIndex.value = 3
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (focusIndex.value === 1) {
        isDropdownOpen.value = true
        localZone.value = 'dropdown'
        popupIndex.value = systemTypes.indexOf(systemType.value)
        emit('popup-open')
      } else if (focusIndex.value === 3) {
        // Open Keyboard for location directly
        activeInput.value = 2
        isKeyboardOpen.value = true
        localZone.value = 'keyboard'
        emit('popup-open')
      } else if (focusIndex.value === 4) {
        tempDesc1.value = desc1.value
        tempDesc2.value = desc2.value
        isModalOpen.value = true
        localZone.value = 'modal'
        modalIndex.value = 0
        emit('popup-open')
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      emit('back')
    }
  }
}

defineExpose({ handleKeyDown })

// remove onMounted and onUnmounted
</script>

<style scoped>
.basic-info {
  position: relative;
  width: 940px; /* 460 + 460 + 20 */
  height: 660px; /* 刚好容纳卡片 */
}

.card {
  position: absolute;
  background-color: #1a273b;
  border-radius: 6px;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 2px solid transparent;
  box-sizing: border-box;
}

.card-1 {
  width: 460px;
  height: 166px;
  top: 0;
  left: 0;
}

.card-2 {
  width: 460px;
  height: 166px;
  top: 0;
  left: 480px; /* 460 + 20 gap */
}

.card-3 {
  width: 460px;
  height: 474px;
  top: 186px; /* 166 + 20 gap */
  left: 0;
}

.card-4 {
  width: 460px;
  height: 180px;
  top: 186px; /* 166 + 20 gap */
  left: 480px;
}

.card-5 {
  width: 460px;
  height: 270px;
  top: 386px; /* 186 + 180 + 20 gap */
  left: 480px;
}

.card.focused {
  border-color: #00bcd4;
}

.label {
  color: #8fa0b5;
  font-size: 22px;
  margin-bottom: 20px;
}

.value {
  color: #fff;
  font-size: 22px;
  font-weight: 500;
  margin-top: auto;
  margin-bottom: auto;
}

.inner-box {
  background-color: #21334d;
  border: 1px solid #2a3a52;
  border-radius: 6px;
  padding: 12px 15px;
  margin-top: auto;
  margin-bottom: auto;
}

.value-with-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-with-icon.top-right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.action-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #21334d;
  border: 1px solid #3a4a62;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.dropdown-item {
  padding: 15px 25px;
  cursor: pointer;
  color: #fff;
  font-size: 22px;
}

.dropdown-item.focused {
  background-color: #3a4a62;
  color: #00bcd4;
  border: 1px solid #00bcd4;
  border-radius: 4px;
}

.storage-card {
  justify-content: flex-start;
}

.storage-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 50px;
}

.circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 15px solid #00bcd4;
  border-top-color: #334;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
}

.circle > * {
  transform: rotate(-45deg);
}

.percent {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}

.desc {
  font-size: 22px;
  color: #8fa0b5;
  margin-top: 5px;
}

.legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 40px;
}

.legend-item {
  display: flex;
  align-items: center;
  background-color: #21334d;
  padding: 10px 15px;
  border-radius: 4px;
}

.legend-label {
  color: #8fa0b5;
  font-size: 22px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 15px;
}

.dot.used { background-color: #00bcd4; }
.dot.total { background-color: #334; }

.num {
  margin-left: auto;
  color: #fff;
  font-weight: bold;
  font-size: 22px;
}

.desc-text {
  font-size: 22px;
  line-height: 1.8;
  color: #fff;
  margin-top: auto;
  margin-bottom: auto;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #1a273b;
  border-radius: 8px;
  padding: 30px;
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
}

.modal-title {
  color: #fff;
  font-size: 22px;
  text-align: center;
  margin-bottom: 10px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.input-label {
  color: #8fa0b5;
  font-size: 22px;
  width: 70px;
}

.input-box {
  flex: 1;
  background-color: #0b1526;
  border: 1px solid #2a3a52;
  border-radius: 4px;
  padding: 10px 15px;
  color: #fff;
  font-size: 22px;
  min-height: 40px;
}

.input-box.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.btn {
  background-color: #21334d;
  color: #8fa0b5;
  padding: 10px 40px;
  border-radius: 4px;
  border: 2px solid transparent;
  font-size: 22px;
}

.btn.focused {
  border-color: #00bcd4;
  color: #fff;
}

/* Virtual Keyboard */
.keyboard-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1a273b;
  padding: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #3a4a62;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
}

.keyboard-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.key-btn {
  background-color: #21334d;
  color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  border: 2px solid transparent;
  min-width: 50px;
  text-align: center;
  font-size: 16px;
}

.key-btn.special {
  padding: 15px 30px;
}

.key-btn.focused {
  border-color: #00bcd4;
  background-color: #3a4a62;
}
</style>
