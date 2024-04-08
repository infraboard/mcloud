<script setup>
import { UPDATE_PIPELINE } from '@/api/mflow/pipeline'
import { Notification } from '@arco-design/web-vue'
import { onBeforeMount, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AddStage from './components/AddStage.vue'
import UpdateStep from './components/UpdateStep.vue'
import UpdateStage from './components/UpdateStage.vue'
import ChoiceJob from '../job/components/ChoiceJob.vue'

const router = useRouter()
const pipeline = reactive({
  name: '',
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

/*
阶段管理
*/
const showAddStage = ref(false)
const handleAddStage = (v) => {
  v.number = pipeline.stages.length + 1
  v.jobs = []
  pipeline.stages.push(v)
}

// 删除Stage
const handleDeleteStage = (stageIndex) => {
  pipeline.stages.splice(stageIndex, 1)
}

// Stage更新
const showUpdateStage = ref(-1)
const handleUpdateStage = (stageIndex) => {
  showUpdateStage.value = stageIndex
}
const updateStage = (v) => {
  showUpdateStage.value = -1
  pipeline.stages.forEach((stage) => {
    if (stage.number === v.number) {
      stage.name = v.name
      stage.is_parallel = v.is_parallel
    }
  })
}

/*
步骤管理
*/
const showAddStep = ref(-1)
var currentAddStepStage = null
// Step弹窗
const clickAddStep = (stageIndex) => {
  showAddStep.value = stageIndex
  currentAddStepStage = pipeline.stages[showAddStep.value]
}
// Step添加
const AddStep = async (job) => {
  showAddStep.value = -1
  pipeline.stages.forEach((stage) => {
    if (stage.number === currentAddStepStage.number) {
      stage.tasks.push({
        job_name: job.extension.uniq_name,
        task_name: job.display_name,
        run_params: { ignore_failed: false, dry_run: false, params: [] },
        rollback_params: { ignore_failed: false, dry_run: false, params: [] },
        webhooks: [],
        mention_users: [],
        labels: {},
        extension: { job_icon: job.icon, job_display_name: job.display_name }
      })
    }
  })
}

const handlePipelineChanged = (v) => {
  pipeline.stages = v.stages
}

// 清理状态
onBeforeMount(async () => {})

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

// Step更新
const showUpdateStep = ref(false)
const currentUpdateStep = ref(null)
const currentStepMaxNumber = ref(0)
const handleUpdateStep = (step, maxNumber) => {
  showUpdateStep.value = true
  currentUpdateStep.value = step
  currentStepMaxNumber.value = maxNumber
}
const updateStep = async (v) => {
  console.log(v)
  let req = JSON.parse(JSON.stringify(pipeline.value))
  // 找到当前被更新的ste, 然后更新
  req.stages.forEach((stage) => {
    if (stage.name === v.stage_name) {
      stage.jobs[v.number - 1] = v
    }
  })

  // 更新Pipeline
  await updatePipeline(req)
}

// Step删除
const deleteStep = async (v) => {
  let req = JSON.parse(JSON.stringify(pipeline.value))
  // 从列表中清除
  for (let element of req.stages) {
    if (element.name == v.stage_name) {
      let jobs = []
      for (let job of element.jobs) {
        if (job.number != v.number) {
          jobs.push(job)
        }
      }
      element.jobs = jobs
    }
  }

  // 更新Pipeline
  await updatePipeline(req)
}

// 更新Pipeline
const updatePipelineLoading = ref(false)
const updatePipeline = async (req) => {
  try {
    updatePipelineLoading.value = true
    await UPDATE_PIPELINE(pipeline.value.id, req)
    Notification.success(`更新成功`)

    // 更新页面数据
    handlePipelineChanged()
  } catch (error) {
    Notification.error(`更新失败: ${error}`)
  } finally {
    updatePipelineLoading.value = false
  }
}
</script>

<template>
  <!-- 页头 -->
  <a-page-header title="创建流水线" @back="router.push({ name: 'DomainPipelineList' })">
  </a-page-header>
  <div class="page">
    <a-card
      :header-style="{ height: '36px' }"
      :body-style="{ padding: '0px 8px 8px 8px' }"
      :loading="updatePipelineLoading"
    >
      <template #title>
        <span>【{{ pipeline.name }}】</span>
        <span>{{ pipeline.create_by }}</span>
      </template>
      <template #extra>
        <a-button size="mini" type="text">Web Hooks</a-button>
        <a-button size="mini" type="text">关注人</a-button>
        <a-button size="mini" type="text">变量</a-button>
      </template>
      <div class="stage">
        <a-card
          v-for="(stage, stageIndex) in pipeline.stages"
          :key="'stage_' + stageIndex"
          class="stage-card"
        >
          <!-- 阶段标题 -->
          <template #title>
            <div class="job-title">
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
              @changed="AddStep"
            >
            </ChoiceJob>
          </template>

          <!-- 步骤列表显示 -->
          <div class="stage-step">
            <a-button-group
              v-for="(job, jobIndex) in stage.jobs"
              :key="'job_' + jobIndex"
              class="stage-step-item"
            >
              <!-- 步骤图标 -->
              <a-button :style="stepItemKeyStyle" @click="router.push({ name: '' })">
                <template #icon>
                  <SvgIcon
                    v-if="job.extension && job.extension.job_icon"
                    :svgCode="job.extension.job_icon"
                  ></SvgIcon>
                  <span v-else>{{ job.job_name.slice(0, 3) }}</span>
                </template>
              </a-button>
              <!-- 步骤名称 -->
              <a-button
                :style="stepItemValueStyle"
                @click="handleUpdateStep(job, stage.jobs.length + 1)"
                >{{ job.extension.job_display_name }}</a-button
              >
            </a-button-group>
            <!-- 步骤添加按钮 -->
            <div style="margin-top: 12px">
              <a-button type="outline" class="add-step-btn" @click="clickAddStep(stageIndex)">
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
        <UpdateStep
          @change="updateStep"
          v-model:visible="showUpdateStep"
          :step="currentUpdateStep"
          :maxNumber="currentStepMaxNumber"
          @delete="deleteStep"
        >
        </UpdateStep>
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

.job-title {
  display: flex;
  font-size: 12px;
}

.add-button {
  font-size: 12px;
}
</style>
