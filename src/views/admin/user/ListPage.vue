<script setup>
import { app } from '@/stores/localstorage'
import { LIST_SUB_USER } from '@/api/mcenter/user'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ResetPassword from './components/ResetPassword.vue'

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
const data = reactive({ items: [] })
const QueryData = async () => {
  // 补充分页参数
  queryParams.page_number = pagination.current
  queryParams.page_size = pagination.pageSize

  try {
    queryLoading.value = true
    var resp = await LIST_SUB_USER(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询用户失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

// 更多操作
const currentAction = reactive({
  title: '',
  record: {}
})
const actionMap = {
  重置密码: ResetPassword
}
const selectAction = (record, title) => {
  currentAction.title = title
  currentAction.record = record
}
const closeDrawer = () => {
  currentAction.title = ''
}

onMounted(() => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button type="primary" :size="app.size" @click="router.push({ name: 'CreateSubUser' })">
        创建用户
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
        <a-table-column title="用户名" data-index="username"></a-table-column>
        <a-table-column title="类型" data-index="type"></a-table-column>
        <a-table-column title="状态" data-index="status.locked"></a-table-column>
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
              @click="router.push({ name: 'CreateSubUser', query: { id: record.id } })"
            >
              编辑
            </a-button>
            <a-divider direction="vertical" />
            <a-dropdown>
              <a-button type="text"><icon-more-vertical /></a-button>
              <template #content>
                <a-doption @click="selectAction(record, '重置密码')">重置密码</a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-drawer
      :width="340"
      :visible="currentAction.title !== ''"
      unmountOnClose
      :footer="false"
      @cancel="closeDrawer"
    >
      <template #title>
        {{ currentAction.title }}
      </template>
      <component
        :is="actionMap[currentAction.title]"
        v-bind="{ record: currentAction.record }"
        v-on="{ changed: closeDrawer }"
      />
    </a-drawer>
  </div>
</template>

<style scoped></style>
