<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { onMounted, ref } from 'vue'

const queryLoading = ref(false)
const envs = ref([])
const QueryData = async () => {
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

onMounted(() => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <div>
      <a-radio-group type="button">
        <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
      </a-radio-group>
    </div>
    <div class="service-cluster">
      <a-card :style="{ width: '360px' }">
        <template #actions>
          <span class="icon-hover"> <IconThumbUp /> </span>
          <span class="icon-hover"> <IconShareInternal /> </span>
          <span class="icon-hover"> <IconMore /> </span>
        </template>
        <a-card-meta title="Card Title" description="This is the description">
          <template #avatar>
            <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
              <a-avatar :size="24" :style="{ marginRight: '8px' }"> A </a-avatar>
              <a-typography-text>Username</a-typography-text>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.page :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}

.service-cluster {
  margin-top: 12px;
}

</style>
