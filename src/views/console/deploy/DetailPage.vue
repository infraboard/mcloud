<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { parse } from 'yaml'
import { DESCRIBE_DEPLOY } from '@/api/mpaas/deploy'
import { onBeforeMount } from 'vue'

const router = useRouter()

// 查询集群详情
const deploy = ref({})
const workload_yaml = ref('')
const workload_obj = ref({})
const service = ref({ spec: { ports: [] } })
const pods = ref([])
const GetDeploy = async () => {
  try {
    deploy.value = await DESCRIBE_DEPLOY(router.currentRoute.value.params.id)
    const kc = deploy.value.k8s_type_config
    workload_yaml.value = kc.workload_config
    try {
      workload_obj.value = parse(kc.workload_config)
      service.value = parse(kc.service)
    } catch (error) {
      console.log(error)
    }

    let tempPods = []
    Object.keys(kc.pods).forEach((key) => {
      tempPods.push(parse(kc.pods[key]))
    })
    pods.value = tempPods
  } catch (error) {
    Message.error(`查询部署失败: ${error}`)
  }
}
const showAccessPort = () => {
  const ports = []
  console.log(service.value)
  if (service.value) {
    service.value.spec.ports.forEach((element) => {
      ports.push(`${element.protocol} | ${service.value.spec.clusterIP}:${element.port}`)
    })
  }

  return ports
}

// 加载数据
onBeforeMount(async () => {
  await GetDeploy()
})

watch(
  () => router.currentRoute.value.fullPath,
  async () => {
    if (router.currentRoute.value.name === 'DeployDetail') {
      await GetDeploy()
    }
  }
)
</script>

<template>
  <div class="page">
    <div class="operate-header f12">
      <a-space>
        {{ deploy.name }}
        <span v-if="deploy.k8s_type_config">
          部署平台: {{ deploy.k8s_type_config.cluster_id }}
        </span>
        <span v-if="deploy.status">
          状态: {{ deploy.status.stage }}(<ShowTime :timestamp="deploy.status.update_at" />)
        </span>
        <span v-if="service"> 服务访问地址: </span>
        <a-tag v-for="(port, index) of showAccessPort()" :key="index" color="green" bordered>{{
          port
        }}</a-tag>
      </a-space>
      <a-space>
        <a-link>YAML</a-link>
        <a-link>详情</a-link>
      </a-space>
    </div>
    <a-table class="pods" :bordered="true" :pagination="false" :data="pods">
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
                  name: 'ServiceTerminal',
                  query: {
                    cluster_id: deploy.k8s_type_config.cluster_id,
                    namespace: record.metadata.namespace,
                    pod_name: record.metadata.name,
                    tab: 'log'
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
                  name: 'ServiceTerminal',
                  query: {
                    cluster_id: deploy.k8s_type_config.cluster_id,
                    namespace: record.metadata.namespace,
                    pod_name: record.metadata.name,
                    tab: 'console'
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
  </div>
</template>

<style scoped>
.pods :deep(.arco-table-th) {
  background-color: var(--color-neutral-2);
}
</style>
