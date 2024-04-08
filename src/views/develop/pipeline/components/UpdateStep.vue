<script setup>
import { onMounted, ref, watch } from 'vue'
import { GET_JOB } from '@/api/mflow/job'
import JobParam from '@/components/JobParam.vue'

// 定义v-model:visible
const props = defineProps(['visible', 'step'])
const emit = defineEmits(['update:visible', 'change', 'delete'])

const handleCancel = () => {
  emit('update:visible', false)
  cleanForm()
}

const handleOk = () => {
  emit('change', form.value)
  emit('update:visible', false)
  cleanForm()
}

const cleanForm = () => {
  updateStepForm.value.resetFields()
}

onMounted(async () => {
  if (props.step) {
    GetJob(props.step.job_name)
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
      GetJob(props.step.job_name)
      console.log(form.value.run_params.params)
    }
  }
)

// 查询Job详情
const GetJobError = ref('')
const GetJob = async (jobName) => {
  try {
    const resp = await GET_JOB(jobName, { describe_by: 'JOB_UNIQ_NAME' })
    resp.run_params.params.forEach((param) => {
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
    GetJobError.value = ''
  } catch (error) {
    GetJobError.value = `查询Job失败: ${error}`
  }
}

const updateJobParams = (params) => {
  form.value.run_params = { params: params }
  emit('change', form.value)
  emit('update:visible', false)
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
      :width="'80%'"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :header="false"
      :footer="false"
      unmountOnClose
    >
      <a-form ref="updateStepForm" :model="form" auto-label-width>
        <a-tabs default-active-key="base">
          <template #extra>
            <a-button size="mini" type="text" status="danger" @click="deleteStep">
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
                :help="`步骤编号, 如果阶段是串行执行, 通过步骤编号可以调整步骤执行的先后顺序, 最大值${maxNumber}`"
              >
                <a-input-number disabled v-model="form.number" />
              </a-form-item>
              <a-form-item field="task_name" label="名称" required help="步骤名称或者描述">
                <a-input v-model="form.task_name" />
              </a-form-item>
              <a-form-item field="job_name" label="关联任务" required help="任务的名称">
                <a-input disabled v-model="form.job_name" />
              </a-form-item>
            </div>
          </a-tab-pane>
          <a-tab-pane key="params" title="任务参数">
            <div class="page">
              <a-alert v-if="GetJobError" type="error">{{ GetJobError }}</a-alert>
              <JobParam
                v-else
                :params="form.run_params.params"
                @change="updateJobParams"
                @cancel="handleCancel"
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
