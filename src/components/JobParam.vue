<script setup>
import { ref, watch, computed } from 'vue'

// 定义v-model
const props = defineProps(['params', 'validate'])
const emit = defineEmits(['change'])

// 查询Job详情
const showHelp = (name, example, desc) => {
  let v = name
  if (example) {
    v += ', 例如 ' + example
  }

  if (desc) {
    v = desc + ', ' + v
  }

  return v
}

// 修改后的值
const form = ref({})

const showParams = computed(() => {
  return props.params.filter((param) => !param.deprecate && param.usage_type !== 'SYSTEM')
})

// 填充默认值
watch(
  () => props.params,
  (newV) => {
    if (newV) {
      newV.forEach((element) => {
        form.value[element.name] = element.value
      })
    }
  },
  { immediate: true }
)

// 提交修改后的结果
const updateStepForm = ref()
const handleUpdateValue = (vaule, key) => {
  emit('change', key, vaule)
}
</script>

<template>
  <a-form ref="updateStepForm" :model="form" auto-label-width>
    <a-form-item
      v-for="param in showParams"
      :key="param.name"
      :field="param.name"
      :label="param.name"
      :help="showHelp(param.name_desc, param.example, param.value_desc)"
      :required="param.required && validate"
    >
      <a-select
        :disabled="param.read_only || param.event_inject"
        @change="handleUpdateValue($event, param.name)"
        v-if="param.enum_options.length > 0"
        v-model="form[param.name]"
      >
        <a-option v-for="item in param.enum_options" :key="item.value" :value="item.value">{{
          item.label
        }}</a-option>
      </a-select>
      <a-textarea
        v-else
        @change="handleUpdateValue($event, param.name)"
        :auto-size="{ maxRows: 5 }"
        v-model="form[param.name]"
        :disabled="param.read_only || param.event_inject"
      />
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
