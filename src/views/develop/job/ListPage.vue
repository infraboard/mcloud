<script setup>
import { app } from '@/stores/localstorage'
import { LIST_JOB, DELETE_JOB } from '@/api/mflow/job'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import RunJob from './components/RunJob.vue'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize
})

const pageChange = (v) => {
  pagination.current = v
  QueryData()
}
const pageSizeChange = (v) => {
  pagination.pageSize = v
  pagination.current = 1
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

// 当前运行的Job对象
const currentRunJob = ref(null)
const showRunJob = ref(false)
const showRunJobHandler = (v) => {
  showRunJob.value = true
  currentRunJob.value = v
}

// 状态映射表
const statusMapping = {
  DRAFT: '准备中',
  PUBLISHED: '已发布',
  DEPRECATED: '已废弃'
}

// 处理操作
const handleSelect = async (v, id) => {
  switch (v) {
    case 'delete':
      await DELETE_JOB(id)
      Notification.success(`删除${id}成功`)
      QueryData()
      break
    default:
      break
  }
}
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button type="primary" :size="app.size" @click="router.push({ name: 'DomainJobCreate' })">
        创建Job
      </a-button>
    </div>
    <a-card class="table-data">
      <a-table
        :data="data.items"
        :loading="queryLoading"
        :pagination="pagination"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
      >
        <template #columns>
          <a-table-column title="名称">
            <template #cell="{ record }">
              <a-link
                @click="router.push({ name: 'DomainJobDetail', params: { id: record.id } })"
                >{{ record.name }}</a-link
              >
            </template>
          </a-table-column>
          <a-table-column title="图标">
            <template #cell="{ record }">
              <SvgIcon v-if="record.icon" :svgCode="record.icon" />
            </template>
          </a-table-column>
          <a-table-column title="状态">
            <template #cell="{ record }">
              <span v-if="record.status">{{ statusMapping[record.status.stage] }}</span>
            </template>
          </a-table-column>
          <a-table-column title="版本">
            <template #cell="{ record }">
              <span v-if="record.status">{{ record.status.version }}</span>
              <span v-else>无</span>
            </template>
          </a-table-column>
          <a-table-column title="执行方式" data-index="runner_type"></a-table-column>
          <a-table-column title="创建人" data-index="create_by"></a-table-column>
          <a-table-column title="创建时间">
            <template #cell="{ record }">
              <ShowTime :timestamp="record.create_at"></ShowTime>
            </template>
          </a-table-column>
          <a-table-column align="center" title="操作" :width="200">
            <template #cell="{ record }">
              <a-button
                type="text"
                :size="app.size"
                @click="router.push({ name: 'DomainJobCreate', query: { id: record.id } })"
              >
                编辑
              </a-button>
              <a-divider direction="vertical" />
              <a-button type="text" :size="app.size" @click="showRunJobHandler(record)">
                运行
              </a-button>
              <a-divider direction="vertical" />
              <a-dropdown @select="handleSelect($event, record.id)">
                <a-button type="text"><icon-more-vertical /></a-button>
                <template #content>
                  <a-doption value="archive" v-if="record.status.stage === 'PUBLISHED'">
                    <template #icon>
                      <icon-archive />
                    </template>
                    归档
                  </a-doption>
                  <a-doption value="publish" v-if="record.status.stage === 'DRAFT'">
                    <template #icon>
                      <icon-send />
                    </template>
                    发布
                  </a-doption>
                  <a-doption value="delete" v-if="record.status.stage === 'DRAFT'">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-doption>

                </template>
              </a-dropdown>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <RunJob :job="currentRunJob" v-model:visible="showRunJob"></RunJob>
  </div>
</template>

<style scoped></style>
