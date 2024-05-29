<script setup>
import { app } from '@/stores/localstorage'
import { LIST_PIPELINE, DELETE_PIPELINE } from '@/api/mflow/pipeline'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import mapping from '@/stores/mapping'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  is_template: true
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
    var resp = await LIST_PIPELINE(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Notification.error(`查询流水线模版失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onMounted(() => {
  QueryData()
})

// 处理操作
const handleSelect = async (v, record) => {
  switch (v) {
    case 'delete':
      await DELETE_PIPELINE(record.id)
      Notification.success(`删除${record.id}成功`)
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
      <a-button
        type="primary"
        :size="app.size"
        @click="router.push({ name: 'DomainPipelineCreate' })"
      >
        创建流水线
      </a-button>
    </div>
    <a-table
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column align="center" title="名称">
          <template #cell="{ record }">
            <a-link
              @click="router.push({ name: 'DomainPipelineDetail', params: { id: record.id } })"
              >{{ record.name }}</a-link
            >
          </template>
        </a-table-column>
        <a-table-column align="center" title="描述" data-index="description"></a-table-column>
        <a-table-column align="center" title="访问范围">
          <template #cell="{ record }">
            <span>{{ mapping.visiable[record.visiable_mode] }}</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="创建人" data-index="create_by"></a-table-column>
        <a-table-column align="center" title="创建时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.create_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="220">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              @click="router.push({ name: 'DomainPipelineCreate', query: { id: record.id } })"
            >
              编辑
            </a-button>
            <a-divider direction="vertical" />
            <a-dropdown @select="handleSelect($event, record)">
              <a-button type="text"><icon-more-vertical /></a-button>
              <template #content>
                <a-doption value="delete">
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
  </div>
</template>

<style scoped></style>
