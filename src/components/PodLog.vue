<script setup>
import 'xterm/css/xterm.css'
import { app } from '@/stores/localstorage'
import { Terminal } from 'xterm'
import { GitHub, Solarized_Darcula, GetTermSize } from '@/tools/term'
import { onMounted, watch } from 'vue'

// 声明属性
const props = defineProps({
  option: {
    type: Object,
    default: () => {
      return {
        cluster_id: '',
        namespace: '',
        pod_name: '',
        container_name: ''
      }
    }
  },
  height: { type: String, default: '750px' },
  width: { type: String, default: '100%' },
  // GitHub Solarized_Darcula
  theme: { type: String, default: 'Solarized_Darcula' }
})

// 声明事件
const emit = defineEmits(['changed'])

// 计算属性
const getTheme = (theme) => {
  switch (theme) {
    case 'GitHub':
      return GitHub
    default:
      return Solarized_Darcula
  }
}

// 终端对象
var term = new Terminal({
  theme: getTheme(props.theme),
  fontSize: 13,
  convertEol: true,
  disableStdin: true
})

const connect = () => {
  emit('changed', '连接中')

  let socket = new WebSocket(
    `ws://127.0.0.1:8080/mpaas/api/v1/proxy/${props.option.cluster_id}/pods/${props.option.pod_name}/log?mcenter_access_token=${app.value.token.access_token}`
  )

  socket.onopen = function () {
    emit('changed', '已连接')
    socket.send(JSON.stringify(props.option))
  }
  socket.onmessage = function (event) {
    if (event.data instanceof Blob) {
      // 数据
      let reader = new FileReader()
      reader.onload = (e) => {
        term.write(e.target.result)
      }
      reader.readAsText(event.data)
    } else {
      // 指令响应
      console.log(event.data)
    }
  }
  socket.onclose = function (event) {
    emit('changed', '已关闭')
    if (event.wasClean) {
      term.write(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
    } else {
      term.write('[close] Connection died')
    }
  }
  socket.onerror = function () {
    term.write(`error, `)
  }
}

// 调整窗口
const fitSize = () => {
  var geometry = GetTermSize(term)
  term.resize(geometry.cols, geometry.rows)
}

onMounted(() => {
  // 初始化终端
  term.open(document.getElementById('task-log-terminal'))

  // 及时适配窗口
  fitSize()
  // 监听窗口变化
  window.onresize = fitSize
})

// 终端修改
watch(
  () => props.theme,
  (newV) => {
    term.options.theme = getTheme(newV)
  }
)

// 连接
watch(
  () => props.option,
  (newV) => {
    if (newV && newV.cluster_id && newV.namespace && newV.pod_name) {
      // 连接终端
      connect()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="task-log-terminal" :style="{ height, width, backgroundColor: theme.background }"></div>
</template>
