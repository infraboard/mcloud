<script setup>
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_PIPELINE_TASK, RUN_PIPELINE_TASK } from '@/api/mflow/task.js'
import mapping from '@/stores/mapping'
import UpdateStep from '../pipeline/components/UpdateStep.vue'
import { DurationHumanize } from '@/tools/time.js'
const router = useRouter()
const pipeline = ref({})
const pipelineTask = ref({})

// 更新步骤
const showUpdateStep = ref(-1)
var currentUpdateStepIndex = []
const handleUpdateStep = (stageIndex, taskIndex) => {
  showUpdateStep.value = `${stageIndex}.${taskIndex}`
  currentUpdateStepIndex = [stageIndex, taskIndex]
}

const updateParam = (k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const step = pipeline.value.stages[stageIndex].tasks[taskIndex]
  step.run_params.params.forEach((element) => {
    if (element.name === k) {
      element.value = v
    }
  })
}

onBeforeMount(async () => {
  await queryData()
})

// 刷新数据
var timer = setInterval(async () => {
  await queryData()
}, 3000)

onUnmounted(() => {
  clearInterval(timer)
})

const queryData = async () => {
  const pid = router.currentRoute.value.params.id
  const resp = await GET_PIPELINE_TASK(pid)
  pipeline.value = resp.pipeline
  resp.pipeline = null
  if (resp.end_at) {
    resp.cost = DurationHumanize(resp.end_at - resp.start_at)
  }
  pipelineTask.value = resp

  // 补充 Task Status
  for (let stageIndex = 0; stageIndex < resp.stage_status.length; stageIndex++) {
    const stage = resp.stage_status[stageIndex]
    for (let taskIndex = 0; taskIndex < stage.tasks.length; taskIndex++) {
      const task = stage.tasks[taskIndex]
      const target = pipeline.value.stages[stageIndex].tasks[taskIndex]
      target.status = task.status
      if (task.status.end_at !== 0) {
        target.cost = DurationHumanize(task.status.end_at - task.status.start_at)
      }

      target.class = [task.status.stage.toLowerCase()]
    }
  }

  // 取消定时器
  if (pipelineTask.value.end_at) {
    // 取消定时器
    clearInterval(timer)
  }
}

// 运行Pipeline
const runPipelineLoading = ref(false)

const runPipeline = async () => {
  var runPipelineReq = {
    pipeline_id: pipeline.value.id,
    run_params: []
  }
  pipeline.value.stages.forEach((stage) => {
    stage.tasks.forEach((task) => {
      task.run_params.params.forEach((param) => {
        if (!param.deprecate && param.usage_type !== 'SYSTEM') {
          param.param_scope = {
            stage: stage.number.toString(),
            task: task.number.toString()
          }
          runPipelineReq.run_params.push(param)
        }
      })
    })
  })

  const resp = await RUN_PIPELINE_TASK(runPipelineReq)
  router.push({ name: 'PipelineTaskDetail', params: { id: resp.id } })
}

// 变量
const stepItemKeyStyle = {
  width: '40px',
  height: '40px',
  fontSize: '12px'
}
const stepItemValueStyle = {
  height: '40px',
  width: '220px',
  fontSize: '12px',
  fontWeight: '600'
}
</script>

<template>
  <!-- 页头 -->
  <a-page-header title="任务详情" @back="router.go(-1)">
    <template #extra>
      <a-space>
        <a-button :loading="runPipelineLoading" @click="runPipeline" size="small" type="primary">
          <template #icon>
            <icon-refresh />
          </template>
          重新运行
        </a-button>
      </a-space>
    </template>
  </a-page-header>
  <div class="page" style="padding-top: 0px">
    <a-card :header-style="{ height: '36px' }" :body-style="{ padding: '0px 8px 8px 8px' }">
      <div style="margin: 10px 0px">
        <a-alert :type="mapping.statusAlert[pipelineTask.stage]">
          【{{ mapping.status[pipelineTask.stage] }}】:
          <span v-if="pipelineTask.cost"> 耗时 {{ pipelineTask.cost }}</span>
          {{ pipelineTask.message }}
        </a-alert>
      </div>
      <div style="padding: 0 2px">
        <a-space>
          <span>{{ pipeline.name }}</span>
          <ShowTime :timestamp="pipelineTask.create_at"></ShowTime>
          <span>{{ pipelineTask.run_by }}</span>
        </a-space>
      </div>
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
          <!-- 步骤列表显示 -->
          <div class="stage-step">
            <a-button-group
              v-for="(task, taskIndex) in stage.tasks"
              :key="'task_' + taskIndex"
              class="stage-step-item"
            >
              <!-- 步骤图标 -->
              <a-button-group>
                <a-button
                  :class="task.class"
                  :style="stepItemKeyStyle"
                  @click="router.push({ name: '' })"
                >
                  <template #icon>
                    <SvgIcon v-if="task.job && task.job.icon" :svgCode="task.job.icon"></SvgIcon>
                    <span v-else>{{ task.job_name.slice(0, 3) }}</span>
                  </template>
                </a-button>
                <!-- 步骤名称 -->
                <a-button
                  :style="stepItemValueStyle"
                  @click="handleUpdateStep(stageIndex, taskIndex)"
                >
                  <icon-loading
                    style="margin-right: 4px"
                    v-if="task.status.stage === 'ACTIVE' || task.status.stage === 'CREATING'"
                  />
                  {{ task.task_name }}
                  <span v-if="task.cost">【{{ task.cost }}】</span>
                </a-button>
              </a-button-group>
              <!-- 修改Stage弹窗 -->
              <UpdateStep
                :visible="showUpdateStep === `${stageIndex}.${taskIndex}`"
                @update:visible="showUpdateStep = -1"
                @updateParam="updateParam"
                :width="'90%'"
                :step="task"
              >
              </UpdateStep>
            </a-button-group>
          </div>
        </a-card>
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
