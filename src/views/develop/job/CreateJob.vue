<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_JOB, CREATE_JOB } from '@/api/mflow/job'
import { Notification } from '@arco-design/web-vue'

const router = useRouter()
const runner_attr = ref('runner_spec')
const form = ref({
  name: '',
  display_name: '',
  description: '',
  runner_type: 'K8S_JOB',
  runner_spec: '',
  run_params: {
    ignore_failed: false,
    dry_run: false,
    params: []
  }
})

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      let resp = await CREATE_JOB(data.values)
      console.log(resp)
      router.push({ name: 'DomainJobList' })
    } catch (error) {
      Notification.error(`保存失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}

// 判断更新模式
let pageHeader = '创建Job'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined
const GetJob = async () => {
  if (!isCreate) {
    pageHeader = '编辑Job'
    try {
      form.value = await GET_JOB(id)
    } catch (error) {
      Notification.error(`查询Job失败: ${error}`)
    }
  }
}

onBeforeMount(async () => {
  await GetJob()
})

// 添加参数
const addParam = (name = '') => {
  // 判断有没有该值, 如果没有则添加
  const hasObject = form.value.run_params.params.some((obj) => obj.name === name)
  if (!hasObject) {
    form.value.run_params.params.push({
      required: false,
      usage_type: 'ENV',
      name: name,
      read_only: false,
      name_desc: '',
      value_type: 'TEXT',
      enum_options: [],
      http_enum_config: {},
      example: '',
      value: '',
      value_desc: '',
      param_scope: {},
      search_label: false,
      is_sensitive: false,
      deprecate: false,
      deprecate_desc: '',
      extensions: {}
    })
  }
}
const k8sRunnerParams = [
  {
    required: true,
    usage_type: 'ENV',
    name: 'kube_config',
    read_only: false,
    name_desc: '用于运行k8s job的访问配置',
    value_type: 'TEXT',
    enum_options: [],
    http_enum_config: {},
    example: '',
    value: '',
    value_desc: '',
    param_scope: {},
    search_label: false,
    is_sensitive: true,
    deprecate: false,
    deprecate_desc: '',
    extensions: {}
  },
  {
    required: true,
    usage_type: 'ENV',
    name: 'namespace',
    read_only: false,
    name_desc: 'job运行时的namespace',
    value_type: 'TEXT',
    enum_options: [],
    http_enum_config: {},
    example: '',
    value: 'default',
    value_desc: '',
    param_scope: {},
    search_label: true,
    is_sensitive: false,
    deprecate: false,
    deprecate_desc: '',
    extensions: {}
  }
]
const paramColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    slotName: 'name',
    align: 'center',
    fixed: 'left',
    width: 300
  },
  {
    title: '参数类型',
    dataIndex: 'usage_type',
    slotName: 'usage_type',
    align: 'center'
  },
  {
    title: '必填',
    dataIndex: 'required',
    slotName: 'required',
    align: 'center'
  },
  {
    title: '只读',
    dataIndex: 'read_only',
    slotName: 'read_only',
    align: 'center'
  },
  {
    title: '参数描述',
    dataIndex: 'name_desc',
    slotName: 'name_desc',
    align: 'center',
    width: 300
  },
  {
    title: '值类型',
    dataIndex: 'value_type',
    slotName: 'value_type',
    align: 'center'
  },
  {
    title: '值描述',
    dataIndex: 'value_desc',
    slotName: 'value_desc',
    align: 'center',
    width: 300
  },
  {
    title: '值样例',
    dataIndex: 'example',
    slotName: 'example',
    align: 'center',
    width: 300
  },
  {
    title: '默认值',
    dataIndex: 'value',
    slotName: 'value',
    align: 'center',
    width: 300
  },
  {
    title: '搜索',
    dataIndex: 'search_label',
    slotName: 'search_label',
    align: 'center'
  },
  {
    title: '加密',
    dataIndex: 'is_sensitive',
    slotName: 'is_sensitive',
    align: 'center'
  }
]

//
const changeJobDefine = () => {
  if (runner_attr.value === 'run_params' && form.value.runner_spec) {
    const regex = /\$\{([^}]+)\}/g
    const variables = form.value.runner_spec.match(regex).map((match) => match.slice(2, -1))
    form.value.run_params.params = k8sRunnerParams
    variables.forEach((element) => {
      addParam(element)
    })
  }
}
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item
          field="name"
          label="名称"
          :disabled="!isCreate"
          required
          help="Job名称, 创建后不允许修改"
        >
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="display_name" label="展示名称" required>
          <a-input v-model="form.display_name" />
        </a-form-item>
        <a-form-item field="description" label="描述" required>
          <a-input v-model="form.description" />
        </a-form-item>
        <a-form-item label="定义" required>
          <a-radio-group v-model="runner_attr" @change="changeJobDefine" type="button">
            <a-radio value="runner_spec">Job定义</a-radio>
            <a-radio value="run_params">Job参数</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-show="runner_attr === 'runner_spec'"
          field="runner_spec"
          label="Job定义"
          required
        >
          <CodeEditor v-model="form.runner_spec" language="yaml"></CodeEditor>
        </a-form-item>
        <a-form-item
          v-show="runner_attr === 'run_params'"
          field="run_params"
          label="Job参数"
          required
        >
          <a-space direction="vertical" fill style="width: 100%">
            <a-table :columns="paramColumns" :pagination="false" :data="form.run_params.params">
              <template #name="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].name"></a-input>
              </template>
              <template #required="{ rowIndex }">
                <a-checkbox v-model="form.run_params.params[rowIndex].required"></a-checkbox>
              </template>
              <template #usage_type="{ rowIndex }">
                <a-select v-model="form.run_params.params[rowIndex].usage_type">
                  <a-option value="ENV">环境变量</a-option>
                  <a-option value="TEMPLATE">模版变量</a-option>
                </a-select>
              </template>
              <template #read_only="{ rowIndex }">
                <a-checkbox v-model="form.run_params.params[rowIndex].read_only"></a-checkbox>
              </template>
              <template #name_desc="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].name_desc"></a-input>
              </template>
              <template #value_type="{ rowIndex }">
                <a-select v-model="form.run_params.params[rowIndex].value_type">
                  <a-option value="TEXT">文本</a-option>
                  <a-option value="BOOLEAN">布尔值</a-option>
                  <a-option value="ENUM">枚举</a-option>
                  <a-option value="HTTP_ENUM">HTTP 访问</a-option>
                  <a-option value="K8S_CONFIG_MAP">k8s configmap</a-option>
                  <a-option value="K8S_SECRET">k8s Secret</a-option>
                </a-select>
              </template>
              <template #example="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].example"></a-input>
              </template>
              <template #value="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].value"></a-input>
              </template>
              <template #value_desc="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].value_desc"></a-input>
              </template>
              <template #search_label="{ rowIndex }">
                <a-checkbox v-model="form.run_params.params[rowIndex].search_label"></a-checkbox>
              </template>
              <template #is_sensitive="{ rowIndex }">
                <a-checkbox v-model="form.run_params.params[rowIndex].is_sensitive"></a-checkbox>
              </template>
            </a-table>
            <a-button @click="addParam" type="outline">
              <template #icon>
                <icon-plus />
              </template>
              添加参数
            </a-button>
          </a-space>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'DomainJobList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
