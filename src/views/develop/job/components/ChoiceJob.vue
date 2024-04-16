<script setup>
import { app } from '@/stores/localstorage'
import { LIST_JOB } from '@/api/mflow/job'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'

// 定义v-model:visible
defineProps(['visible'])
const emit = defineEmits(['update:visible', 'changed'])
const handleCancel = () => {
  emit('update:visible', false)
}

// 查询Job List
// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize
})

const pageChange = (v) => {
  queryParams.page_number = v
  QueryData()
}
const pageSizeChange = (v) => {
  queryParams.page_size = v
  queryParams.page_number = 1
  QueryData()
}

const queryLoading = ref(false)
const data = reactive({ items: [], total: 0 })
const QueryData = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_JOB(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Notification.error(`查询Job失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})

const choiceJob = (e, job) => {
  e.stopPropagation()
  emit('changed', job)
  emit('update:visible', false)
}

const jumpToDetail = (e) => {
  e.stopPropagation()
  console.log('link')
}
</script>

<template>
  <div>
    <a-modal
      width="auto"
      :visible="visible"
      @cancel="handleCancel"
      fullscreen
      :closable="false"
      unmount-on-close
      :footer="false"
    >
      <div>
        <!-- 分类 -->
        <div class="list-params">
          <a-radio-group type="button">
            <a-radio value="">全部</a-radio>
            <a-radio value="build">构建</a-radio>
            <a-radio value="deploy">部署</a-radio>
          </a-radio-group>
          <div style="margin-left: auto; margin-right: 12px">
            <a-pagination
              :size="app.size"
              :total="pagination.total"
              @change="pageChange"
              @page-size-change="pageSizeChange"
            />
          </div>
        </div>

        <!-- job 选项 -->
        <div class="job-list">
          <a-card
            v-for="job in data.items"
            :key="job.id"
            class="job-card"
            hoverable
            @click="choiceJob($event, job)"
          >
            <template #title>
              <div class="job-title">
                <SvgIcon v-if="job.icon" :svgCode="job.icon"></SvgIcon>
                <span v-else>{{ job.name.slice(0, 3) }}</span>
                <span style="margin-left: 12px">{{ job.display_name }}</span>
              </div>
            </template>
            <template #extra>
              <a-link @click="jumpToDetail">详情</a-link>
            </template>
            <span class="job-content">{{ job.description }}</span>
          </a-card>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.job-title {
  display: flex;
  align-items: center;
}

.job-list {
  display: flex;
  flex-wrap: wrap;
}

.job-card {
  margin-top: 12px;
  margin-right: 12px;
  width: 360px;
  cursor: pointer;
}

.job-card:hover {
  background-color: var(--color-primary-light-1);
}

.list-params {
  display: flex;
}

.job-content {
  font-size: 12px;
}
</style>
