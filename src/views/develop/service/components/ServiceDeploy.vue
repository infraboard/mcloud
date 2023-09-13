<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { onMounted, ref } from 'vue'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'

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
const changeEnv = (v) => {
  currentEnv.value = v
  QueryCluster()
}

// 查询服务部署集群
const QueryCluster = async () => {
  try {
    queryLoading.value = true
    const listClusterReq = {label: `Env=${currentEnv.value}`}
    var resp = await LIST_CLUSTER(listClusterReq)
    console.log(resp)
  } catch (error) {
    Message.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onMounted(async () => {
  await QueryEnv()
  await QueryCluster()
})
</script>

<template>
  <div class="page">
    <div>
      <a-radio-group :model-value="currentEnv" @change="changeEnv" type="button">
        <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
      </a-radio-group>
      <a-button type="outline" size="small" style="margin-left: 12px">创建集群</a-button>
    </div>
    <div class="service-cluster">
      <a-card :loading="queryLoading">
        <template #title> 集群A </template>
        <template #extra>
          <a-space>
            <span class="icon-hover"> <IconThumbUp /> </span>
            <span class="icon-hover"> <IconShareInternal /> </span>
            <span class="icon-hover"> <IconMore /> </span>
          </a-space>
        </template>

        <a-card style="margin-bottom: 12px;" title="Arco Card" :bordered="true">
          <template #extra>
            <a-link>More</a-link>
          </template>
          Card content
          <br />
          Card content
        </a-card>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.page :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}

.service-cluster {
  margin-top: 12px;
}
</style>
