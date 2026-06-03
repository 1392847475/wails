<template>
  <div class="factory-reset" :class="{ active: isActive }">
    <div class="content-wrapper">
      <img :src="ResetIcon" class="reset-img" />
      <div class="title">恢复出厂设置</div>
      <div class="subtitle">此操作将清除所有数据</div>
      
      <div 
        class="reset-btn" 
        :class="{ focused: isActive && isFocused }"
      >
        重置设备
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ResetIcon from '../../../assets/img/iocn-hfcc.png'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back'])

const isFocused = ref(true)

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    isFocused.value = true
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive) return

  if (e.key === 'Enter') {
    e.preventDefault()
    if (isFocused.value) {
      console.log('执行重置设备操作...')
      // 这里可以后续接入实际的重置逻辑和二次确认弹窗
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
    e.preventDefault()
    emit('back')
  }
  // 上下右键在这个页面没有其他可选项，所以忽略
}

defineExpose({ handleKeyDown })
</script>

<style scoped>
.factory-reset {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
  background-color: #0b1526;
  border-radius: 6px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reset-img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 16px;
  color: #8fa0b5;
  margin-bottom: 40px;
}

.reset-btn {
  background-color: #1a273b;
  color: #fff;
  font-size: 18px;
  padding: 15px 40px;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.reset-btn.focused {
  border-color: #00bcd4;
  background-color: #21334d;
}
</style>
