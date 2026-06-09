<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array as () => any[],
    default: () => []
  }
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    grid: {
      left: '40px',
      right: '20px',
      top: '20px',
      bottom: '30px'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.time),
      axisLine: {
        lineStyle: { color: '#2a3a52' }
      },
      axisLabel: {
        color: '#8fa0b5'
      },
      splitLine: {
        show: true,
        lineStyle: { color: '#1f2d40', type: 'dashed' }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8fa0b5'
      },
      splitLine: {
        show: true,
        lineStyle: { color: '#1f2d40' }
      }
    },
    visualMap: {
      show: false,
      pieces: [
        { gt: 0, lte: 40, color: '#f44336' }, // Danger (red)
        { gt: 40, lte: 70, color: '#ffeb3b' }, // Warning (yellow)
        { gt: 70, color: '#00e5ff' } // Normal (cyan/green)
      ],
      outOfRange: {
        color: '#999'
      }
    },
    series: [
      {
        data: props.data.map(item => item.value),
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#1a273b'
        },
        lineStyle: {
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 188, 212, 0.4)' },
            { offset: 1, color: 'rgba(0, 188, 212, 0)' }
          ])
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#ffeb3b',
            type: 'dashed'
          },
          data: [{ yAxis: 50 }]
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption({
      xAxis: { data: props.data.map(item => item.time) },
      series: [{ data: props.data.map(item => item.value) }]
    })
  }
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}
</script>

<style scoped>
.trend-chart {
  width: 100%;
  height: 100%;
}
</style>
