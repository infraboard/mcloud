<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = router.currentRoute.value.query

// Tab 列表
const consoleType = ref('log')
const logOption = reactive({
  cluster_id: query.cluster_id,
  namespace: query.namespace,
  pod_name: query.pod_name,
  container_name: ''
})

// 更新数据
const ts = ref(0)
watch(
  () => router.currentRoute.value.query,
  (newV) => {
    if (newV && newV.cluster_id && newV.namespace && newV.pod_name) {
      logOption.cluster_id = newV.cluster_id
      logOption.namespace = newV.namespace
      logOption.pod_name = newV.pod_name
      ts.value = new Date().getTime()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <a-space class="headline">
      <!-- <a-space>
        <a-button type="outline" size="small">
          <template #icon>
            <icon-tool />
          </template>
          工具箱
        </a-button>
      </a-space> -->
      <a-space>
        <a-radio-group size="small" type="button" v-model="consoleType" default-value="log">
          <a-radio value="log"><icon-file /> 日志</a-radio>
          <a-radio value="console"><icon-desktop /> 控制台</a-radio>
        </a-radio-group>
      </a-space>
    </a-space>

    <PodLog
      v-if="consoleType === 'log'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 260px)'"
      :height="'calc(100vh - 80px)'"
    ></PodLog>
    <PodConsole
      v-if="consoleType === 'console'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 260px)'"
      :height="'calc(100vh - 80px)'"
    ></PodConsole>
  </div>
</template>

<style scoped>
.headline {
  height: 40px;
  padding: 0 12px;
}
</style>
