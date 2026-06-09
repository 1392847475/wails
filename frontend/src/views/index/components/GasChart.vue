<template>
  <div ref="chartRef" class="gas-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array as () => number[],
    default: () => []
  },
  color: {
    type: String,
    default: '#00e5ff'
  }
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 'dataMin',
      max: 'dataMax'
    },
    series: [
      {
        data: props.data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: props.color,
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: props.color.replace('1)', '0.5)') }, // 50% opacity
            { offset: 1, color: props.color.replace('1)', '0)') }    // 0% opacity
          ])
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

watch(() => [props.data, props.color], () => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [{
        data: props.data,
        lineStyle: { color: props.color },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: props.color.replace('1)', '0.5)') },
            { offset: 1, color: props.color.replace('1)', '0)') }
          ])
        }
      }]
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
.gas-chart {
  width: 100%;
  height: 100%;
}
</style>
