<script setup>
import { onMounted, reactive, ref } from 'vue'
import { LIST_SUB_USER } from '@/api/mcenter/user'
import { Message } from '@arco-design/web-vue'

// 定义v-model
const props = defineProps(['modelValue', 'disabledUser', 'multiple', 'disabled'])
defineEmits(['update:modelValue'])

// 准备好选项
var options = ref([])
const queryLoading = ref(false)
const queryParms = reactive({
  keywords: '',
  extra_user_ids: ''
})
var hasLoad = false
const ListUser = async () => {
  hasLoad = true
  queryLoading.value = true
  options.value = []
  try {
    if (props.modelValue) {
      queryParms.extra_user_ids = props.modelValue.join(',')
    }
    const resp = await LIST_SUB_USER(queryParms)
    options.value = resp.items
    isDisabled()
  } catch (error) {
    Message.error(`查询用户失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

const isDisabled = () => {
  if (props.disabledUser) {
    props.disabledUser.forEach((item) => {
      options.value.forEach((option) => {
        if (option.id === item) {
          option.disabled = true
        }
      })
    })
  }
}

onMounted(() => {
  ListUser()
})

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
    :disabled="disabled"
    :multiple="multiple"
    :filter-option="false"
  >
    <a-option v-for="item of options" :key="item.id" :value="item.id" :disabled="item.disabled">{{
      item.username
    }}</a-option>
  </a-select>
</template>
