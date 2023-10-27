<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'

const router = useRouter()
const query = router.currentRoute.value.query

// Tab 列表
const consoleType = ref(query.tag)
const logOption = reactive({
  cluster_id: query.cluster_id,
  namespace: query.namespace,
  pod_name: query.pod_name,
  container_name: ''
})
if (!consoleType.value) {
  consoleType.value = 'log'
}

// 更新数据
const ts = ref(0)
watch(
  () => router.currentRoute.value.query,
  (newV) => {
    if (newV && newV.cluster_id && newV.namespace && newV.pod_name) {
      logOption.cluster_id = newV.cluster_id
      logOption.namespace = newV.namespace
      logOption.pod_name = newV.pod_name
      if (newV.tab) {
        consoleType.value = newV.tab
        console.log(consoleType.value)
      }
      ts.value = new Date().getTime()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="content">
    <div class="headline">
      <a-space>
        <a-radio-group size="mini" type="button" v-model="consoleType" default-value="log">
          <a-radio value="log"><icon-file /> 日志</a-radio>
          <a-radio value="console"><icon-desktop /> 控制台</a-radio>
        </a-radio-group>
        <a-button type="text" size="mini">
          <template #icon>
            <icon-tool />
          </template>
          工具箱
        </a-button>
      </a-space>
      <a-space>
        <a-radio-group size="mini" type="button" v-model="app.xterm.theme" default-value="GitHub">
          <a-radio value="Solarized_Darcula"><icon-moon-fill /></a-radio>
          <a-radio value="GitHub"><icon-sun-fill /></a-radio>
        </a-radio-group>
      </a-space>
    </div>

    <PodLog
      v-if="consoleType === 'log'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 272px)'"
      :height="'calc(100vh - 80px)'"
      :theme="app.xterm.theme"
    ></PodLog>
    <PodConsole
      v-if="consoleType === 'console'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 272px)'"
      :height="'calc(100vh - 80px)'"
      :theme="app.xterm.theme"
    ></PodConsole>
  </div>
</template>

<style scoped>
.headline {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.content {
  padding: 0px 6px;
}
</style>
