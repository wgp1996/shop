<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['东昌府区', '阳谷县', '莘县', '东阿县', '冠县', '荏平县', '临清市'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '追溯有效性',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 77, 88, 52, 47, 99],
          animationDuration
        }, {
          name: '追溯合理性',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 45, 58, 50, 48, 66],
          animationDuration
        }, {
          name: '追溯时效性',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 28, 39, 50, 78, 80],
          animationDuration
        }]
      })
    }
  }
}
</script>
