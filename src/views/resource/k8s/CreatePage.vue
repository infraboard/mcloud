<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_K8S_CLUSTER, CREATE_K8S_CLUSTER, UPDATE_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { Notification } from '@arco-design/web-vue'

const router = useRouter()
const form = ref({
  provider: '自建',
  region: '本地',
  name: '',
  kube_config: '',
  description: ''
})

let pageHeader = '添加集群'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      switch (pageHeader) {
        case '添加集群':
          await CREATE_K8S_CLUSTER(data.values)
          Notification.success(`添加成功`)
          break
        default:
          await UPDATE_K8S_CLUSTER(id, data.values)
          Notification.success(`更新成功`)
          break
      }
      router.push({ name: 'K8sClusterList' })
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
      const resp = await GET_K8S_CLUSTER(id)
      form.value = resp
    } catch (error) {
      Notification.error(`查询集群失败: ${error}`)
    }
  }
}
onBeforeMount(async () => {
  GetK8sCluster()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="provider" label="提供商" help="集群提供商" required>
          <a-input v-model="form.provider"></a-input>
        </a-form-item>
        <a-form-item field="region" label="区域" help="集群所在区域" required>
          <a-input v-model="form.region"></a-input>
        </a-form-item>
        <a-form-item field="name" label="名称" help="集群名称" required>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item
          field="kube_config"
          label="凭证"
          help="集群访问凭证: KubeConfig, 存储路径: ~/.kube/config"
          required
        >
          <a-textarea v-model="form.kube_config" auto-size allow-clear />
        </a-form-item>
        <a-form-item field="description" label="描述" help="集群用途描述" required>
          <a-input v-model="form.description"></a-input>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'K8sClusterList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
