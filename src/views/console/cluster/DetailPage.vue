<script setup>
import { Message } from '@arco-design/web-vue'
import { onBeforeMount, ref, watch } from 'vue'
import { DESCRIBE_CLUSTER } from '@/api/mpaas/cluster'
import { useRouter } from 'vue-router'

const router = useRouter()

// 查询环境标签
const queryLoading = ref(false)
const cluster = ref({})

// 查询服务部署集群
const GetCluster = async () => {
  try {
    queryLoading.value = true
    cluster.value = await DESCRIBE_CLUSTER(router.currentRoute.value.params.id)
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
    <div class="service-cluster">
      {{ cluster.name }}
      <span>创建于 <ShowTime :timestamp="cluster.create_at"></ShowTime></span>
      <a-button type="text" @click="$router.push({name: 'CreateDeploy', query: {cluser_id: $route.params.id}})" size="mini">创建部署</a-button>
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
</style>
