<script setup>
import { onMounted, ref, watch } from 'vue'
import JobParam from '@/components/JobParam.vue'

// 定义v-model:visible
['visible', 'step', 'edit', 'validate']
const props = defineProps({
  visible: {type: Boolean, default: false},
  step: {type: Object},
  edit: {type: Boolean, default: false},
  validate: {type: Boolean, default: false},
  width: {type: String, default: "40%"}
})
const emit = defineEmits(['update:visible', 'changed', 'delete'])

const handleCancel = () => {
  emit('update:visible', false)
  cleanForm()
}

const handleOk = () => {
  emit('changed', JSON.parse(JSON.stringify(form.value)))
  emit('update:visible', false)
  cleanForm()
}

const cleanForm = () => {
  updateStepForm.value.resetFields()
}

onMounted(() => {
  if (props.step) {
    GetJob()
  }
})

// form
const updateStepForm = ref()
const form = ref({ run_params: { params: [] } })
watch(
  () => props.visible,
  (newV) => {
    if (newV) {
      form.value = JSON.parse(JSON.stringify(props.step))
      GetJob()
    }
  }
)

// 查询Job详情
const GetJob = () => {
  props.step.job.run_params.params.forEach((param) => {
    let isExist = false
    form.value.run_params.params.forEach((item) => {
      if (item.name === param.name) {
        item.name_desc = param.name_desc
        item.value_desc = param.value_desc
        item.example = param.example
        if (item.value === '') {
          item.value = param.value
        }
        isExist = true
      }
    })
    if (!isExist) {
      form.value.run_params.params.push(param)
    }
  })
}

const handleParamsValueChange = (k, v) => {
  form.value.run_params.params.forEach((element) => {
    if (element.name === k) {
      element.value = v
    }
  })
}

// 通知外层删除
const deleteStep = () => {
  emit('delete', props.step)
  emit('update:visible', false)
}
</script>

<template>
  <div>
    <a-drawer
      :width="width"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :header="false"
      :footer="true"
      unmountOnClose
    >
      <a-form ref="updateStepForm" :model="form" auto-label-width>
        <a-tabs class="tab-container" default-active-key="params">
          <template #extra>
            <a-button v-if="edit" size="mini" type="text" status="danger" @click="deleteStep">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </template>
          <a-tab-pane key="base" title="基本信息" lazy-load>
            <div class="page">
              <a-form-item
                field="number"
                label="编号"
                required
                :help="`步骤编号, 如果阶段是串行执行, 通过步骤编号可以调整步骤执行的先后顺序`"
              >
                <a-input-number disabled v-model="form.number" />
              </a-form-item>
              <a-form-item field="task_name" label="名称" required help="步骤名称或者描述">
                <a-input :disabled="!edit" v-model="form.task_name" />
              </a-form-item>
              <a-form-item field="job_name" label="关联任务" required help="任务的名称">
                <a-input disabled v-model="form.job_name" />
              </a-form-item>
            </div>
          </a-tab-pane>
          <a-tab-pane key="params" title="任务参数">
            <div class="page">
              <a-alert style="margin-bottom: 12px">{{ step.job.description }}</a-alert>
              <JobParam
                :params="form.run_params.params"
                :validate="validate"
                @change="handleParamsValueChange"
              ></JobParam>
            </div>
          </a-tab-pane>
          <a-tab-pane key="user">
            <template #title>关注人</template>
            Content of Tab Panel 3
          </a-tab-pane>
          <a-tab-pane key="hooks">
            <template #title>Web Hooks</template>
            Content of Tab Panel 3
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-drawer>
  </div>
</template>

<style scoped>
.tab-container {
  position: relative;
}
</style>
