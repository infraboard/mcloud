<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { LIST_ROLE } from '@/api/mcenter/role'
import { Message } from '@arco-design/web-vue'

// 定义v-model
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

// 准备好选项
var options = ref([])
const queryLoading = ref(false)
const queryParms = reactive({ keywords: '' })
const ListRole = async () => {
  queryLoading.value = true
  options.value = []
  try {
    const resp = await LIST_ROLE(queryParms)
    options.value = resp.items
  } catch (error) {
    Message.error(`查询角色失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

// 加载选项数据
onBeforeMount(() => {
  ListRole()
})
</script>

<template>
  <a-select
    :loading="queryLoading"
    placeholder="请选择角色"
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
    allow-search
  >
    <a-option v-for="item of options" :key="item.id" :value="item.id">{{ item.name }}</a-option>
  </a-select>
</template>
