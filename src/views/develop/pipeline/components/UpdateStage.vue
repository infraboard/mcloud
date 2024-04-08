<script setup>
import { ref, watch } from 'vue'

// 定义v-model:visible
const props = defineProps(['visible', 'stage', 'maxNumber'])
const emit = defineEmits(['update:visible', 'changed'])

const handleCancel = () => {
  emit('update:visible', false)
  cleanForm()
}

// form
const updateStageForm = ref()
const form = ref({})

const handleOk = () => {
  emit('changed', form.value)
  emit('update:visible', false)
  cleanForm()
}

const cleanForm = () => {
  updateStageForm.value.resetFields()
}

watch(
  () => props.visible,
  async (newV) => {
    if (newV) {
      form.value = JSON.parse(JSON.stringify(props.stage))
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
      <a-form ref="updateStageForm" :model="form" auto-label-width>
        <a-tabs default-active-key="base">
          <a-tab-pane key="base" title="基本信息">
            <div class="page">
              <a-form-item
                field="number"
                label="编号"
                required
                :help="`步骤编号, 如果阶段是串行执行, 通过步骤编号可以调整步骤执行的先后顺序`"
              >
                <a-input-number disabled="" v-model="form.number" />
              </a-form-item>
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
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-drawer>
  </div>
</template>
