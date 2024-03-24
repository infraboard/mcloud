<script setup>
import { Message } from '@arco-design/web-vue'
import { onBeforeMount, ref, watch } from 'vue'
import { DESCRIBE_CLUSTER } from '@/api/mpaas/cluster'
import { useRouter } from 'vue-router'

const router = useRouter()

// 查询环境标签
const queryLoading = ref(false)
const cluster = ref({
  deployments: {items: [], totoal: 0}
})

// 查询服务部署集群
const GetCluster = async () => {
  try {
    queryLoading.value = true
    const id = router.currentRoute.value.params.id
    cluster.value = await DESCRIBE_CLUSTER(id, {with_deploy: true})
  } catch (error) {
    Message.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onBeforeMount(async () => {
  await GetCluster()
})

watch(
  () => router.currentRoute.value.fullPath,
  async () => {
    if (router.currentRoute.value.name === 'ClusterDetail') {
      await GetCluster()
    }
  }
)
</script>

<template>
  <div class="page">
    <div class="service-cluster f12">
      {{ cluster.name }}
      <span>创建于 <ShowTime :timestamp="cluster.create_at"></ShowTime></span>
      <a-button type="text" @click="$router.push({name: 'CreateDeploy', query: {cluster_id: $route.params.id, kind: cluster.kind}})" size="mini">
        创建部署
      </a-button>
      <!-- 部署列表 -->
      <a-table class="deployments" :bordered="true" :pagination="false" :data="cluster.deployments.items">
        <template #columns>
        <a-table-column title="名称" data-index="name"></a-table-column>
        <a-table-column title="服务版本" >
          <template #cell="{ record }">
            {{ record.service_name }}:{{ record.service_version }}
          </template>
        </a-table-column>
        <a-table-column title="部署分组">
            <template #cell="{ record }">
              {{ record.labels.DeployGroup }}
            </template>
          </a-table-column>
        <a-table-column title="状态" >
          <template #cell="{ record }">
            {{ record.status.stage }}
            (<ShowTime :timestamp="record.status.update_at" />)
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <a-button type="text"> {{ record.id }} </a-button>
          </template>
        </a-table-column>
      </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.page :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}

.header-item {
  display: flex;
}

.service-cluster {
  margin-top: 12px;
}

.cluster-item {
  margin-bottom: 12px;
}

.deployments :deep(.arco-table-th) {
  background-color: var(--color-neutral-2);
}
</style>
