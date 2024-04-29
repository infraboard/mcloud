<script setup>
import { reactive, ref } from 'vue'
import { LIST_SUB_USER } from '@/api/mcenter/user'
import { Message } from '@arco-design/web-vue'

// 定义v-model
defineProps(['modelValue', 'multiple'])
defineEmits(['update:modelValue'])

// 准备好选项
var options = ref([])
const queryLoading = ref(false)
const queryParms = reactive({ keywords: '' })
var hasLoad = false
const ListUser = async () => {
  hasLoad = true
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

const popupVisibleChange = (v) => {
  if (!hasLoad && v) {
    ListUser()
  }
}
</script>

<template>
  <a-select
    :loading="queryLoading"
    placeholder=""
    :model-value="modelValue"
    @search="handleSearch"
    @change="$emit('update:modelValue', $event)"
    @popup-visible-change="popupVisibleChange"
    allow-search
    :multiple="multiple"
    :filter-option="false"
  >
    <a-option v-for="item of options" :key="item.id" :value="item.id">{{ item.username }}</a-option>
  </a-select>
</template>
