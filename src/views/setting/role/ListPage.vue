<script setup>
import { app, isResourceOwner } from '@/stores/localstorage'
import { LIST_ROLE, DELETE_ROLE } from '@/api/mcenter/role'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from '@arco-design/web-vue'
import mapping from '@/stores/mapping'

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
    var resp = await LIST_ROLE(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } finally {
    queryLoading.value = false
  }
}

onMounted(() => {
  QueryData()
})

// 处理选择
const actionLoading = ref(false)
const handleSelect = async (v, record) => {
  switch (v) {
    case 'delete':
      Modal.warning({
        title: `删除提醒`,
        content: `是否真的要删除角色：${record.name} ？`,
        onOk: async () => {
          try {
            actionLoading.value = true
            await DELETE_ROLE(record.id)
            QueryData()
          } finally {
            actionLoading.value = false
          }
        },
        okLoading: actionLoading.value
      })
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
      <a-button type="primary" :size="app.size" @click="router.push({ name: 'CreateRole' })">
        创建角色
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
        <a-table-column title="名称">
          <template #cell="{ record }">
            <a-link @click="router.push({ name: 'RoleDetail', query: { id: record.id } })">{{
              record.name
            }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="可见范围">
          <template #cell="{ record }">
            {{ mapping.visiable[record.visiable] }}
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="description"></a-table-column>
        <a-table-column title="创建时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.create_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <div v-if="isResourceOwner(record.domain, record.namespace)">
              <a-button
                type="text"
                :size="app.size"
                @click="router.push({ name: 'CreateRole', query: { id: record.id } })"
              >
                编辑
              </a-button>
              <a-divider direction="vertical" />
              <a-dropdown @select="handleSelect($event, record)">
                <a-button type="text"><icon-more-vertical /></a-button>
                <template #content>
                  <a-doption value="delete" style="color: rgb(var(--red-6))"
                    ><icon-delete /> 删除</a-doption
                  >
                </template>
              </a-dropdown>
            </div>
            <div style="color: var(--color-neutral-6)" v-else>非本空间资源</div>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
