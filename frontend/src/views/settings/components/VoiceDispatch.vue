<!-- 语音调度 -->
<template>
  <div class="voice-dispatch" :class="{ active: isActive }">
    <!-- 顶部状态栏 -->
    <div class="top-status">
      <div class="host-info">
        <span class="label">本机信息:</span>
        <span class="value">1002 (已注册)</span>
        <span class="divider">|</span>
        <span class="value">01组01号</span>
        <span class="divider">|</span>
        <span class="value">192.168.10.54</span>
      </div>
      <div class="host-status">空闲</div>
    </div>

    <!-- 联系人列表网格 -->
    <div class="contacts-grid">
      <div 
        v-for="(contact, index) in contacts" 
        :key="contact.id"
        class="contact-card"
        :class="{ 
          focused: isActive && localZone === 'grid' && focusIndex === index,
          'status-busy': contact.status === 'busy',
          'status-offline': contact.status === 'offline'
        }"
      >
        <div class="icon-col">
          <img :src="getPhoneIcon(contact.status)" class="phone-icon" />
          <span class="status-text">{{ getStatusText(contact.status) }}</span>
        </div>
        <div class="info-col">
          <div class="name">{{ contact.name }}</div>
          <div class="number">键{{ contact.keyId }}-{{ contact.number }}</div>
        </div>
      </div>
    </div>

    <!-- 确认呼叫/强呼弹窗 -->
    <div class="modal-overlay" v-if="confirmModal.isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{{ contacts[focusIndex]?.name }}</div>
          <div class="close-btn" @click="closeConfirmModal">✕</div>
        </div>
        <div class="modal-body">
          {{ contacts[focusIndex]?.status === 'busy' ? '占线中，是否强呼？' : '当前空闲，可呼叫' }}
        </div>
        <div class="modal-footer">
          <div 
            class="btn btn-cancel" 
            :class="{ focused: localZone === 'confirm' && confirmIndex === 0 }"
          >
            取消
          </div>
          <div 
            class="btn btn-primary" 
            :class="{ focused: localZone === 'confirm' && confirmIndex === 1 }"
          >
            {{ contacts[focusIndex]?.status === 'busy' ? '强呼' : '呼叫' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 通话中弹窗 -->
    <CallModal 
      ref="callModalRef"
      :is-open="callModal.isOpen"
      :is-active="localZone === 'call'"
      @close="closeCallModal"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, reactive } from 'vue'
import CallModal from '../../components/CallModal.vue'

// 导入图标
import Phone1 from '../../../assets/img/phone1.png'
import Phone2 from '../../../assets/img/phone2.png'
import Phone3 from '../../../assets/img/phone3.png'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['popup-open', 'popup-close', 'back'])
const activeZone = inject('activeZone') as any

const localZone = ref('grid') // 'grid', 'confirm', 'call'
const focusIndex = ref(0) // 网格焦点

// 弹窗状态
const confirmModal = reactive({ isOpen: false })
const confirmIndex = ref(1) // 0:取消, 1:确认

const callModal = reactive({ isOpen: false })
const callModalRef = ref<any>(null)

// 模拟联系人数据
const contacts = ref([
  { id: 1, name: '1号调度台左话机', status: 'idle', keyId: 1, number: '6002' },
  { id: 2, name: '1号调度台右话机', status: 'busy', keyId: 2, number: '6000' },
  { id: 3, name: '无线对讲机A', status: 'offline', keyId: 5, number: '8272' },
  { id: 4, name: '门禁对讲', status: 'idle', keyId: 7, number: '8022' },
  { id: 5, name: 'SX-P710防爆', status: 'idle', keyId: 8, number: '8010' },
  { id: 6, name: '矿用双回路-主', status: 'idle', keyId: 10, number: '8003' },
  { id: 7, name: 'SX-P290视频话机', status: 'idle', keyId: 8, number: '8026' },
])

const getPhoneIcon = (status: string) => {
  if (status === 'busy') return Phone2
  if (status === 'offline') return Phone3
  return Phone1
}

const getStatusText = (status: string) => {
  if (status === 'busy') return '占线'
  if (status === 'offline') return '离线'
  return '空闲'
}

// 弹窗控制方法
const openConfirmModal = () => {
  confirmModal.isOpen = true
  localZone.value = 'confirm'
  confirmIndex.value = 1 // 默认选中呼叫/强呼
  emit('popup-open')
}

const closeConfirmModal = () => {
  confirmModal.isOpen = false
  localZone.value = 'grid'
  emit('popup-close')
}

const openCallModal = () => {
  confirmModal.isOpen = false
  callModal.isOpen = true
  localZone.value = 'call'
  emit('popup-open')
}

const closeCallModal = () => {
  callModal.isOpen = false
  localZone.value = 'grid'
  emit('popup-close')
}

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    localZone.value = 'grid'
    focusIndex.value = 0
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive && activeZone?.value !== 'popup') return

  if (activeZone?.value === 'popup') {
    if (localZone.value === 'confirm') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        confirmIndex.value = 0
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        confirmIndex.value = 1
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (confirmIndex.value === 0) {
          closeConfirmModal()
        } else {
          openCallModal()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closeConfirmModal()
      }
    } else if (localZone.value === 'call') {
      if (callModalRef.value) {
        callModalRef.value.handleKeyDown(e)
      }
    }
    return
  }

  if (props.isActive && localZone.value === 'grid') {
    const cols = 3
    const maxIndex = contacts.value.length - 1

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusIndex.value >= cols) {
        focusIndex.value -= cols
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (focusIndex.value + cols <= maxIndex) {
        focusIndex.value += cols
      } else {
        // 如果下方没有对应卡片，跳到最后一个
        const remaining = maxIndex - focusIndex.value
        if (remaining > 0 && remaining < cols) {
          focusIndex.value = maxIndex
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (focusIndex.value % cols !== 0) {
        focusIndex.value--
      } else {
        emit('back')
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (focusIndex.value % cols !== cols - 1 && focusIndex.value < maxIndex) {
        focusIndex.value++
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const contact = contacts.value[focusIndex.value]
      if (contact.status !== 'offline') {
        openConfirmModal()
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
.voice-dispatch {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
}

/* 顶部状态栏 */
.top-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.host-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  color: #8fa0b5;
}

.host-info .value {
  color: #fff;
}

.divider {
  color: #2a3a52;
}

.host-status {
  background-color: rgba(45, 220, 127, 0.2);
  color: #2ddc7f;
  padding: 4px 15px;
  border-radius: 4px;
  font-size: 16px;
  border: 1px solid #2ddc7f;
}

/* 联系人网格 */
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-content: start;
}

.contact-card {
  background-color: #1a273b;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  gap: 20px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.contact-card.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}

.icon-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 48px;
}

.phone-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.status-text {
  font-size: 14px;
  color: #2ddc7f; /* 默认空闲绿色 */
}

.contact-card.status-busy .status-text {
  color: #f9cd1c; /* 占线黄色 */
}

.contact-card.status-offline .status-text {
  color: #8fa0b5; /* 离线灰色 */
}

.info-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.name {
  font-size: 20px;
  color: #fff;
}

.number {
  font-size: 16px;
  color: #8fa0b5;
}

/* 通用弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content, .call-modal-content {
  background-color: #1a273b;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
}

.modal-content {
  width: 400px;
}

.call-modal-content {
  width: 500px;
  padding-bottom: 30px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #2a3a52;
}

.modal-title {
  color: #fff;
  font-size: 18px;
}

.close-btn {
  color: #8fa0b5;
  cursor: pointer;
  font-size: 20px;
}

.modal-body {
  padding: 40px 20px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #2a3a52;
}

.btn {
  flex: 1;
  padding: 15px 0;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  border: 2px solid transparent;
}

.btn-cancel {
  background-color: #21334d;
  color: #fff;
  border-bottom-left-radius: 8px;
}

.btn-primary {
  background-color: rgba(17, 149, 230, 1);
  color: #fff;
  border-bottom-right-radius: 8px;
}

.btn.focused {
  border-color: #fff;
  filter: brightness(1.2);
}

/* 语音调度通话弹窗专属样式 */
.call-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.host-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #21334d;
  padding: 10px;
}

.call-target {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.target-number {
  font-size: 20px;
  color: #fff;
}

.target-group {
  font-size: 14px;
  color: #8fa0b5;
}

.calling-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 30px 0 50px 0;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #00bcd4;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.4);
}

.avatar-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.calling-text {
  font-size: 16px;
  color: #8fa0b5;
}

.call-controls {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.control-item, .hangup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #21334d;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
}

.control-btn.active {
  background-color: #fff;
}

.control-item.focused .control-btn {
  border-color: #00bcd4;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.5);
}

.control-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.control-text {
  font-size: 14px;
  color: #8fa0b5;
}

.hangup-container {
  margin-top: 10px;
}

.hangup-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f44336;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
}

.hangup-container .focused .hangup-btn {
  border-color: #fff;
  box-shadow: 0 0 15px rgba(244, 67, 54, 0.6);
}

.hangup-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
