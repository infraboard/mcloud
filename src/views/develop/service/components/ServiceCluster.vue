<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { onBeforeMount, ref } from 'vue'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'
import { useRouter } from 'vue-router'
import ServiceDeploy from './ServiceDeploy.vue'

const router = useRouter()
const serviceId = router.currentRoute.value.params.id

// 查询环境标签
const queryLoading = ref(false)
const envs = ref([])
const QueryEnv = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_LABEL({ keys: 'Env' })
    if (resp.items.length > 0) {
      envs.value = resp.items[0].enum_options
    }
  } catch (error) {
    Message.error(`查询标签失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

const currentEnv = ref('开发')
const clusters = ref({
  items: [],
  total: 1
})
const changeEnv = (v) => {
  currentEnv.value = v
  QueryCluster()
}

// 查询服务部署集群
const QueryCluster = async () => {
  try {
    queryLoading.value = true
    const listClusterReq = {
      service_ids: serviceId,
      filters: `Env=${currentEnv.value}`,
      with_deploy: true
    }
    clusters.value = await LIST_CLUSTER(listClusterReq)
  } catch (error) {
    Message.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onBeforeMount(async () => {
  await QueryEnv()
  await QueryCluster()
})
</script>

<template>
  <div class="page">
    <div class="header-item">
      <a-button type="outline" size="small">创建集群</a-button>
      <a-radio-group
        style="margin-left: auto"
        :model-value="currentEnv"
        @change="changeEnv"
        type="button"
      >
        <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
      </a-radio-group>
    </div>
    <div class="service-cluster">
      <a-empty v-if="clusters.total == 0" />
      <a-card
        class="cluster-item"
        :loading="queryLoading"
        v-for="item in clusters.items"
        :key="item.id"
      >
        <template #title>
          {{ item.name }}
          <span>创建于 <ShowTime :timestamp="item.create_at"></ShowTime></span>
        </template>
        <template #extra>
          <a-space>
            <span class="icon-hover"> <IconThumbUp /> </span>
            <span class="icon-hover"> <IconShareInternal /> </span>
            <span class="icon-hover"> <IconMore /> </span>
          </a-space>
        </template>

        <ServiceDeploy
          v-for="deploy in item.deployments.items"
          :key="deploy.id"
          :deploy="deploy"
        ></ServiceDeploy>
      </a-card>
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
