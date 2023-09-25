<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { parse } from 'yaml'

const router = useRouter()

const props = defineProps(['deploy'])

const workload_yaml = ref('')
const workload_obj = ref({})
const pods = ref([])
watch(
  () => props.deploy,
  (newV) => {
    if (newV) {
      const kc = props.deploy.k8s_type_config
      workload_yaml.value = kc.workload_config
      try {
        workload_obj.value = parse(kc.workload_config)
      } catch (error) {
        console.log(error)
      }

      let tempPods = []
      Object.keys(kc.pods).forEach((key) => {
        tempPods.push(parse(kc.pods[key]))
      })
      pods.value = tempPods

      console.log(pods.value)
    }
  },
  { immediate: true }
)

// const k8s_deployment = ref(parse())
// const pods = ref([])
// console.log(props.deploy.k8s_type_config.pods)
// props.deploy.k8s_type_config.pods.forEach((_, value) => {
//     pods.value.push(parse(value))
// })
// console.log(pods)
</script>

<template>
  <div v-if="deploy">
    <a-card style="margin-bottom: 12px" :bordered="true">
      <template #title>
        {{ deploy.name }}
        <span v-if="deploy.k8s_type_config">
          部署平台: {{ deploy.k8s_type_config.cluster_id }}
        </span>
        <span v-if="deploy.status">
          状态: {{ deploy.status.stage }}(<ShowTime :timestamp="deploy.status.update_at" />)
        </span>
      </template>
      <template #extra>
        <a-link>YAML</a-link>
        <a-link>详情</a-link>
      </template>

      <a-table class="pods" :bordered="false" :pagination="false" :data="pods">
        <template #columns>
          <a-table-column title="名称" data-index="metadata.name"></a-table-column>
          <a-table-column title="状态" data-index="status.phase"></a-table-column>
          <a-table-column title="启动时间" data-index="status.startTime"></a-table-column>
          <a-table-column title="Host IP" data-index="status.hostIP"></a-table-column>
          <a-table-column title="Pod IP" data-index="status.podIP"></a-table-column>
          <a-table-column align="center" title="操作" :width="200">
            <template #cell="{ record }">
              <a-button
                type="text"
                @click="
                  router.push({
                    name: 'ServiceLog',
                    query: { 
                      cluster_id: deploy.k8s_type_config.cluster_id,
                      namespace: record.metadata.namespace,
                      pod_name: record.metadata.name,
                     }
                  })
                "
              >
                <template #icon>
                  <icon-file />
                </template>
                日志
              </a-button>
              <a-button
                type="text"
                @click="
                  router.push({
                    name: 'ServiceConsole',
                    query: { 
                      cluster_id: deploy.k8s_type_config.cluster_id,
                      namespace: record.metadata.namespace,
                      pod_name: record.metadata.name,
                    }
                  })
                "
              >
                <template #icon>
                  <icon-desktop />
                </template>
                登录
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.pods :deep(.arco-table-th) {
  background-color: var(--color-neutral-2);
}
</style>
