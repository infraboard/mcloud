<script setup>
import { onMounted, reactive, ref } from 'vue'
import { LIST_SERVICE } from '@/api/mcenter/service'
import { Message } from '@arco-design/web-vue'

// 定义v-model
defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '请输入服务名称进行模糊搜索'
  }
})
defineEmits(['update:modelValue'])

// 准备好选项
var options = ref([])
const queryLoading = ref(false)
const queryParms = reactive({ keywords: '' })
const ListService = async () => {
  queryLoading.value = true
  options.value = []
  try {
    const resp = await LIST_SERVICE(queryParms)
    options.value = resp.items
  } catch (error) {
    Message.error(`查询服务失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

// 模糊搜索用户
const handleSearch = (v) => {
  queryParms.keywords = v
  ListService()
}

const showAddr = (v) => {
  const addr = v.image_repository.address
  if (addr) {
    return addr
  }
  return v.code_repository.ssh_url
}

onMounted(() => {
  ListService()
})
</script>

<template>
  <a-select
    :loading="queryLoading"
    :placeholder="placeholder"
    :model-value="modelValue"
    @search="handleSearch"
    @change="$emit('update:modelValue', $event)"
    allow-search
    :filter-option="false"
  >
    <a-option v-for="item of options" :key="item.id" :value="item.id" :label="item.name"
      >{{ item.name }} 【{{ showAddr(item) }}】</a-option
    >
  </a-select>
</template>
