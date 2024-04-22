<script setup>
import { onMounted, reactive, ref } from 'vue'
import { LIST_SUB_USER } from '@/api/mcenter/user'
import { Message } from '@arco-design/web-vue'

// 定义v-model
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

// 准备好选项
var options = ref([])
const queryLoading = ref(false)
const queryParms = reactive({ keywords: '' })
const ListUser = async () => {
  queryLoading.value = true
  options.value = []
  try {
    const resp = await LIST_SUB_USER(queryParms)
    options.value = resp.items
  } catch (error) {
    Message.error(`查询用户失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

// 模糊搜索用户
const handleSearch = (v) => {
  queryParms.keywords = v
  ListUser()
}

onMounted(() => {
  ListUser()
})
</script>

<template>
  <a-select
    :loading="queryLoading"
    placeholder=""
    :model-value="modelValue"
    @search="handleSearch"
    @change="$emit('update:modelValue', $event)"
    allow-search
    :filter-option="false"
  >
    <a-option v-for="item of options" :key="item.id" :value="item.id">{{ item.username }}</a-option>
  </a-select>
</template>
