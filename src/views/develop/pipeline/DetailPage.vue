<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_PIPELINE } from '@/api/mflow/pipeline.js'
import { RUN_PIPELINE_TASK } from '@/api/mflow/task.js'
import PipelineDetail from './components/PipelineDetail.vue'

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

// 更新步骤
const updateParam = (currentUpdateStepIndex, k, v) => {
  const [stageIndex, taskIndex] = currentUpdateStepIndex
  const task = pipeline.value.stages[stageIndex].tasks[taskIndex]
  task.run_params.params.forEach((element) => {
    if (element.name === k) {
      element.value = v
    }
  })
}

onBeforeMount(async () => {
  const pid = router.currentRoute.value.params.id
  const resp = await GET_PIPELINE(pid, { with_job: true })
  pipeline.value = resp
})

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
</script>

<template>
  <!-- 页头 -->
  <a-page-header title="流水线详情" @back="router.push({ name: 'DomainPipelineList' })">
    <template #extra>
      <a-space>
        <a-button :loading="runPipelineLoading" @click="runPipeline" size="small" type="primary">
          <template #icon>
            <icon-send />
          </template>
          运行
        </a-button>
      </a-space>
    </template>
  </a-page-header>
  <div class="page" style="padding-top: 0px">
    <PipelineDetail :pipeline="pipeline" @updateParam="updateParam"></PipelineDetail>
  </div>
</template>

<style scoped></style>
