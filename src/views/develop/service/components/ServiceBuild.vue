<template>
  <div class="page">
    <div class="table-op">
      <a-button @click="goToCreate" type="primary">
        <template #icon>
          <icon-plus />
        </template>
        添加配置
      </a-button>
      <div class="table-op-right">
        <a-button @click="mannulDebug = !mannulDebug" size="mini" type="text">
          <template #icon>
            <icon-bug />
          </template>
          调试
        </a-button>
      </div>
    </div>
    <div>
      <BuildItem v-for="item in data.items" :key="item.id" :buildConf="item"></BuildItem>
    </div>
    <MannulTest :service="service" v-model:visible="mannulDebug"></MannulTest>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { app } from '@/stores/localstorage'
import { useRouter } from 'vue-router'
import { LIST_BUILD } from '@/api/mflow/build'
import MannulTest from '../../trigger/components/MannulTest.vue'
import BuildItem from './BuildItem.vue'

const router = useRouter()

// 声明属性
defineProps(['service'])

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
  is_template: true,
  service_id: router.currentRoute.value.params.id
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

// 调试窗口
const mannulDebug = ref(false)
</script>
