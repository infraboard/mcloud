<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DESCRIBE_CLUSTER, CREATE_CLUSTER, UPDATE_CLUSTER } from '@/api/mpaas/cluster'
import { Notification } from '@arco-design/web-vue'
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const form = ref({
  kind: 'WORKLOAD',
  name: '',
  describe: '',
  labels: {Env: '开发'},
})

let pageHeader = '创建集群'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      switch (pageHeader) {
        case '创建集群':
          await CREATE_CLUSTER(data.values)
          Notification.success(`创建成功`)
          break
        default:
          await UPDATE_CLUSTER(id, data.values)
          Notification.success(`更新成功`)
          break
      }
      router.push({ name: 'ServiceClusterList' })
    } catch (error) {
      Notification.error(`保存失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}

// 判断更新模式
const GetK8sCluster = async () => {
  if (!isCreate) {
    pageHeader = '编辑集群'
    try {
      const resp = await DESCRIBE_CLUSTER(id)
      form.value = resp
    } catch (error) {
      Notification.error(`查询集群失败: ${error}`)
    }
  }
}

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

onBeforeMount(async () => {
  QueryEnv()
  GetK8sCluster()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <!-- 环境 -->
        <a-form-item field="labels.Env" label="环境" help="集群所属环境">
          <a-radio-group class="env" v-model="form.labels.Env" type="button">
            <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="kind" label="类型" help="工作负载需要关联应用，中间件不需要关联">
          <a-radio-group type="button" v-model="form.kind">
            <a-radio value="WORKLOAD">工作负载</a-radio>
            <a-radio value="MIDDLEWARE">中间件</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="name" label="名称" help="集群名称" required>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item field="describe" label="描述" help="集群用途描述" required>
          <a-input v-model="form.describe"></a-input>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'ServiceClusterList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">确认</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
