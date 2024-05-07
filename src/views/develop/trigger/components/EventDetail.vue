<template>
  <div class="content">
    <div v-for="(commit, index) in event.commits" :key="commit.id">
      <a-space>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16">
          <path
            fill="var(--color-text-2)"
            d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.876-1.008a4.002 4.002 0 0 1-7.752 0A1.01 1.01 0 0 1 4 9H1a1 1 0 1 1 0-2h3c.042 0 .083.003.124.008a4.002 4.002 0 0 1 7.752 0A1.01 1.01 0 0 1 12 7h3a1 1 0 0 1 0 2h-3a1.01 1.01 0 0 1-.124-.008z"
          ></path>
        </svg>
        <a-link class="f12" target="_blank" href="commit.url ">{{ commit.id.slice(0, 8) }}</a-link>
        <span class="f12"><icon-send /> {{ record.name }}</span>
        <span class="f12"><icon-branch /> {{ record.sub_name }}</span>
        <span class="f12"><icon-user /> {{ commit.author.name }}</span>
        <span class="f12"><icon-schedule /> {{ commit.timestamp }}</span>
        <span class="f12"><icon-file /> {{ commit.title }} </span>
      </a-space>
      <pre class="commit-message"> {{ commit.message }} </pre>
      <a-divider v-if="event.commits.length - 1 !== index" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { GET_TRIGGER_RECORD } from '@/api/mflow/trigger.js'

// 定义v-model
const props = defineProps({
  eventId: {
    type: String,
    required: true
  }
})

onMounted(() => {
  queryPipelineTriggerEvent()
})

const record = ref({})
const event = ref({})
const queryPipelineTriggerEvent = async () => {
  const resp = await GET_TRIGGER_RECORD(props.eventId)
  event.value = JSON.parse(resp.raw)
  resp.raw = ''
  record.value = resp
}
</script>

<style scoped>
.content {
  margin-top: 12px;
  background-color: var(--color-fill-1);
  border: 1px solid var(--color-neutral-3);
  padding: 6px 10px;
  height: 56px;
  overflow: scroll;
  -ms-overflow-style: none; /* 隐藏滚动条（IE和Edge） */
}

.content::-webkit-scrollbar {
  display: none; /* 隐藏滚动条（Chrome, Safari） */
}

.commit-message {
  font-size: 12px;
}
</style>
