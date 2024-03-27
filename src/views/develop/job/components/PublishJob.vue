<script setup>
import { ref } from 'vue'
import { UPDATE_JOB_STATUS } from '@/api/mflow/job'
import { Notification } from '@arco-design/web-vue'
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
const emit = defineEmits(['update:visible', 'ok'])

// 表单
const form = ref({
    stage: 'PUBLISHED',
    version: '',
    change_describe: '',
})

const publishJobForm = ref(null)
const submitLoading = ref(false)
// 表单取消
const handleCancel = () => {
  publishJobForm.value.resetFields()
  emit('update:visible', false)
}
const handleSubmit = async () => {
  const errs = await publishJobForm.value.validate()
  if (!errs) {
    try {
      submitLoading.value = true
      console.log(props.job.id)
      await UPDATE_JOB_STATUS(props.job.id,form.value)
      Notification.success(`发布成功`)
      // 状态处理
      publishJobForm.value.resetFields()
      emit('update:visible', false)
      emit('ok', true)
    } catch (error) {
      Notification.error(`发布失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}
</script>

<template>
  <a-drawer :width="680" :visible="visible" @cancel="handleCancel" unmountOnClose>
    <template #title>
      <span>{{ job.name }} 发布</span>
    </template>
    <a-form ref="publishJobForm" :model="form" auto-label-width>
        <a-form-item field="version" label="版本号" help="版本号" required>
            <a-input v-model="form.version"></a-input>   
        </a-form-item>
        <a-form-item field="change_describe" label="描述" help="版本描述">
            <a-textarea v-model="form.change_describe" :auto-size="{ minRows: 6 }"></a-textarea>   
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
