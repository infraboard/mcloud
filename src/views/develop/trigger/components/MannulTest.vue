<template>
  <div>
    <a-drawer
      width="40%"
      :header="false"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      unmountOnClose
    >
    </a-drawer>
  </div>
</template>

<script setup>
// 定义v-model
defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const handleOk = () => {
  emit('update:visible', false)
}
const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style scoped></style>
