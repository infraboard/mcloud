<script setup>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { GitHub, Solarized_Darcula, GetTermSize, HeartCheck } from '@/tools/term'
import { onMounted, watch } from 'vue'

// 声明属性
const props = defineProps({
  taskId: { type: String, default: '', required: true },
  containerName: { type: String, default: '', required: true },
  height: { type: String, default: '750px' },
  width: { type: String, default: '100%' },
  // 'GitHub' Solarized_Darcula
  theme: { type: String, default: 'Solarized_Darcula' },
  // 是否重连，0表示不重连
  reconect: { type: Number, default: 0 }
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
  disableStdin: false
})

var socket = undefined
// 调整窗口
const fitSize = () => {
  var geometry = GetTermSize(term)
  term.resize(geometry.cols, geometry.rows)
  if (socket && socket.readyState === 1) {
    socket.send(
      JSON.stringify({ command: 'resize', params: { width: geometry.cols, heigh: geometry.rows } })
    )
  }
}

// 连接socket
const connect = () => {
  emit('changed', '连接中')

  socket = new WebSocket(`ws://${location.host}/mflow/api/v1/ws/job_tasks/${props.taskId}/debug`)
  //心跳检测
  var heartCheck = HeartCheck(socket)

  socket.onopen = function () {
    emit('changed', '已连接')
    socket.send(JSON.stringify({ task_id: props.taskId, container_name: props.containerName }))
    // 调整窗口大小
    fitSize()
  }
  socket.onmessage = function (event) {
    //如果获取到消息，心跳检测重置, 拿到任何消息都说明当前连接是正常的
    heartCheck.reset().start()

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
    heartCheck.reset()
    if (event.wasClean) {
      term.write(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      term.write('[close] Connection died')
    }
  }
  socket.onerror = function () {
    term.write(`error, `)
  }
}

onMounted(() => {
  // 初始化终端
  term.open(document.getElementById('task-debug-terminal'))

  // 及时适配窗口
  fitSize()
  // 监听窗口变化
  window.onresize = fitSize

  // 终端设置
  term.onData((send) => {
    // 数据都使用bytes
    const encoder = new TextEncoder()
    const arrayBuffer = encoder.encode(send).buffer
    socket.send(arrayBuffer)
  })
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
  () => props.taskId,
  (newV) => {
    if (newV) {
      // 连接终端
      connect()
    }
  },
  { immediate: true }
)

// 重新连接
watch(
  () => props.reconect,
  (newV) => {
    if (newV) {
      // 关闭之前的socket
      if (socket) {
        socket.close(1000, 'reconect')
      }
      // 清除屏幕
      term.clear()
      // 连接终端
      connect()
    }
  }
)
</script>

<template>
  <div id="task-debug-terminal" :style="{ height, width, backgroundColor: theme.background }"></div>
</template>
