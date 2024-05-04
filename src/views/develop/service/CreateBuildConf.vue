<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="enabled" label="启用" class="enable-line" help="启用后该策略才会生效">
          <a-switch type="round" v-model="form.enabled">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
        <a-form-item field="name" label="名称" help="配置名称" required>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item field="describe" label="描述" help="配置用途描述" required>
          <a-input v-model="form.describe"></a-input>
        </a-form-item>

        <a-divider orientation="center" type="dotted">匹配规则</a-divider>
        <a-form-item
          field="condition.sub_events_match_type"
          label="匹配方式"
          help="通配符: test/*"
          required
        >
          <a-radio-group v-model="form.condition.sub_events_match_type" type="button">
            <a-radio value="EXACT">精确匹配</a-radio>
            <a-radio value="GLOB">通配符</a-radio>
            <a-radio value="REGEXP">正则表达式</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="condition.events" label="事件" required>
          <template #help>
            <span
              >选择或者输入事件的名称,具体请参考:
              <a
                target="_blank"
                href="https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html"
                >Gitlab Webhook events</a
              >
            </span>
          </template>
          <a-select v-model="form.condition.events" multiple allow-create>
            <a-option>Push Hook</a-option>
            <a-option>Tag Push Hook</a-option>
            <a-option>Issue Hook</a-option>
            <a-option>Note Hook</a-option>
            <a-option>Merge Request Hook</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="condition.sub_events" label="分支" help="输入后 敲回车录入" required>
          <a-select v-model="form.condition.sub_events" multiple allow-create> </a-select>
        </a-form-item>
        <a-divider orientation="center" type="dotted">触发流水线</a-divider>
        <a-form-item field="pipeline_id" label="流水线" help="规则匹配后执行的流水线" required>
          <a-select @change="selectedPipelineChange" v-model="form.pipeline_id">
            <a-option v-for="p in queryPipelineResp.items" :key="p.id" :value="p.id">{{
              p.name
            }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="" help="">
          <PipelineDetail
            style="width: 100%"
            backgroundColor="#f7f8fa"
            v-if="selectedPipeline"
            :pipeline="selectedPipeline"
            @updateParam="updateParam"
            @updateAudit="updateAudit"
            @updateImRobotNotify="updateImRobotNotify"
            @updateWebHookNotify="updateWebHookNotify"
            @updateMentitionUserNotify="updateMentitionUserNotify"
            :allowAppend="true"
          ></PipelineDetail>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.go(-1)">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CREATE_BUILD, DESCRIBE_BUILD, UPDATE_BUILD } from '@/api/mflow/build'
import { LIST_PIPELINE } from '@/api/mflow/pipeline'
import PipelineDetail from '../pipeline/components/PipelineDetail.vue'
import { Notification } from '@arco-design/web-vue'

const pageHeader = ref('添加配置')
const router = useRouter()

// pipeline选项列表
const queryPipelineReq = ref({ with_job: true, with_inject_params: true })
const queryPipelineResp = ref({ items: [] })
const queryPipelineLoading = ref(false)
const queryPipeline = async () => {
  queryPipelineLoading.value = true
  try {
    const resp = await LIST_PIPELINE(queryPipelineReq.value)
    // 有追加项的保留原始值
    resp.items.forEach((element) => {
      element.stages.forEach((stage) => {
        stage.tasks.forEach((task) => {
          task.old_audit = JSON.parse(JSON.stringify(task.audit))
          task.old_im_robot_notify = JSON.parse(JSON.stringify(task.im_robot_notify))
          task.old_mention_users = JSON.parse(JSON.stringify(task.mention_users))
          task.old_webhooks = JSON.parse(JSON.stringify(task.webhooks))
        })
      })
    })
    queryPipelineResp.value = resp
  } finally {
    queryPipelineLoading.value = false
  }
}

onMounted(async () => {
  await queryPipeline()
  getBuildConf()
})

const form = ref({
  enabled: true,
  service_id: router.currentRoute.value.params.id,
  condition: { events: [], sub_events_match_type: 'EXACT', sub_events: [] },
  pipeline_id: '',
  queue: { enabled: false, max_length: 1 },
  custom_params: [],
  name: '',
  describe: '',
  target_type: 'IMAGE',
  image_build: {
    docker_file: 'Dockerfile',
    image_repository: '',
    extra: {}
  },
  version_named_rule: 'DATE_BRANCH_COMMIT',
  version_prefix: '',
  deploy_id: '',
  labels: {},
  extra: {}
})

// 获取详情
const id = router.currentRoute.value.query.id
const getBuildConf = async () => {
  if (id) {
    pageHeader.value = '编辑配置'
    const resp = await DESCRIBE_BUILD(id)
    form.value = resp
    if (selectedPipeline.value) {
      resp.custom_params.forEach((element) => {
        const stageIndex = parseInt(element.param_scope.stage) - 1
        const taskIndex = parseInt(element.param_scope.task) - 1
        console.log(stageIndex, taskIndex, selectedPipeline.value.stages)
        const task = selectedPipeline.value.stages[stageIndex].tasks[taskIndex]
        task.run_params.params.forEach((param) => {
          if (param.name === element.name) {
            param.value = element.value
          }
        })
      })
    }
  }
}

const updateCustomParams = (v) => {
  for (const param of form.value.custom_params) {
    if (
      param.name === v.name &&
      param.param_scope.stage === v.param_scope.stage &&
      param.param_scope.task === v.param_scope.task
    ) {
      param.value = v.value
      return
    }
  }

  form.value.custom_params.push(v)
}

const selectedPipeline = computed(() => {
  if (form.value.pipeline_id) {
    for (const element of queryPipelineResp.value.items) {
      if (element.id === form.value.pipeline_id) {
        return element
      }
    }
  }

  return null
})

const selectedPipelineChange = () => {
  form.value.custom_params = []
}

// 更新步骤
const updateParam = (currentUpdateStepIndex, k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const stage = selectedPipeline.value.stages[stageIndex]
  const task = stage.tasks[taskIndex]
  task.run_params.params.forEach((param) => {
    if (param.name === k) {
      param.value = v
      param.param_scope = {
        stage: stage.number.toString(),
        task: task.number.toString()
      }
      updateCustomParams(param)
    }
  })
}

// 更新审核
const updateAudit = (currentUpdateStepIndex, k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const stage = selectedPipeline.value.stages[stageIndex]
  const task = stage.tasks[taskIndex]
  task.audit[k] = v
}

// 更新群组通知
const updateImRobotNotify = (currentUpdateStepIndex, action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = selectedPipeline.value.stages[stageIndex].tasks[taskIndex]
  console.log(task, action, v)
  switch (action) {
    case 'add':
      task.im_robot_notify.push(v)
      break
    case 'delete':
      task.im_robot_notify.splice(v, 1)
      break
    case 'update':
      task.im_robot_notify[v.index] = v
      break
    default:
      break
  }
}

// 更新WebHook
const updateMentitionUserNotify = (currentUpdateStepIndex, action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = selectedPipeline.value.stages[stageIndex].tasks[taskIndex]
  switch (action) {
    case 'add':
      task.mention_users.push(v)
      break
    case 'delete':
      task.mention_users.splice(v, 1)
      break
    case 'update':
      task.mention_users[v.index] = v
      break
    default:
      break
  }
}

// 更新WebHook
const updateWebHookNotify = (currentUpdateStepIndex, action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = selectedPipeline.value.stages[stageIndex].tasks[taskIndex]
  switch (action) {
    case 'add':
      task.webhooks.push(v)
      break
    case 'delete':
      task.webhooks.splice(v, 1)
      break
    case 'update':
      task.webhooks[v.index] = v
      break
    default:
      break
  }
}

// 创建配置
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      if (id) {
        await UPDATE_BUILD(id, data.values)
        Notification.success(`更新成功`)
      } else {
        await CREATE_BUILD(data.values)
        Notification.success(`保存成功`)
      }
      router.go(-1)
    } finally {
      submitLoading.value = false
    }
  }
}
</script>

<style scoped></style>
