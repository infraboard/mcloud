<script setup>
import { ref, watch } from 'vue'
import { RUN_JOB_TASK } from '@/api/mflow/task'
import { LIST_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { useRouter } from 'vue-router'
// job对象
const props = defineProps({
  visible: { type: Boolean, default: false },
  job: {
    type: Object,
    default: () => {
      return { id: '' }
    }
  }
})

// 定义事件 v-models
const emit = defineEmits(['update:visible'])

const router = useRouter()

// 表单
const form = ref({})
const _job = ref(props.job)
const runJobReq = {}
watch(
  () => props.job,
  (newV) => {
    if (newV) {
      _job.value = newV
      newV.run_params.params.forEach((item) => {
        form.value[item.name] = item.value
      })
      runJobReq.job_name = `#${newV.id}`
      runJobReq.run_params = newV.run_params
      fiilK8SClusterEnumOption()
    }
  },
  { immediate: true }
)

const showHelp = (text, example) => {
  let v = text
  if (example) {
    v += ', 例如 ' + example
  }
  return v
}

const runJobForm = ref('runJobForm')
const submitLoading = ref(false)
// 表单取消
const handleCancel = () => {
  runJobForm.value.resetFields()
  emit('update:visible', false)
}
const handleSubmit = async () => {
  const errs = await runJobForm.value.validate()
  if (!errs) {
    // 提交
    runJobReq.run_params.params.forEach((item) => {
      item.value = form.value[item.name]
    })
    try {
      submitLoading.value = true
      let resp = await RUN_JOB_TASK(runJobReq)
      router.push({ name: 'JobTaskConsole', params: { id: resp.task_id } })

      // 状态处理
      runJobForm.value.resetFields()
      emit('update:visible', false)
    } catch (error) {
      Notification.error(`运行失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}

// 自动补充默认值
const getParam = (name) => {
  for (const element of _job.value.run_params.params) {
    if (element.name === name) {
      return element
    }
  }
}

// 自动补充默认值
const fiilK8SClusterEnumOption = async () => {
  const kc = getParam('_kube_config')
  if (!kc) {
    return
  }

  switch (form.value['_kube_config_from']) {
    case 'MANUAL':
      kc.enum_options = []
      form.value['_kube_config'] = ''
      break
    case 'MPAAS_K8S_CLUSTER_REF':
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
  <a-drawer :width="680" :visible="visible" @cancel="handleCancel" unmountOnClose>
    <template #title>
      <span>运行 {{ job.display_name }}</span>
    </template>
    <a-form ref="runJobForm" :model="form" auto-label-width>
      <a-alert style="margin-bottom: 12px">{{ job.description }}</a-alert>
      <!-- 系统变量和废弃的变量不展示 -->
      <a-form-item
        v-for="param in _job.run_params.params"
        :key="param.name"
        :field="param.name"
        :label="param.name"
        :help="showHelp(param.name_desc, param.example)"
        :required="param.required"
        v-show="!param.deprecate && param.usage_type !== 'SYSTEM'"
      >
        <a-select
          v-if="param.enum_options.length > 0"
          v-model="form[param.name]"
          @change="fiilK8SClusterEnumOption"
        >
          <a-option v-for="item in param.enum_options" :key="item.value" :value="item.value">{{
            item.label
          }}</a-option>
        </a-select>
        <a-textarea
          v-else
          :auto-size="{ maxRows: 5 }"
          v-model="form[param.name]"
          :disabled="param.read_only"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="form-submit">
        <a-space>
          <a-button @click="handleCancel">取消</a-button>
          <a-button
            type="primary"
            html-type="submit"
            @click="handleSubmit"
            :loading="submitLoading"
          >
            运行
          </a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped></style>
