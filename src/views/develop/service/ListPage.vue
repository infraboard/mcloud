<script setup>
import { app } from '@/stores/localstorage'
import { LIST_SERVICE } from '@/api/mcenter/service'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    var resp = await LIST_SERVICE(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询服务失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-space>
        <a-button type="primary" :size="app.size"> 创建服务 </a-button>
        <a-button
          type="primary"
          :size="app.size"
          @click="router.push({ name: 'GitlabImport' })"
          style="background-color: #f96424"
        >
          <template #icon>
            <icon-gitlab />
          </template>
          Gitlab导入
        </a-button>
      </a-space>
    </div>
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
            <a-link @click="router.push({ name: 'ServiceDetail', params: { id: record.id } })">{{
              record.name
            }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="description"></a-table-column>
        <a-table-column title="负责人" data-index="owner"></a-table-column>
        <a-table-column title="类型" data-index="type"></a-table-column>
        <a-table-column title="仓库">
          <template #cell="{ record }">
            <span v-if="record.type === 'SOURCE_CODE'">
              {{ record.code_repository.ssh_url }}
            </span>
            <span v-else>
              {{ record.image_repository.address }}:{{ record.image_repository.version }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="创建时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.create_at"></ShowTime>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
