<template>
  <div>
    <a-drawer
      width="40%"
      :footer="false"
      :visible="visible"
      @cancel="handleCancel"
      :closable="false"
      unmountOnClose
    >
      <template #title> 模拟调试 </template>
      <a-form auto-label-width :model="form" @submit="handleSubmit">
        <a-form-item field="name" label="事件" help="事件名称" required>
          <a-select v-model="form.name" allow-create>
            <a-option>Push Hook</a-option>
            <a-option>Tag Push Hook</a-option>
            <a-option>Issue Hook</a-option>
            <a-option>Note Hook</a-option>
            <a-option>Merge Request Hook</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="sub_name" label="分支" help="代码分支名称" required>
          <a-input v-model="form.sub_name" />
        </a-form-item>
        <a-form-item field="extra.commit_id" label="分支" help="代码commit号" required>
          <a-input v-model="form.extra.commit_id" />
        </a-form-item>
        <a-form-item field="run_pipeline" label="执行流水线" help="是否执行流水线" required>
          <a-switch type="round" v-model="form.run_pipeline" />
        </a-form-item>
        <a-form-item style="justify-content: space-evenly">
          <div class="submit">
            <a-button @click="handleCancel">取消</a-button>
            <a-button style="margin-left: 12px" type="primary" html-type="submit">确认</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockData } from './mockData'
import { MANNUL_GITLAB_TRIGGER } from '@/api/mflow/trigger.js'

// 定义v-model
const props = defineProps({
  visible: Boolean,
  service: Object
})
const emit = defineEmits(['update:visible', 'change'])

const handleCancel = () => {
  emit('update:visible', false)
}

const router = useRouter()

let timestamp = new Date().getTime()
const form = ref({
  id: timestamp.toString(),
  skip_run_pipeline: false,
  run_pipeline: true,
  is_mock: true,
  from: 'https://gitlab.com',
  time: timestamp,
  user_agent: 'GitLab/15.5.0-pre',
  provider: 'GITLAB',
  provider_version: '15.5.0',
  name: '',
  sub_name: '',
  token: router.currentRoute.value.params.id,
  service_info: '',
  raw: '',
  parse_error: '',
  extra: { commit_id: '' }
})

// 提交事件
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      form.value.skip_run_pipeline = !form.value.run_pipeline
      submitLoading.value = true
      mockData.commits[0].id = form.value.extra.commit_id
      mockData.after = form.value.extra.commit_id
      mockData.checkout_sha = form.value.extra.commit_id
      mockData.ref = `refs/heads/${form.value.sub_name}`
      mockData.repository.git_ssh_url = props.service.code_repository.ssh_url
      mockData.project.git_ssh_url = props.service.code_repository.ssh_url
      form.value.raw = JSON.stringify(mockData)
      let resp = await MANNUL_GITLAB_TRIGGER(form.value)
      emit('change', resp)
      emit('update:visible', false)
    } catch (error) {
      Notification.error(`保存失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}
</script>

<style scoped>
.submit {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
