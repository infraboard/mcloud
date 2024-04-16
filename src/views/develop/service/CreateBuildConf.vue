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
        <a-form-item field="condition.events" label="事件" help="选择或者输入事件的名称" required>
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
        <a-form-item field="condition.events" label="流水线" help="规则匹配后执行的流水线" required>
          <a-select v-model="form.pipeline_id">
            <a-option>Push Hook</a-option>
            <a-option>Tag Push Hook</a-option>
            <a-option>Issue Hook</a-option>
            <a-option>Note Hook</a-option>
            <a-option>Merge Request Hook</a-option>
          </a-select>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'NamespacePolicyList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CREATE_BUILD } from '@/api/mflow/build'

const pageHeader = ref('添加配置')
const router = useRouter()

const form = ref({
  enabled: true,
  service_id: router.currentRoute.value.params.id,
  condition: { events: [], sub_events_match_type: 'EXACT', sub_events: [] },
  pipeline_id: '',
  queue: { enabled: false, max_length: 1 },
  env_vars: {},
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

// 创建配置
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      await CREATE_BUILD(data.values)
      Notification.success(`保存成功`)
      router.push({ name: 'NamespacePolicyList' })
    } catch (error) {
      Notification.error(`保存失败: ${error}`)
    } finally {
      submitLoading.value = false
    }
  }
}
</script>

<style scoped></style>
