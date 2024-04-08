<script setup>
import { ref } from 'vue'

defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'changed'])

const handleCancel = () => {
  emit('update:visible', false)
}

// Stage表单
const fromRef = ref(undefined)
const form = ref({
  name: '',
  is_parallel: false
})

// 提交处理
const handleSubmit = async () => {
  var valiatedErr = await fromRef.value.validate()
  if (valiatedErr) {
    return
  }
  // 提交
  emit('changed', JSON.parse(JSON.stringify(form.value)))
  // 清理
  fromRef.value.resetFields()
  // 关闭
  emit('update:visible', false)
}
</script>

<template>
  <div>
    <a-modal
      width="auto"
      :visible="visible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      draggable
      :closable="false"
      unmount-on-close
    >
      <template #title> 添加阶段 </template>
      <a-form ref="fromRef" :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="name" label="描述" required help="阶段描述信息">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item
          field="is_parallel"
          label="并行执行"
          help="并行执行时, 该阶段的所有任务同时执行, 但是需要等待所有任务完成后才会继续执行后面阶段"
        >
          <a-switch type="round" v-model="form.is_parallel">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
