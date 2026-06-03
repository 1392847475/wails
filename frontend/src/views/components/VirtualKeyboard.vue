<template>
  <div class="keyboard-overlay" v-if="isActive">
    <!-- 拼音缓冲区与候选词区 -->
    <div class="ime-bar" v-if="pinyinBuffer || candidates.length > 0">
      <div class="pinyin-buffer">{{ pinyinBuffer }}</div>
      <div class="candidates-row" v-if="candidates.length > 0">
        <div class="page-btn" :class="{ disabled: currentPage === 0 }">&lt;</div>
        <div 
          class="candidate-item" 
          v-for="(cand, idx) in displayedCandidates" 
          :key="idx"
          :class="{ focused: activeZone === 'candidates' && candidateIndex === idx }"
        >
          <span class="cand-idx">{{ idx + 1 }}.</span> {{ cand.word }}
        </div>
        <div class="page-btn" :class="{ disabled: (currentPage + 1) * pageSize >= candidates.length }">&gt;</div>
      </div>
    </div>

    <div class="keyboard-container">
      <div class="keyboard-row" v-for="(row, rIdx) in currentKeyboardKeys" :key="rIdx">
        <div 
          class="key-btn" 
          v-for="(key, cIdx) in row" 
          :key="key"
          :class="{ 
            focused: activeZone === 'keyboard' && kbRow === rIdx && kbCol === cIdx, 
            special: key === 'Space' || key === 'Backspace' || key === 'Enter' || key === 'Caps'
          }"
        >
          {{ key === 'Space' ? '空格' : (key === 'Backspace' ? '退格' : (key === 'Enter' ? '完成' : (key === 'Caps' ? (isCaps ? '大写' : '小写') : key))) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { createPinyinEngine } from 'pinyin-ime'
import { dict } from 'pinyin-ime/dictionary/google_pinyin_dict'

const engine = createPinyinEngine(dict)

const props = defineProps({
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['input', 'backspace', 'close'])

const activeZone = ref('keyboard') // 'keyboard' | 'candidates'
const kbRow = ref(0)
const kbCol = ref(0)
const candidateIndex = ref(0)
const isCaps = ref(false)

const pinyinBuffer = ref('')
const candidates = ref<any[]>([])
const currentPage = ref(0)
const pageSize = 8

const displayedCandidates = computed(() => {
  const start = currentPage.value * pageSize
  return candidates.value.slice(start, start + pageSize)
})

const keyboardKeysLower = [
  ['1','2','3','4','5','6','7','8','9','0','Backspace'],
  ['q','w','e','r','t','y','u','i','o','p', '-'],
  ['a','s','d','f','g','h','j','k','l', ':', '/'],
  ['Caps', 'z','x','c','v','b','n','m','.', 'Space','Enter']
]

const keyboardKeysUpper = [
  ['1','2','3','4','5','6','7','8','9','0','Backspace'],
  ['Q','W','E','R','T','Y','U','I','O','P', '-'],
  ['A','S','D','F','G','H','J','K','L', ':', '/'],
  ['Caps', 'Z','X','C','V','B','N','M','.', 'Space','Enter']
]

const currentKeyboardKeys = computed(() => isCaps.value ? keyboardKeysUpper : keyboardKeysLower)

// 当组件被激活时，重置状态
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    activeZone.value = 'keyboard'
    kbRow.value = 0
    kbCol.value = 0
    isCaps.value = false
    pinyinBuffer.value = ''
    candidates.value = []
  }
})

// 监听拼音输入，获取候选词
watch(pinyinBuffer, (val) => {
  if (val) {
    const res = engine.getCandidates(val.replace(/'/g, '')) // 简单处理
    candidates.value = res.candidates || []
  } else {
    candidates.value = []
  }
  currentPage.value = 0
  if (candidates.value.length === 0 && activeZone.value === 'candidates') {
    activeZone.value = 'keyboard'
  }
  candidateIndex.value = 0
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isActive) return

  if (activeZone.value === 'keyboard') {
    const keys = currentKeyboardKeys.value
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (kbRow.value > 0) {
        kbRow.value--
        if (kbCol.value >= keys[kbRow.value].length) {
          kbCol.value = keys[kbRow.value].length - 1
        }
      } else if (displayedCandidates.value.length > 0) {
        activeZone.value = 'candidates'
        candidateIndex.value = 0
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (kbRow.value < keys.length - 1) {
        kbRow.value++
        if (kbCol.value >= keys[kbRow.value].length) {
          kbCol.value = keys[kbRow.value].length - 1
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (kbCol.value > 0) kbCol.value--
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (kbCol.value < keys[kbRow.value].length - 1) kbCol.value++
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const key = keys[kbRow.value][kbCol.value]
      handleKeyPress(key)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      emit('close')
    }
  } else if (activeZone.value === 'candidates') {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (candidateIndex.value > 0) {
        candidateIndex.value--
      } else if (currentPage.value > 0) {
        currentPage.value--
        candidateIndex.value = displayedCandidates.value.length - 1
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (candidateIndex.value < displayedCandidates.value.length - 1) {
        candidateIndex.value++
      } else if ((currentPage.value + 1) * pageSize < candidates.value.length) {
        currentPage.value++
        candidateIndex.value = 0
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeZone.value = 'keyboard'
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectCandidate(candidateIndex.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      activeZone.value = 'keyboard'
    }
  }
}

const handleKeyPress = (key: string) => {
  if (key === 'Enter') {
    if (pinyinBuffer.value) {
      // 缓冲区有内容时按完成，将拼音直接上屏
      emit('input', pinyinBuffer.value)
      pinyinBuffer.value = ''
    } else {
      emit('close')
    }
  } else if (key === 'Backspace') {
    if (pinyinBuffer.value) {
      pinyinBuffer.value = pinyinBuffer.value.slice(0, -1)
    } else {
      emit('backspace')
    }
  } else if (key === 'Space') {
    if (pinyinBuffer.value && displayedCandidates.value.length > 0) {
      selectCandidate(0)
    } else {
      emit('input', ' ')
    }
  } else if (key === 'Caps') {
    isCaps.value = !isCaps.value
  } else {
    // 字母、数字和符号
    if (/[a-zA-Z]/.test(key) && key.length === 1) {
      // 如果是大写字母，且没有拼音缓冲区，直接上屏
      // 如果是小写字母，进入拼音缓冲区
      if (isCaps.value) {
        emit('input', key)
      } else {
        pinyinBuffer.value += key
      }
    } else if (/[0-9]/.test(key)) {
      if (pinyinBuffer.value && displayedCandidates.value.length > 0) {
        const idx = parseInt(key) - 1
        // 数字1-9选择候选词
        if (idx >= 0 && idx < displayedCandidates.value.length) {
           selectCandidate(idx)
           return
        }
      }
      emit('input', key)
    } else {
      // 符号: . : - /
      emit('input', key)
    }
  }
}

const selectCandidate = (idx: number) => {
  const cand = displayedCandidates.value[idx]
  if (cand) {
    emit('input', cand.word)
    if (cand.matchedLength && cand.matchedLength < pinyinBuffer.value.length) {
      pinyinBuffer.value = pinyinBuffer.value.slice(cand.matchedLength)
      activeZone.value = 'keyboard'
    } else {
      pinyinBuffer.value = ''
      activeZone.value = 'keyboard'
    }
  }
}

defineExpose({ handleKeyDown })
</script>

<style scoped>
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

.ime-bar {
  width: 80%;
  max-width: 800px;
  background-color: #0b1526;
  border: 1px solid #2a3a52;
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pinyin-buffer {
  color: #8fa0b5;
  font-size: 16px;
  letter-spacing: 1px;
}

.candidates-row {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 40px;
}

.page-btn {
  color: #8fa0b5;
  font-size: 20px;
  font-weight: bold;
  padding: 5px 10px;
  cursor: default;
}

.page-btn.disabled {
  opacity: 0.3;
}

.candidate-item {
  color: #fff;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid transparent;
}

.candidate-item.focused {
  background-color: #3a4a62;
  border-color: #00bcd4;
}

.cand-idx {
  color: #8fa0b5;
  font-size: 14px;
  margin-right: 5px;
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
  font-size: 18px;
}

.key-btn.special {
  padding: 15px 30px;
  font-size: 16px;
}

.key-btn.focused {
  border-color: #00bcd4;
  background-color: #3a4a62;
}
</style>
