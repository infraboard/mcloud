<script setup>
// 定义属性
const pros = defineProps({
  timestamp: { type: Number },
  isDuration: { type: Boolean, default: false }
})

const showDelta = () => {
    let timeString = "";
    let seconds = pros.timestamp
    if(seconds >= 86400) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        timeString = `${days}天${hours}小时`;
    } else if(seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        timeString = `${hours}小时${minutes}分钟`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeString = `${minutes}分钟${remainingSeconds}秒`;
    }
    return timeString;
}
const showTime = () => {
  // 创建一个 Date 对象
  let date = new Date(pros.timestamp * 1000)

  // 获取年、月、日、时、分
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')
  let hours = String(date.getHours()).padStart(2, '0')
  let minutes = String(date.getMinutes()).padStart(2, '0')

  // 格式化时间为 YYYY-MM-DD HH:mm
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<template>
  <span v-if="isDuration">
    <span>
      {{ showDelta() }}
    </span>
  </span>
  <span v-else>{{ showTime() }}</span>
</template>
