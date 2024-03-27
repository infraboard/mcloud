<script setup>
import { ref, watch } from 'vue'
import { RUN_JOB_TASK } from '@/api/mflow/task'
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
const runJobReq = {}
watch(
  () => props.job,
  (newV) => {
    if (newV) {
      newV.run_params.params.forEach((item) => {
        form.value[item.name] = item.value
      })
      runJobReq.job_name = `#${newV.id}`
      runJobReq.run_params = newV.run_params
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
</script>

<template>
  <a-drawer :width="680" :visible="visible" @cancel="handleCancel" unmountOnClose>
    <template #title>
      <span>运行 {{ job.name }}</span>
    </template>
    <a-form ref="runJobForm" :model="form" auto-label-width>
      <a-form-item
        v-for="param in job.run_params.params"
        :key="param.name"
        :field="param.name"
        :label="param.name"
        :help="showHelp(param.name_desc, param.example)"
        :required="param.required"
      >
        <a-textarea
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
