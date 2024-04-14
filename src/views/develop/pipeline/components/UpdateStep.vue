<script setup>
import { onMounted, ref, watch } from 'vue'
import JobParam from '@/components/JobParam.vue'
import TaskLogConsole from '../../job_task/components/TaskLogConsole.vue'

// 定义v-model:visible
const props = defineProps({
  visible: { type: Boolean, default: false },
  step: { type: Object },
  edit: { type: Boolean, default: false },
  validate: { type: Boolean, default: false },
  width: { type: String, default: '40%' }
})
const emit = defineEmits(['update:visible', 'updateParam', 'delete'])

const activeKey = ref('params')
const hanleChangeTab = (v) => {
  activeKey.value = v
}

const handleCancel = () => {
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
      if (props.step.status && props.step.status.stage !== 'PENDDING') {
        activeKey.value = 'console'
      }
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
  emit('updateParam', k, v)
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
      @cancel="handleCancel"
      :header="false"
      :footer="false"
      unmountOnClose
    >
      <a-form ref="updateStepForm" :model="form" auto-label-width>
        <a-tabs
          class="tab-container"
          :active-key="activeKey"
          @change="hanleChangeTab"
          default-active-key="params"
        >
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
          <a-tab-pane key="console" v-if="step.status">
            <template #title>运行日志</template>
            <!-- 日志控制台 -->
            <KeepAlive>
              <TaskLogConsole
                style="margin-top: 8px"
                :taskId="step.task_id"
                height="calc(100vh - 72px)"
              ></TaskLogConsole>
            </KeepAlive>
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
.tab-container :deep(.arco-tabs-pane) {
  height: calc(100vh - 62px);
  overflow: scroll;
}

.tab-container :deep(.arco-tabs-pane)::-webkit-scrollbar {
  display: none; /* 隐藏滚动条（Chrome, Safari） */
}

.tab-container :deep(.arco-tabs-pane) {
  -ms-overflow-style: none; /* 隐藏滚动条（IE和Edge） */
}
</style>
