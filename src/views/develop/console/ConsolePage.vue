<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import  DocumentPage  from './components/DocumentPage.vue'

const router = useRouter()

const logOption = reactive({
  cluster_id: '',
  namespace: '',
  pod_name: '',
  container_name: ''
})
const consoleType = ref('log')

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
    consoleType.value = newV.tab
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <PodLog
      v-if="consoleType === 'log'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 260px)'"
      :height="'calc(100vh - 40px)'"
    ></PodLog>
    <PodConsole
      v-if="consoleType === 'console'"
      :key="ts"
      :option="logOption"
      :width="'calc(100vw - 260px)'"
      :height="'calc(100vh - 40px)'"
    ></PodConsole>
    <DocumentPage  v-if="!consoleType">
    </DocumentPage>
  </div>
</template>

<style scoped></style>
