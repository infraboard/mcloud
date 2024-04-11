<script setup>
import { ref, watch } from 'vue'

// 定义v-model:visible
const props = defineProps(['visible', 'pipeline'])
const emit = defineEmits(['update:visible', 'change'])

const handleCancel = () => {
  emit('update:visible', false)
  cleanForm()
}

// form
const updatePipelineForm = ref()
const form = ref({})

const handleOk = () => {
  emit('change', form.value)
  emit('update:visible', false)
  cleanForm()
}

const cleanForm = () => {
  updatePipelineForm.value.resetFields()
}

watch(
  () => props.visible,
  async (newV) => {
    if (newV) {
      form.value = JSON.parse(JSON.stringify(props.pipeline))
    }
  }
)
</script>

<template>
  <div>
    <a-drawer
      :width="'40%'"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :header="false"
      :footer="true"
      unmountOnClose
    >
      <a-form ref="updatePipelineForm" :model="form" auto-label-width>
        <a-tabs default-active-key="base">
          <a-tab-pane key="base" title="基本信息">
            <div class="page">
              <a-form-item field="name" label="名称" required help="流水线名称">
                <a-input v-model="form.name" />
              </a-form-item>
              <a-form-item field="description" label="描述" required help="描述信息">
                <a-input v-model="form.description" />
              </a-form-item>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-drawer>
  </div>
</template>
