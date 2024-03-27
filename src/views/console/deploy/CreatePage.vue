<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CREATE_DEPLOY, DESCRIBE_DEPLOY, UPDATE_DEPLOY } from '@/api/mpaas/deploy'
import { Notification } from '@arco-design/web-vue'
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import SearchService from '../../../components/SearchService.vue'
import SearchK8s from '../../../components/SearchK8s.vue'

const router = useRouter()
const form = ref({
  service_id: '',
  service_name: '',
  type: 'KUBERNETES',
  name: '',
  describe: '',
  provider: 'default',
  region: 'default',
  cluster: router.currentRoute.value.query.cluster_id,
  environment: 'default',
  k8s_type_config: {
    cluster_id: '',
    workload_kind: 'Deployment',
    workload_config: '',
    service: ''
  },
  host_type_config: {},
  labels: {
    DeployGroup: 'green'
  }
})

let pageHeader = '创建部署'
let kind = router.currentRoute.value.query.kind
const id = router.currentRoute.value.query.id
const isCreate = id === undefined

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      switch (pageHeader) {
        case '创建部署':
          await CREATE_DEPLOY(data.values)
          Notification.success(`创建成功`)
          break
        default:
          await UPDATE_DEPLOY(id, data.values)
          Notification.success(`更新成功`)
          break
      }
      router.push({ name: 'ClusterDetail', params: {id: form.value.cluster} })
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
    pageHeader = '编辑部署'
    try {
      const resp = await DESCRIBE_DEPLOY(id)
      form.value = resp
    } catch (error) {
      Notification.error(`查询部署失败: ${error}`)
    }
  }
}

const queryLoading = ref(false)
const group = ref([])
const QueryGroup = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_LABEL({ keys: 'DeployGroup' })
    resp.items.forEach((element) => {
      switch (element.key) {
        case 'DeployGroup':
          group.value = element.enum_options
          break
      }
    })
  } catch (error) {
    Message.error(`查询标签失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onBeforeMount(async () => {
  QueryGroup()
  GetK8sCluster()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>
    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item
          v-if="kind == 'WORKLOAD'"
          field="service_id"
          label="服务"
          help="需要部署的服务, 请输入服务名称进行模糊搜索"
          required
        >
          <SearchService v-model="form.service_id" placeholder=""></SearchService>
        </a-form-item>
        <a-form-item
          v-if="kind == 'MIDDLEWARE'"
          field="service_name"
          label="服务名称"
          help="服务名称"
          required
        >
          <a-input v-model="form.service_name"></a-input>
        </a-form-item>
        <a-form-item field="name" label="名称" help="部署名称" required>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item field="describe" label="描述" help="部署描述" required>
          <a-input v-model="form.describe"></a-input>
        </a-form-item>
        <a-form-item
          field="labels.DeployGroup"
          label="部署分组"
          help="部署组, 用于多版本部署, 比如蓝绿部署"
          required=""
        >
          <a-radio-group v-model="form.labels.DeployGroup" type="button">
            <a-radio :value="g.value" v-for="g in group" :key="g.label">{{ g.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          field="type"
          label="部署方式"
          help="容器部署, 需要关联k8s集群, 虚拟机部署需要关联主机"
          required
        >
          <a-radio-group type="button" v-model="form.type">
            <a-radio value="KUBERNETES">容器部署</a-radio>
            <a-radio value="HOST">虚拟机部署</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-if="form.type === 'KUBERNETES'">
          <a-form-item
            field="k8s_type_config.cluster_id"
            label="部署集群"
            help="选择需要部署到那个k8s集群内"
            required
          >
            <SearchK8s v-model="form.k8s_type_config.cluster_id" placeholder=""></SearchK8s>
          </a-form-item>
          <a-divider orientation="center" type="dotted">部署配置</a-divider>
          <a-form-item field="k8s_type_config.workload_kind" label="部署类型" help="" required>
            <a-radio-group type="button" v-model="form.k8s_type_config.workload_kind">
              <a-radio value="Deployment">无状态部署</a-radio>
              <a-radio value="StatefulSet">有状态部署</a-radio>
              <a-radio value="DaemonSet">守护进程部署</a-radio>
              <a-radio value="Job">一次性任务</a-radio>
              <a-radio value="CronJob">定时任务</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            field="k8s_type_config.workload_config"
            label="部署配置"
            help="部署配置内容, YAML格式"
            required
          >
            <CodeEditor v-model="form.k8s_type_config.workload_config" language="yaml"></CodeEditor>
          </a-form-item>
          <a-form-item
            field="k8s_type_config.service"
            label="服务配置"
            help="服务配置内容, YAML格式"
          >
            <CodeEditor v-model="form.k8s_type_config.service" language="yaml"></CodeEditor>
          </a-form-item>
        </div>
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
