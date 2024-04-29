<script setup>
import { onMounted, reactive, ref } from 'vue'
import { LIST_K8S_CLUSTER } from '@/api/mpaas/k8s'

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
const ListK8s = async () => {
  queryLoading.value = true
  options.value = []
  try {
    const resp = await LIST_K8S_CLUSTER(queryParms)
    options.value = resp.items
  } finally {
    queryLoading.value = false
  }
}

// 模糊搜索用户
const handleSearch = (v) => {
  queryParms.keywords = v
  ListK8s()
}

onMounted(() => {
  ListK8s()
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
      >{{ item.name }}【{{ item.server_info.server }}】</a-option
    >
  </a-select>
</template>
