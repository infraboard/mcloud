<script setup>
import { app } from '@/stores/localstorage'
import TaskLogConsole from './components/TaskLogConsole.vue'
import TaskDebugConsole from './components/TaskDebugConsole.vue'
import JobTaskDetail from './components/TaskDetail.vue'
import { Notification } from '@arco-design/web-vue'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_JOB_TASK } from '@/api/mflow/task'

const router = useRouter()
const collapsed = ref(true)
const consoleType = ref('log')
const status = reactive({
  log: '等待连接',
  debug: '等待连接'
})
const color = reactive({
  等待连接: 'gray',
  连接中: 'blue',
  已连接: 'green',
  已关闭: 'orangered'
})
const reconect = ref(0)

// 查询详情
const taskId = router.currentRoute.value.params.id
const task = ref({})
const GetJob = async () => {
  try {
    task.value = await GET_JOB_TASK(taskId)
  } catch (error) {
    Notification.error(`查询Task详情失败: ${error}`)
  }
}

// 加载Task对象数据
onBeforeMount(async () => {
  await GetJob()
})
</script>

<template>
  <a-layout class="main">
    <a-layout>
      <a-layout-header class="header">
        <a-button :size="app.size" type="text" @click="router.go(-1)">
          <template #icon><icon-double-left /></template>
          执行记录
        </a-button>
        <a-radio-group type="button" v-model="consoleType" default-value="log">
          <a-radio value="log"><icon-file /> 日志</a-radio>
          <a-radio value="debug"><icon-desktop /> 调试</a-radio>
        </a-radio-group>
        <div class="console-status">
          <a-tag color="gray">状态</a-tag>
          <a-tag :color="color[status[consoleType]]" bordered>{{ status[consoleType] }}</a-tag>
          <a-button
            v-if="consoleType === 'debug'"
            style="margin-left: 8px"
            :disabled="status[consoleType] === '已连接'"
            :size="app.size"
            type="text"
            @click="reconect = new Date().getTime()"
          >
            <template #icon>
              <icon-refresh />
            </template>
            重新连接
          </a-button>
        </div>
        <div class="header-right">
          <a-radio-group type="button" v-model="app.xterm.theme" default-value="GitHub">
            <a-radio value="Solarized_Darcula"><icon-moon-fill /></a-radio>
            <a-radio value="GitHub"><icon-sun-fill /></a-radio>
          </a-radio-group>
          <div class="collapsed">
            <a-button
              class="collapsed-button-on"
              v-show="collapsed"
              shape="round"
              @click="collapsed = false"
            >
              <icon-left />
            </a-button>
            <a-button
              class="collapsed-button-off"
              v-show="!collapsed"
              shape="round"
              @click="collapsed = true"
            >
              <icon-right />
            </a-button>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content>
        <!-- 调试控制台 -->
        <KeepAlive>
          <TaskDebugConsole
            v-if="consoleType === 'debug'"
            :taskId="task.task_id"
            containerName=""
            height="calc(100vh - 46px - 45px)"
            :theme="app.xterm.theme"
            :reconect="reconect"
            @changed="
              (v) => {
                status.debug = v
              }
            "
          ></TaskDebugConsole>
        </KeepAlive>
        <!-- 日志控制台 -->
        <KeepAlive>
          <TaskLogConsole
            v-if="consoleType === 'log'"
            :taskId="task.task_id"
            containerName=""
            height="calc(100vh - 46px - 45px)"
            :theme="app.xterm.theme"
            @changed="
              (v) => {
                status.log = v
              }
            "
          ></TaskLogConsole>
        </KeepAlive>
      </a-layout-content>
    </a-layout>

    <a-layout-sider
      class="sider"
      collapsible
      default-collapsed
      reverse-arrow
      hide-trigger
      :width="320"
      :collapsed-width="0"
      :collapsed="collapsed"
    >
      <JobTaskDetail :task="task"></JobTaskDetail>
    </a-layout-sider>
  </a-layout>
</template>

<style scoped>
.header {
  height: 45px;
  display: flex;
  align-items: center;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.sider {
  display: flex;
  flex-direction: column-reverse;
  border-left: 1px solid rgb(229, 230, 235);
}

.collapsed-button-on {
  left: 15px;
  background-color: rgb(255 255 255);
}

.collapsed-button-off {
  left: 15px;
  background-color: rgb(255 255 255);
}

.console-status {
  display: flex;
  align-items: center;
}
</style>
