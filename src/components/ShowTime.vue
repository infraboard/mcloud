<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import * as isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.extend(isLeapYear)
dayjs.locale('zh-cn')
dayjs.extend(duration)

// 定义属性
const pros = defineProps({
  timestamp: { type: Number },
  isDuration: { type: Boolean, default: false }
})

const delta = dayjs.duration(pros.timestamp, 'seconds')
const showDelta = () => {
  let text = []
  let seconds = delta.seconds()
  if (seconds > 0) {
    text.push(`${seconds} 秒`)
  }
  let minutes = delta.minutes()
  if (minutes > 0) {
    text.push(`${minutes} 分`)
  }
  let day = delta.days()
  if (day > 0) {
    text.push(`${day} 天`)
  }
  return text.splice(0, 2).reverse().join(' ')
}
</script>

<template>
  <span v-if="isDuration">
    <span>
      {{ showDelta() }}
    </span>
  </span>
  <span v-else>{{ dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm') }}</span>
</template>
