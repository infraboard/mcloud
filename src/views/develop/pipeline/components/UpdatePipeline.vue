<script setup>
import { ref, watch } from 'vue'
import mapping from '@/stores/mapping'

// 定义v-model:visible
const props = defineProps(['visible', 'pipeline'])
const emit = defineEmits(['update:visible', 'change'])

const handleCancel = () => {
  emit('update:visible', false)
  cleanForm()
}

// form
const updatePipelineForm = ref()
const form = ref({visiable_mode: 'NAMESPACE'})

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
              <a-form-item field="visiable_mode" label="访问范围" help="访问范围" required>
                <a-radio-group v-model="form.visiable_mode" type="button">
                  <a-radio value="NAMESPACE">{{ mapping['NAMESPACE'] }}</a-radio>
                  <a-radio value="DOMAIN">{{ mapping['DOMAIN'] }}</a-radio>
                  <a-radio value="GLOBAL">{{ mapping['GLOBAL'] }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-drawer>
  </div>
</template>
