<script setup>
import { GET_PIPELINE, UPDATE_PIPELINE } from '@/api/mflow/pipeline'
import { Notification } from '@arco-design/web-vue'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import AddStage from './components/AddStage.vue'
import UpdateStep from './components/UpdateStep.vue'
import UpdateStage from './components/UpdateStage.vue'
import ChoiceJob from '../job/components/ChoiceJob.vue'

const router = useRouter()
const id = router.currentRoute.value.query.id
const pipeline = ref({
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
const GetPipeline = async () => {
  try {
    if (id) {
      let resp = await GET_PIPELINE(id)
      pipeline.value = resp
    }
  } catch (error) {
    Notification.error(`查询Pipeline详情失败: ${error}`)
  }
}

// 清理状态
onBeforeMount(async () => {
  await GetPipeline()
})

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

// 弹窗变量
const showAddStage = ref(false)
const showAddStep = ref(false)
const choicedStage = ref()

// Stage更新
const showUpdateStage = ref(false)
const currentUpdateStage = ref(null)
const currentStageMaxNumber = ref(0)
const handleUpdateStage = (stage, maxNumber) => {
  showUpdateStage.value = true
  currentUpdateStage.value = stage
  currentStageMaxNumber.value = maxNumber
}
const updateStage = (v) => {
  console.log(v)
}

// Step删除
const deleteStage = async (v) => {
  let req = JSON.parse(JSON.stringify(pipeline.value))
  // 从列表中清除需要删除的stage
  let stages = []
  for (let element of req.stages) {
    if (element.name != v.name) {
      stages.push(element)
      req.stages = stages
    }
  }

  // 更新Pipeline
  await updatePipeline(req)
}

// Step弹窗
const clickAddStep = (stageIndex) => {
  showAddStep.value = true
  choicedStage.value = stageIndex
}

// Step添加
const AddStep = async (job, stageIndex) => {
  let req = JSON.parse(JSON.stringify(pipeline.value))
  for (let i = 0; i < req.stages.length; i++) {
    if (i === stageIndex) {
      req.stages[i].jobs.push({
        job_name: job.extension.uniq_name,
        task_name: job.name,
        extension: { job_icon: job.icon }
      })
      await updatePipeline(req)
    }
  }
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
    await GetPipeline()
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
        <span>创建于</span><ShowTime :timestamp="pipeline.create_at"></ShowTime>
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
          :loading="updatePipelineLoading && choicedStage === stageIndex"
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
              @click="handleUpdateStage(stage, pipeline.stages.length + 1)"
              >配置</a-button
            >
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
                >{{ job.task_name }}</a-button
              >
            </a-button-group>
            <!-- 步骤添加按钮 -->
            <div style="margin-top: 12px">
              <a-button type="outline" class="add-step-btn" @click="clickAddStep(stageIndex)">
                <template #icon>
                  <icon-plus />
                </template>
                添加步骤
              </a-button>
            </div>
          </div>
        </a-card>
        <div class="add-stage" @click="showAddStage = true">
          <icon-plus />
          <span style="margin-left: 8px">添加阶段</span>
        </div>
        <!-- stage修改 -->
        <AddStage
          @change="GetPipeline"
          v-model:visible="showAddStage"
          :pipeline="pipeline"
        ></AddStage>
        <UpdateStep
          v-model:visible="showUpdateStep"
          :step="currentUpdateStep"
          :maxNumber="currentStepMaxNumber"
          @change="updateStep"
          @delete="deleteStep"
        >
        </UpdateStep>
        <!-- step修改 -->
        <ChoiceJob @change="AddStep($event, choicedStage)" v-model:visible="showAddStep">
        </ChoiceJob>
        <UpdateStage
          v-model:visible="showUpdateStage"
          :stage="currentUpdateStage"
          :maxNumber="currentStageMaxNumber"
          @change="updateStage"
          @delete="deleteStage"
        >
        </UpdateStage>
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
</style>
