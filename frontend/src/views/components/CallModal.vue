<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="call-modal-content">
      <div class="modal-header">
        <div class="modal-title">语音调度</div>
        <div class="close-btn" @click="handleClose">✕</div>
      </div>
      <div class="call-info">
        <div class="host-avatar-wrapper">
          <img :src="HostIcon" class="host-avatar" />
          <span class="host-avatar-text">本机<br/>信息</span>
        </div>
        <div class="call-target">
          <div class="target-number">{{ targetInfo.number }}</div>
          <div class="target-group">{{ targetInfo.group }}</div>
        </div>
      </div>
      
      <div class="calling-animation">
        <div class="avatar-circle">
          <span class="avatar-text">矿用</span>
        </div>
        <div class="calling-text">正在呼叫对方...</div>
      </div>

      <div class="call-controls">
        <div class="control-item" :class="{ focused: isActive && callIndex === 0 }">
          <div class="control-btn">
            <img :src="callState.micMuted ? Mic2 : Mic1" class="control-icon" />
          </div>
          <span class="control-text">麦克风已{{ callState.micMuted ? '关' : '开' }}</span>
        </div>
        <div class="control-item" :class="{ focused: isActive && callIndex === 1 }">
          <div class="control-btn">
            <img :src="callState.speakerMuted ? Speaker2 : Speaker1" class="control-icon" />
          </div>
          <span class="control-text">扬声器已{{ callState.speakerMuted ? '关' : '开' }}</span>
        </div>
        <div class="control-item" :class="{ focused: isActive && callIndex === 2 }">
          <div class="control-btn">
            <img :src="callState.cameraOn ? Camera1 : Camera2" class="control-icon" />
          </div>
          <span class="control-text">摄像头已{{ callState.cameraOn ? '开' : '关' }}</span>
        </div>
      </div>

      <div class="hangup-container" :class="{ focused: isActive && callIndex === 3 }">
        <div class="hangup-btn-wrapper">
          <img :src="HangUpIcon" class="hangup-icon" />
        </div>
        <span class="control-text">挂断</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// 导入图标
import HostIcon from '../../assets/img/device/host.png'
import Mic1 from '../../assets/img/device/mic1.png'
import Mic2 from '../../assets/img/device/mic2.png'
import Speaker1 from '../../assets/img/device/speaker1.png'
import Speaker2 from '../../assets/img/device/speaker2.png'
import Camera1 from '../../assets/img/device/camera1.png'
import Camera2 from '../../assets/img/device/camera2.png'
import HangUpIcon from '../../assets/img/device/hangUp.png'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isActive: { // 当前组件是否拥有焦点处理权
    type: Boolean,
    default: false
  },
  targetInfo: {
    type: Object,
    default: () => ({ number: '1002', group: '01组01号' })
  }
})

const emit = defineEmits(['close'])

const callIndex = ref(3) // 0:麦克风, 1:扬声器, 2:摄像头, 3:挂断
const callState = reactive({
  micMuted: false,
  speakerMuted: false,
  cameraOn: false
})

// 每次打开弹窗重置状态
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    callIndex.value = 3 // 默认选中挂断
  }
})

const handleClose = () => {
  emit('close')
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive || !props.isOpen) return

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (callIndex.value > 0 && callIndex.value < 3) {
      callIndex.value--
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (callIndex.value < 2) {
      callIndex.value++
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (callIndex.value !== 3) {
      callIndex.value = 3 // 跳到挂断
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (callIndex.value === 3) {
      callIndex.value = 1 // 从挂断回到扬声器
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (callIndex.value === 0) callState.micMuted = !callState.micMuted
    else if (callIndex.value === 1) callState.speakerMuted = !callState.speakerMuted
    else if (callIndex.value === 2) callState.cameraOn = !callState.cameraOn
    else if (callIndex.value === 3) handleClose()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleClose()
  }
}

defineExpose({ handleKeyDown })
</script>

<style scoped>
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

.call-modal-content {
  background-color: #1a273b;
  background-image: url('../../assets/img/iponebj.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  width: 480px;
  height: 664px;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  position: relative;
}

.modal-title {
  color: #fff;
  font-size: 22px;
  width: 100%;
  text-align: center;
}

.close-btn {
  color: #8fa0b5;
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

/* 本机信息区域 */
.call-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 30px 24px 30px;
  position: relative;
}

.call-info::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 384px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.12);
}

.host-avatar-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.host-avatar {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.host-avatar-text {
  position: absolute;
  color: rgba(255, 255, 255, 0.88);
  font-size: 18px;
  text-align: center;
  line-height: 1.2;
}

.call-target {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-number {
  font-size: 24px;
  color: #fff;
}

.target-group {
  font-size: 16px;
  color: #8fa0b5;
}

/* 呼叫动画区域 */
.calling-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 40px 0 50px 0;
}

.avatar-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background-color: rgba(20, 164, 252, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 0 20px rgba(20, 164, 252, 0.4);
}

.avatar-text {
  font-size: 28px;
  color: #fff;
  font-weight: normal;
}

.calling-text {
  font-size: 18px;
  color: #8fa0b5;
}

/* 控制按钮区域 */
.call-controls {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.control-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 50%;
  padding: 0;
  width: 72px;
  height: 72px;
}

.control-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.control-item.focused .control-btn {
  border-color: #00bcd4;
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.5);
}

.control-text {
  font-size: 16px;
  color: #8fa0b5;
}

/* 挂断区域 */
.hangup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: -13px; /* 从原本的默认距(约40px)往上提，缩小到与上方大约27px的距离 */
}

.hangup-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 13px; /* 圆角 5px */
  padding: 0;
  width: 72px;
  height: 72px;
}

.hangup-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hangup-container.focused .hangup-btn-wrapper {
  border-color: #00bcd4; /* 改为青蓝色高亮 */
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.5);
}
</style>
