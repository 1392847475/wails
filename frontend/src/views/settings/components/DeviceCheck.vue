<!-- 设备自检 -->
<template>
  <div class="device-check" :class="{ active: isActive }">
    <!-- 默认状态：居中显示 -->
    <div v-if="status === 'default'" class="default-view">
      <img :src="DefaultIcon" class="main-icon" />
      <div class="main-desc">一键自检，维护系统运行状态</div>
      <div 
        class="action-btn" 
        :class="{ focused: isActive && localZone === 'content' && focusIndex === 0 }"
      >
        一键自检
      </div>
    </div>

    <!-- 自检中/结果状态 -->
    <div v-else class="result-view">
      <!-- 顶部信息区 -->
      <div class="top-info">
        <!-- 左侧图标/进度条 -->
        <div class="icon-area">
          <template v-if="status === 'checking'">
            <div class="progress-bg" :style="{ backgroundImage: `url(${CheckingIcon})` }">
              <div ref="chartRef" class="echarts-container"></div>
            </div>
          </template>
          <img v-else-if="status === 'normal'" :src="NormalIcon" class="main-icon-small" />
          <img v-else-if="status === 'exception'" :src="ExceptionIcon" class="main-icon-small" />
        </div>
        
        <!-- 右侧文本与操作 -->
        <div class="text-area">
          <div class="status-title">{{ statusTitle }}</div>
          <div class="btn-group">
            <template v-if="status === 'checking'">
              <div class="action-btn" :class="{ focused: isActive && localZone === 'content' && focusIndex === 0 }">取消自检</div>
            </template>
            <template v-else-if="status === 'normal'">
              <div class="action-btn" :class="{ focused: isActive && localZone === 'content' && focusIndex === 0 }">再次检测</div>
            </template>
            <template v-else-if="status === 'exception'">
              <div class="action-btn" :class="{ focused: isActive && localZone === 'content' && focusIndex === 0 }">再次检测</div>
              <div class="action-btn primary" :class="{ focused: isActive && localZone === 'content' && focusIndex === 1 }">一键报修</div>
            </template>
          </div>
        </div>
      </div>

      <!-- 底部列表区 -->
      <div class="check-list">
        <div class="list-item" v-for="item in currentList" :key="item.id">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-desc">{{ item.desc }}</div>
          <div class="item-status" :class="item.status">
            <span>{{ getStatusText(item.status) }}</span>
            <img :src="getStatusIcon(item.status)" class="status-icon" :class="{ rotating: item.status === 'checking' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 报修确认弹窗 -->
    <div class="modal-overlay" v-if="confirmModal.isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">联系报修</div>
          <div class="close-btn" @click="closeConfirmModal">✕</div>
        </div>
        <div class="modal-body">
          拨打热线电话：400-889-9315
        </div>
        <div class="modal-footer">
          <div class="btn btn-cancel" :class="{ focused: localZone === 'confirm' && confirmIndex === 0 }">取消</div>
          <div class="btn btn-primary" :class="{ focused: localZone === 'confirm' && confirmIndex === 1 }">呼叫</div>
        </div>
      </div>
    </div>

    <!-- 语音通话弹窗 -->
    <CallModal 
      ref="callModalRef"
      :is-open="callModal.isOpen"
      :is-active="localZone === 'call'"
      title="联系报修"
      :target-info="{ number: '400-889-9315', group: '热线电话' }"
      @close="closeCallModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import CallModal from '../../components/CallModal.vue'

import DefaultIcon from '../../../assets/img/device/default.png'
import CheckingIcon from '../../../assets/img/device/selfChecking.png'
import NormalIcon from '../../../assets/img/device/normal.png'
import ExceptionIcon from '../../../assets/img/device/exception.png'

import MiniNormal from '../../../assets/img/device/miniNormal.png'
import MiniException from '../../../assets/img/device/miniException.png'
import IconRetry from '../../../assets/img/device/icon-retry.png'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['popup-open', 'popup-close', 'back'])
const activeZone = inject('activeZone') as any

// 状态机：'default' | 'checking' | 'normal' | 'exception'
const status = ref<'default' | 'checking' | 'normal' | 'exception'>('default')

// 焦点控制
const localZone = ref('content') // 'content', 'confirm', 'call'
const focusIndex = ref(0) 

// 报修弹窗
const confirmModal = reactive({ isOpen: false })
const confirmIndex = ref(1) // 0:取消, 1:呼叫

// 呼叫弹窗
const callModal = reactive({ isOpen: false })
const callModalRef = ref<any>(null)

// 进度与图表
const progress = ref(0)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let checkTimer: any = null

// 列表数据
const baseList = [
  { id: 'network_auth', name: '入网认证', desc: '设备于2026年1月12日被激活，已累计运行114天', status: 'pending' },
  { id: 'machine_run', name: '机器运行', desc: '', status: 'pending' },
  { id: 'network_conn', name: '网络连接', desc: '', status: 'pending' },
  { id: 'fault_check', name: '故障检测', desc: '', status: 'pending' }
]
const currentList = ref(JSON.parse(JSON.stringify(baseList)))

const statusTitle = ref('')

const getStatusText = (st: string) => {
  if (st === 'normal') return '正常'
  if (st === 'exception') return '异常'
  if (st === 'checking') return '检测中'
  if (st === 'pending') return '--'
  return ''
}

const getStatusIcon = (st: string) => {
  if (st === 'normal') return MiniNormal
  if (st === 'exception') return MiniException
  if (st === 'checking') return IconRetry
  return ''
}

// 图表渲染
const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return
  const option = {
    series: [
      {
        type: 'gauge',
        radius: '90%', // 扩大进度圈的半径，让它向外扩展贴合底图
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: '#14a4fc'
          }
        },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [[1, 'transparent']] // 隐藏底色，用背景图代替
          }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{
          value: progress.value,
          name: '设备自检进度',
          title: {
            offsetCenter: ['0%', '25%'],
            fontSize: 14,
            color: '#8fa0b5'
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-15%'],
            fontSize: 32,
            fontWeight: 'bold',
            color: '#fff',
            formatter: '{value}%'
          }
        }]
      }
    ]
  }
  chartInstance.setOption(option)
}

const startCheck = () => {
  status.value = 'checking'
  statusTitle.value = '正在自检，请耐心等待...'
  progress.value = 0
  focusIndex.value = 0
  currentList.value = JSON.parse(JSON.stringify(baseList))
  
  nextTick(() => {
    initChart()
  })

  // 模拟自检过程
  let step = 0
  checkTimer = setInterval(() => {
    progress.value += 5
    if (progress.value > 100) progress.value = 100
    updateChart()

    // 根据进度更新列表状态
    if (progress.value > 20 && step === 0) {
      currentList.value[0].status = 'normal'
      currentList.value[1].status = 'checking'
      step = 1
    } else if (progress.value > 50 && step === 1) {
      currentList.value[1].status = 'normal'
      currentList.value[2].status = 'checking'
      step = 2
    } else if (progress.value > 80 && step === 2) {
      // 随机决定是否异常 (为了演示，这里使用随机数)
      const isException = Math.random() > 0.5
      if (isException) {
        currentList.value[2].status = 'exception'
        currentList.value[3].status = 'exception'
        status.value = 'exception'
        statusTitle.value = '发现2项问题，可进行一键报修'
        clearInterval(checkTimer)
      } else {
        currentList.value[2].status = 'normal'
        currentList.value[3].status = 'checking'
        step = 3
      }
    } else if (progress.value === 100 && step === 3) {
      currentList.value[3].status = 'normal'
      status.value = 'normal'
      statusTitle.value = '自检完成，所检项均正常！'
      clearInterval(checkTimer)
    }
  }, 200)
}

const cancelCheck = () => {
  if (checkTimer) clearInterval(checkTimer)
  status.value = 'default'
  focusIndex.value = 0
}

// 弹窗控制
const openConfirmModal = () => {
  confirmModal.isOpen = true
  localZone.value = 'confirm'
  confirmIndex.value = 1
  emit('popup-open')
}

const closeConfirmModal = () => {
  confirmModal.isOpen = false
  localZone.value = 'content'
  emit('popup-close')
}

const openCallModal = () => {
  confirmModal.isOpen = false
  callModal.isOpen = true
  localZone.value = 'call'
  emit('popup-open') // 保持 popup 状态
}

const closeCallModal = () => {
  callModal.isOpen = false
  localZone.value = 'content'
  emit('popup-close')
}

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    localZone.value = 'content'
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
        if (confirmIndex.value === 0) closeConfirmModal()
        else openCallModal()
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

  if (props.isActive && localZone.value === 'content') {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (status.value === 'exception' && focusIndex.value === 1) {
        focusIndex.value = 0
      } else {
        emit('back')
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (status.value === 'exception' && focusIndex.value === 0) {
        focusIndex.value = 1
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (status.value === 'default') {
        startCheck()
      } else if (status.value === 'checking') {
        cancelCheck()
      } else if (status.value === 'normal') {
        startCheck()
      } else if (status.value === 'exception') {
        if (focusIndex.value === 0) startCheck()
        else openConfirmModal()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      emit('back')
    }
  }
}

onBeforeUnmount(() => {
  if (checkTimer) clearInterval(checkTimer)
  if (chartInstance) chartInstance.dispose()
})

defineExpose({ handleKeyDown })
</script>

<style scoped>
.device-check {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
}

/* 默认状态 */
.default-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-icon {
  width: 208px;
  height: 208px;
  object-fit: contain;
  margin-bottom: 48px;
}

.main-desc {
  font-size: 24px;
  color: #fff;
  margin-bottom: 116px;
}

/* 按钮通用 */
.action-btn {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 1);
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 18px;
  border: 2px solid transparent;
  min-width: 140px;
  text-align: center;
  transition: all 0.2s;
}

.action-btn.primary {
  background-color: #1a273b;
  color: #fff;
}

.action-btn.focused {
  border-color: #00bcd4;
  color: #fff;
  background-color: #1a273b;
}

/* 结果视图 */
.result-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
  box-sizing: border-box;
}

.top-info {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 50px;
  padding-left: 40px;
}

.icon-area {
  width: 208px;
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bg {
  width: 208px;
  height: 208px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.echarts-container {
  width: 100%;
  height: 100%;
}

.main-icon-small {
  width: 208px;
  height: 208px;
  object-fit: contain;
}

.text-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-title {
  font-size: 24px;
  color: #fff;
}

.btn-group {
  display: flex;
  gap: 20px;
}

/* 底部列表 */
.check-list {
  background-color: #1a273b;
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #2a3a52;
}

.list-item:last-child {
  border-bottom: none;
}

.item-name {
  width: 120px;
  font-size: 18px;
  color: #8fa0b5;
}

.item-desc {
  flex: 1;
  font-size: 16px;
  color: #8fa0b5;
}

.item-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.item-status.normal { color: #2ddc7f; }
.item-status.exception { color: #f44336; }
.item-status.checking { color: #8fa0b5; }
.item-status.pending { color: #4a5a72; opacity: 0; }

.status-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotating {
  animation: spin 2s linear infinite;
}

/* 弹窗通用样式 */
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

.modal-content {
  background-color: #1a273b;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  width: 400px;
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
  color: #8fa0b5;
  border-bottom-left-radius: 8px;
}

.btn-primary {
  background-color: #00bcd4;
  color: #fff;
  border-bottom-right-radius: 8px;
}

.btn.focused {
  border-color: #fff;
  filter: brightness(1.2);
}
</style>
