<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_JOB, CREATE_JOB, UPDATE_JOB } from '@/api/mflow/job'
import { LIST_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { Notification } from '@arco-design/web-vue'
import mapping from '@/stores/mapping'
import ParamSetting from './components/ParamSetting.vue'
import { app } from '@/stores/localstorage'

const router = useRouter()
const runner_attr = ref('runner_spec')
const form = ref({
  name: '',
  visiable_mode: 'NAMESPACE',
  icon: '',
  display_name: '',
  description: '',
  runner_type: 'K8S_JOB',
  runner_spec: '',
  run_params: {
    ignore_failed: false,
    dry_run: false,
    params: []
  },
  labels: {
    Language: '*'
  }
})

// 提交处理
let pageHeader = '创建任务'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      switch (pageHeader) {
        case '创建任务':
          await CREATE_JOB(data.values)
          Notification.success(`创建成功`)
          break
        default:
          await UPDATE_JOB(id, data.values)
          Notification.success(`更新成功`)
          break
      }
      router.push({ name: 'DomainJobList' })
    } finally {
      submitLoading.value = false
    }
  }
}

// 判断更新模式
const GetJob = async () => {
  if (!isCreate) {
    pageHeader = '编辑任务'
    form.value = await GET_JOB(id)
  }
}

onBeforeMount(async () => {
  await GetJob()
  await fiilK8SClusterEnumOption()
})

// 添加参数
const newParam = (name = '') => {
  return {
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
  }
}
const addParam = (param) => {
  // 判断有没有该值, 如果没有则添加
  const hasObject = form.value.run_params.params.some((obj) => obj.name === param.name)
  if (!hasObject) {
    if (isFirstLetterLowerCase(param.name)) {
      param.usage_type = 'TEMPLATE'
    }
    form.value.run_params.params.push(param)
  }
}

const isFirstLetterLowerCase = (str) => {
  const char = str[0]
  if (char === '_') {
    return false
  }
  return char === char.toLowerCase()
}
const k8sRunnerParams = [
  {
    required: true,
    usage_type: 'RUNNER',
    name: '_kube_config_from',
    read_only: true,
    name_desc: 'kubeconf配置文件录入方式, 手动填写或者选择已有的k8s集群',
    value_type: 'ENUM',
    enum_options: [
      { value: 'MPAAS_K8S_CLUSTER_REF', label: '已有集群' },
      { value: 'MANUAL', label: '手动填写' }
    ],
    http_enum_config: {},
    example: 'docker-desktop',
    value: 'MPAAS_K8S_CLUSTER_REF',
    value_desc: '',
    param_scope: {},
    search_label: false,
    is_sensitive: false,
    deprecate: false,
    deprecate_desc: '',
    extensions: {}
  },
  {
    required: true,
    usage_type: 'RUNNER',
    name: '_kube_config',
    read_only: false,
    name_desc: '用于运行k8s job的访问配置, 默认存储于: ~/.kube/config',
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
    extensions: { format: 'yaml' }
  },
  {
    required: true,
    usage_type: 'RUNNER',
    name: '_namespace',
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
    width: 220
  },
  {
    title: '参数类型',
    dataIndex: 'usage_type',
    slotName: 'usage_type',
    align: 'center'
  },
  {
    title: '废弃',
    dataIndex: 'deprecate',
    slotName: 'deprecate',
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

// 自动提取Job模版中的变量
const changeJobDefine = () => {
  if (runner_attr.value === 'run_params' && form.value.runner_spec) {
    const regex = /\$\{([^}]+)\}/g
    const variables = form.value.runner_spec.match(regex).map((match) => match.slice(2, -1))
    k8sRunnerParams.forEach((element) => {
      addParam(element)
    })
    variables.forEach((element) => {
      addParam(newParam(element))
    })
  }
}

// 处理拖拽数据变更
const handleChange = (_data) => {
  form.value.run_params.params = _data
}

// 处理值类型的配置
const showParamSetting = (param) => {
  param._show_setting_modal = true
}

// 自动补充默认值
const getParam = (name) => {
  for (const element of form.value.run_params.params) {
    if (element.name === name) {
      return element
    }
  }
}

const fiilK8SClusterEnumOption = async () => {
  const kcFrom = getParam('_kube_config_from')
  if (!kcFrom) {
    return
  }

  const kc = getParam('_kube_config')
  if (!kc) {
    return
  }

  switch (kcFrom.value) {
    case 'MANUAL':
      kc.enum_options = []
      kc.value = ''
      kc.is_sensitive = true
      break
    case 'MPAAS_K8S_CLUSTER_REF':
      kc.is_sensitive = false
      await GetK8sEnumOption(kc)
      break
  }
}

const GetK8sEnumOption = async (kc) => {
  const options = []
  const resp = await LIST_K8S_CLUSTER()
  resp.items.forEach((cluster) => {
    options.push({
      value: cluster.id,
      label: `${cluster.name}【${cluster.server_info.server}】`
    })
  })
  kc.enum_options = options
}
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :size="app.size" :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item
          field="name"
          label="名称"
          :disabled="!isCreate"
          required
          help="Job名称, 创建后不允许修改"
        >
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="visiable_mode" label="访问范围" help="访问范围" required>
          <a-radio-group v-model="form.visiable_mode" type="button">
            <a-radio value="NAMESPACE">{{ mapping['NAMESPACE'] }}</a-radio>
            <a-radio value="DOMAIN">{{ mapping['DOMAIN'] }}</a-radio>
            <a-radio value="GLOBAL">{{ mapping['GLOBAL'] }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="display_name" label="展示名称" help="暂时名称" required>
          <a-input v-model="form.display_name" />
        </a-form-item>
        <a-form-item field="icon" label="图标" help="任务Svg图标" required>
          <a-input v-model="form.icon" />
        </a-form-item>
        <a-form-item field="description" label="描述" help="描述" required>
          <a-input v-model="form.description" />
        </a-form-item>
        <a-form-item label="定义" help="定义和参数都需要填写" required>
          <a-radio-group v-model="runner_attr" @change="changeJobDefine" type="button">
            <a-radio value="runner_spec">任务定义</a-radio>
            <a-radio value="run_params">任务参数</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-show="runner_attr === 'runner_spec'"
          field="runner_spec"
          label="任务定义"
          required
        >
          <CodeEditor v-model="form.runner_spec" language="yaml"></CodeEditor>
        </a-form-item>
        <a-form-item
          v-show="runner_attr === 'run_params'"
          field="run_params"
          label="任务参数"
          required
        >
          <a-space direction="vertical" fill style="width: 100%">
            <a-table
              :draggable="{ type: 'handle', width: 40 }"
              @change="handleChange"
              :columns="paramColumns"
              :pagination="false"
              :data="form.run_params.params"
            >
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
                  <a-option value="RUNNER">执行器变量</a-option>
                  <a-option value="SYSTEM">系统变量</a-option>
                </a-select>
              </template>
              <template #deprecate="{ rowIndex }">
                <a-checkbox v-model="form.run_params.params[rowIndex].deprecate"></a-checkbox>
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
                <icon-settings
                  class="settings"
                  v-if="form.run_params.params[rowIndex].value_type === 'ENUM'"
                  @click="showParamSetting(form.run_params.params[rowIndex])"
                />
                <ParamSetting
                  v-model:visible="form.run_params.params[rowIndex]._show_setting_modal"
                  v-model:options="form.run_params.params[rowIndex].enum_options"
                  @changed="
                    (v) => {
                      form.run_params.params[rowIndex].enum_options = v
                    }
                  "
                >
                </ParamSetting>
              </template>
              <template #example="{ rowIndex }">
                <a-input v-model="form.run_params.params[rowIndex].example"></a-input>
              </template>
              <template #value="{ rowIndex }">
                <a-select
                  v-model="form.run_params.params[rowIndex].value"
                  @change="fiilK8SClusterEnumOption"
                  v-if="form.run_params.params[rowIndex].enum_options.length > 0"
                >
                  <a-option
                    v-for="item in form.run_params.params[rowIndex].enum_options"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</a-option
                  >
                </a-select>
                <a-input v-else v-model="form.run_params.params[rowIndex].value"> </a-input>
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
          </a-space>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button :size="app.size" @click="router.push({ name: 'DomainJobList' })"
              >取消</a-button
            >
            <a-button :size="app.size" type="primary" html-type="submit" :loading="submitLoading"
              >保存</a-button
            >
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.page :deep(.arco-scrollbar-thumb-direction-horizontal .arco-scrollbar-thumb-bar) {
  height: 0px;
  margin: 0px;
}

.page :deep(.arco-table-td-content) {
  display: flex;
  align-items: center;
}

.settings {
  margin-left: 4px;
  width: 1.5em;
  height: 1.5em;
  color: rgb(var(--arcoblue-6));
  cursor: pointer;
}
</style>
