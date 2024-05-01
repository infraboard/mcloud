<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import UpdatePipeline from './components/UpdatePipeline.vue'
import AddStage from './components/AddStage.vue'
import UpdateStep from './components/UpdateStep.vue'
import UpdateStage from './components/UpdateStage.vue'
import ChoiceJob from '../job/components/ChoiceJob.vue'
import { CREATE_PIPELINE, GET_PIPELINE, UPDATE_PIPELINE } from '@/api/mflow/pipeline.js'

const router = useRouter()
const pipeline = ref({
  name: '默认',
  description: '',
  logo: '',
  required_approval: false,
  is_parallel: false,
  is_template: true,
  visiable_mode: 'NAMESPACE',
  with: [],
  stages: [],
  webhooks: [],
  mention_users: [],
  next_pipeline: '',
  labels: {}
})

const title = ref('创建流水线')
const pid = router.currentRoute.value.query.id
const GetPipeline = async () => {
  if (pid) {
    title.value = '编辑流水线'
    const resp = await GET_PIPELINE(pid, { with_job: true })
    pipeline.value = resp
  }
}

onBeforeMount(() => {
  GetPipeline()
})

/*
基本信息
*/
const showUpdatePipeline = ref(false)
const handleUpdatePipeline = () => {
  showUpdatePipeline.value = true
}

const updatePipeline = (v) => {
  pipeline.value.name = v.name
  pipeline.value.description = v.description
}

/*
阶段
*/
const showAddStage = ref(false)
const handleAddStage = (v) => {
  v.number = pipeline.value.stages.length + 1
  v.tasks = []
  pipeline.value.stages.push(v)
}

// 删除Stage
const handleDeleteStage = (stageIndex) => {
  pipeline.value.stages.splice(stageIndex, 1)
}

// Stage更新
const showUpdateStage = ref(-1)
const handleUpdateStage = (stageIndex) => {
  showUpdateStage.value = stageIndex
}
const updateStage = (v) => {
  showUpdateStage.value = -1
  pipeline.value.stages.forEach((stage) => {
    if (stage.number === v.number) {
      stage.name = v.name
      stage.is_parallel = v.is_parallel
    }
  })
}

/*
步骤
*/
const showAddStep = ref(-1)
var currentAddStepStage = null
// Step弹窗
const clickAddStep = (stageIndex) => {
  showAddStep.value = stageIndex
  currentAddStepStage = pipeline.value.stages[showAddStep.value]
}
// 添加步骤
const AddTask = async (job) => {
  showAddStep.value = -1
  pipeline.value.stages.forEach((stage) => {
    if (stage.number === currentAddStepStage.number) {
      stage.tasks.push({
        number: stage.tasks.length + 1,
        job_name: job.extension.uniq_name,
        job_id: job.id,
        task_name: job.display_name,
        run_params: { ignore_failed: false, dry_run: false, params: job.run_params.params },
        rollback_params: { ignore_failed: false, dry_run: false, params: [] },
        webhooks: [],
        mention_users: [],
        labels: {},
        job: job,
        extension: { job_icon: job.icon }
      })
    }
  })
}

// 更新步骤
const showUpdateStep = ref(-1)
var currentUpdateStepIndex = []
const handleUpdateStep = (stageIndex, taskIndex) => {
  showUpdateStep.value = `${stageIndex}.${taskIndex}`
  currentUpdateStepIndex = [stageIndex, taskIndex]
}

const updateParam = (k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  task.run_params.params.forEach((element) => {
    if (element.name === k) {
      element.value = v
    }
  })
}

// 更新审核
const updateAudit = (k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  task.audit[k] = v
}

// 更新群组通知
const updateImRobotNotify = (action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  switch (action) {
    case 'add':
      task.im_robot_notify.push(v)
      break
    case 'delete':
      task.im_robot_notify.splice(v, 1)
      break
    case 'update':
      task.im_robot_notify[v.index] = v
      break
    default:
      break
  }
}

// 更新WebHook
const updateMentitionUserNotify = (action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  switch (action) {
    case 'add':
      task.mention_users.push(v)
      break
    case 'delete':
      task.mention_users.splice(v, 1)
      break
    case 'update':
      task.mention_users[v.index] = v
      break
    default:
      break
  }
}

// 更新WebHook
const updateWebHookNotify = (action, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  switch (action) {
    case 'add':
      task.webhooks.push(v)
      break
    case 'delete':
      task.webhooks.splice(v, 1)
      break
    case 'update':
      task.webhooks[v.index] = v
      break
    default:
      break
  }
}

// 删除步骤
const deleteStep = async () => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  pipeline.value.stages[stageIndex].tasks.splice(taskIndex, 1)
}

/*
保存或者更新
*/
const saveOrUpdateLoading = ref(false)
const saveOrUpdate = async () => {
  saveOrUpdateLoading.value = true
  try {
    if (pid) {
      await UPDATE_PIPELINE(pid, pipeline.value)
    } else {
      await CREATE_PIPELINE(pipeline.value)
    }
    router.push({ name: 'DomainPipelineList' })
  } finally {
    saveOrUpdateLoading.value = false
  }
}

// 变量
const stepItemKeyStyle = {
  width: '40px',
  height: '40px',
  fontSize: '12px'
}
const stepItemValueStyle = {
  height: '40px',
  width: '220px'
}
</script>

<template>
  <!-- 页头 -->
  <a-page-header :title="title" @back="router.push({ name: 'DomainPipelineList' })">
    <template #extra>
      <a-space>
        <a-button :loading="saveOrUpdateLoading" @click="saveOrUpdate" size="small" type="primary">
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </a-space>
    </template>
  </a-page-header>
  <div class="page" style="padding-top: 0px">
    <a-card :header-style="{ height: '36px' }" :body-style="{ padding: '0px 8px 8px 8px' }">
      <template #title>
        <span>{{ pipeline.name }}</span>
      </template>
      <template #extra>
        <a-button size="mini" type="text" @click="handleUpdatePipeline()">
          <template #icon>
            <icon-edit />
          </template>
          修改
        </a-button>
        <UpdatePipeline
          v-model:visible="showUpdatePipeline"
          :pipeline="pipeline"
          @change="updatePipeline"
        ></UpdatePipeline>
      </template>
      <div class="stage">
        <a-card
          v-for="(stage, stageIndex) in pipeline.stages"
          :key="'stage_' + stageIndex"
          class="stage-card"
        >
          <!-- 阶段标题 -->
          <template #title>
            <div class="task-title">
              <span>{{ stage.name }}</span>
              <span v-if="stage.is_parallel">【并行执行】</span>
              <span v-else>【串行执行】</span>
            </div>
          </template>
          <!-- 阶段设置 -->
          <template #extra>
            <a-button
              size="mini"
              type="text"
              status="danger"
              @click="handleDeleteStage(stageIndex)"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
            <a-button size="mini" type="text" @click="handleUpdateStage(stageIndex)">
              <template #icon>
                <icon-edit />
              </template>
              修改
            </a-button>
            <!-- 修改Stage弹窗 -->
            <UpdateStage
              :visible="showUpdateStage === stageIndex"
              @update:visible="showUpdateStage = -1"
              :stage="stage"
              @changed="updateStage"
            >
            </UpdateStage>
            <!-- 添加step弹窗 -->
            <ChoiceJob
              :visible="showAddStep === stageIndex"
              @update:visible="showAddStep = -1"
              @changed="AddTask"
            >
            </ChoiceJob>
          </template>

          <!-- 步骤列表显示 -->
          <div class="stage-step">
            <a-button-group
              v-for="(task, taskIndex) in stage.tasks"
              :key="'task_' + taskIndex"
              class="stage-step-item"
            >
              <!-- 步骤图标 -->
              <a-button-group>
                <a-button :style="stepItemKeyStyle" @click="router.push({ name: '' })">
                  <template #icon>
                    <SvgIcon v-if="task.job && task.job.icon" :svgCode="task.job.icon"></SvgIcon>
                    <span v-else>{{ task.job_name.slice(0, 3) }}</span>
                  </template>
                </a-button>
                <!-- 步骤名称 -->
                <a-button
                  :style="stepItemValueStyle"
                  @click="handleUpdateStep(stageIndex, taskIndex)"
                  >{{ task.task_name }}</a-button
                >
              </a-button-group>
              <UpdateStep
                :visible="showUpdateStep === `${stageIndex}.${taskIndex}`"
                @update:visible="showUpdateStep = -1"
                @updateParam="updateParam"
                @updateAudit="updateAudit"
                @updateImRobotNotify="updateImRobotNotify"
                @updateWebHookNotify="updateWebHookNotify"
                @updateMentitionUserNotify="updateMentitionUserNotify"
                :edit="true"
                :step="task"
                @delete="deleteStep"
              >
              </UpdateStep>
            </a-button-group>
            <!-- 步骤添加按钮 -->
            <div style="margin-top: 12px">
              <a-button
                size="large"
                type="outline"
                class="add-step-btn"
                @click="clickAddStep(stageIndex)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                <span class="add-button">添加步骤</span>
              </a-button>
            </div>
          </div>
        </a-card>
        <div class="add-stage" @click="showAddStage = true">
          <icon-plus />
          <span class="add-button" style="margin-left: 8px">添加阶段</span>
        </div>
        <!-- 添加阶段 -->
        <AddStage @changed="handleAddStage" v-model:visible="showAddStage"></AddStage>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.stage {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: scroll;
  height: 700px;
}

.stage-card {
  flex-basis: 360px;
  flex-shrink: 0;
  width: 360px;
  height: 660px;
  margin-left: 12px;
  transition-property: all;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}

.add-stage {
  flex-basis: 200px;
  flex-shrink: 0;
  margin-left: 12px;
  height: 200px;
  width: 200px;
  color: rgb(var(--primary-6));
  background-color: var(--color-bg-2);
  border: 1px dashed rgb(var(--primary-6));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-step-btn {
  width: 260px;
}

.stage-step-item {
  margin-top: 12px;
}

.arco-btn-outline,
.arco-btn-outline[type='button'] :deep(.add-step-botton) {
  border: 1px dashed rgb(var(--primary-6));
}

.task-title {
  display: flex;
  font-size: 12px;
}

.add-button {
  font-size: 12px;
}
</style>
