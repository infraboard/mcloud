<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DESCRIBE_CLUSTER, CREATE_CLUSTER, UPDATE_CLUSTER } from '@/api/mpaas/cluster'
import { Notification } from '@arco-design/web-vue'
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import  SearchService from '../../../components/SearchService.vue'

const router = useRouter()
const form = ref({
  service_id: '',
  type: 'KUBERNETES',
  name: '',
  describe: '',
  provider: 'default',
  region: 'default',
  environment: 'default',
  labels: {Env: '开发'},
})

let pageHeader = '创建部署'
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
        <a-form-item field="service_id" label="服务" help="需要部署的服务, 请输入服务名称进行模糊搜索" required>
          <SearchService v-model="form.service_id" placeholder=""></SearchService>
        </a-form-item>
        <a-form-item field="type" label="部署方式" help="容器部署, 需要关联k8s集群, 虚拟机部署需要关联主机" required>
          <a-radio-group type="button" v-model="form.type">
            <a-radio value="KUBERNETES">容器部署</a-radio>
            <a-radio value="HOST">虚拟机部署</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="name" label="名称" help="部署名称" required>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item field="describe" label="描述" help="部署描述" required>
          <a-input v-model="form.describe"></a-input>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.go(-1)">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">确认</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
