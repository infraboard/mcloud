<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UpdateStep from './UpdateStep.vue'

defineProps({
  pipeline: {
    type: Object,
    default: () => {
      return {
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
      }
    }
  },
  backgroundColor: {
    type: String,
    default: 'var(--color-bg-2)'
  },
  edit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateParam', 'updateAudit'])

const router = useRouter()

// 更新步骤
const showUpdateStep = ref('-1')
var currentUpdateStepIndex = []
const handleUpdateStep = (stageIndex, taskIndex) => {
  showUpdateStep.value = `${stageIndex}.${taskIndex}`
  currentUpdateStepIndex = [stageIndex, taskIndex]
}
const updateParam = (k, v) => {
  emit('updateParam', currentUpdateStepIndex, k, v)
}
const updateAudit = (k, v) => {
  emit('updateAudit', currentUpdateStepIndex, k, v)
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
  <a-card
    :header-style="{ height: '36px', backgroundColor }"
    :body-style="{ padding: '0px 8px 8px 8px', backgroundColor }"
  >
    <template #title>
      <span>{{ pipeline.name }}</span>
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
              <a-button :style="stepItemValueStyle" @click="handleUpdateStep(stageIndex, taskIndex)"
                >{{ task.task_name }}
              </a-button>
              <!-- 是否审核 -->
              <a-button v-if="task.audit.enable" :style="stepItemKeyStyle">
                <template #icon>
                  <icon-pause-circle />
                </template>
              </a-button>
            </a-button-group>
            <!-- 修改Stage弹窗 -->
            <UpdateStep
              :visible="showUpdateStep === `${stageIndex}.${taskIndex}`"
              @update:visible="showUpdateStep = '-1'"
              @updateParam="updateParam"
              @updateAudit="updateAudit"
              :step="task"
              :validate="true"
              :edit="edit"
            >
            </UpdateStep>
          </a-button-group>
        </div>
      </a-card>
    </div>
  </a-card>
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
