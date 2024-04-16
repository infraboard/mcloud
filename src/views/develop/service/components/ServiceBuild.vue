<template>
  <div class="page">
    <div class="table-op">
      <a-button @click="goToCreate" type="primary">
        <template #icon>
          <icon-plus />
        </template>
        添加配置
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { app } from '@/stores/localstorage'
import { useRouter } from 'vue-router'
import { LIST_BUILD } from '@/api/mflow/build'

const router = useRouter()

const goToCreate = () => {
  router.push({
    name: 'BuildConfCreate',
    params: {
      id: router.currentRoute.value.params.id
    }
  })
}

onMounted(() => {
  QueryData()
})

// 查询数据
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  is_template: true
})

const queryLoading = ref(false)
const data = reactive({ items: [], total: 0 })
const QueryData = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_BUILD(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Notification.error(`查询构建配置失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
</script>
