<script setup>
import { app } from '@/stores/localstorage'
import { LIST_JOB, DELETE_JOB, CREATE_JOB } from '@/api/mflow/job'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import RunJob from './components/RunJob.vue'
import PublishJob from './components/PublishJob.vue'
import mapping from '@/stores/mapping'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize,
  inject_k8s_cluster: true
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

// 下载操作
const downloadJobs = () => {
  console.log(selectedKeys.value)
  if (selectedKeys.value.length === 0) {
    Notification.warning({
      content: `请勾选需要导出的任务`,
      closable: true,
      duration: 5000
    })
    return
  }

  // 创建一个虚拟的URL，可以是任何文件的URL
  var fileUrl = `${location.origin}/mflow/api/v1/jobs?ids=${selectedKeys.value.join(',')}`

  // 创建一个<a>标签
  var link = document.createElement('a')
  link.href = fileUrl

  // 设置下载属性，指定下载文件的名称
  link.download = 'export_jobs.json'

  // 将<a>标签添加到页面中
  document.body.appendChild(link)

  // 模拟点击<a>标签，触发下载
  link.click()

  // 下载完成后移除<a>标签
  document.body.removeChild(link)
}
onMounted(() => {
  QueryData()
})

// 当前运行的Job对象
const selectedJob = ref(null)
const showPublishJob = ref(false)
const showRunJob = ref(false)
const showRunJobHandler = (v) => {
  showRunJob.value = true
  selectedJob.value = v
}

// 状态映射表
const statusMapping = {
  DRAFT: '准备中',
  PUBLISHED: '已发布',
  DEPRECATED: '已废弃'
}

// 处理操作
const handleSelect = async (v, record) => {
  switch (v) {
    case 'delete':
      await DELETE_JOB(record.id)
      Notification.success(`删除${record.id}成功`)
      QueryData()
      break
    case 'publish':
      showPublishJob.value = true
      selectedJob.value = record
      break
    default:
      break
  }
}

// 处理选中操作
const selectedKeys = ref([])
const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
}

const customRequest = (option) => {
  console.log(option)

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      var jobs = JSON.parse(e.target.result)
    } catch (error) {
      Notification.error(`导入失败，${error}`)
      return
    }

    for (const element of jobs.items) {
      await CREATE_JOB(element)
      Notification.success(`导入任务${element.name}成功`)
    }
    QueryData()
  }
  reader.readAsText(option.fileItem.file)
}
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button type="primary" @click="router.push({ name: 'DomainJobCreate' })">
        创建任务
      </a-button>
      <div class="table-op-right">
        <a-upload :show-file-list="false" :custom-request="customRequest">
          <template #upload-button>
            <a-button type="text" style="padding: 6px">
              <template #icon>
                <icon-upload />
              </template>
              导入
            </a-button>
          </template>
        </a-upload>

        <a-button type="text" @click="downloadJobs" style="padding: 6px">
          <template #icon>
            <icon-download />
          </template>
          导出
        </a-button>
      </div>
    </div>
    <a-table
      :size="app.size"
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      rowKey="id"
      :row-selection="rowSelection"
      v-model:selectedKeys="selectedKeys"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column align="center" title="名称">
          <template #cell="{ record }">
            <a-link @click="router.push({ name: 'DomainJobDetail', params: { id: record.id } })">{{
              record.display_name
            }}</a-link>
          </template>
        </a-table-column>
        <a-table-column align="center" title="图标">
          <template #cell="{ record }">
            <SvgIcon v-if="record.icon" :svgCode="record.icon" />
          </template>
        </a-table-column>
        <a-table-column align="center" title="状态">
          <template #cell="{ record }">
            <span v-if="record.status">{{ statusMapping[record.status.stage] }}</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="版本">
          <template #cell="{ record }">
            <span v-if="record.status">{{ record.status.version }}</span>
            <span v-else>无</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="访问范围">
          <template #cell="{ record }">
            <span>{{ mapping[record.visiable_mode] }}</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="执行方式">
          <template #cell="{ record }">
            <span>{{ mapping[record.runner_type] }}</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="创建人" data-index="create_by"></a-table-column>
        <a-table-column align="center" title="创建时间">
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
            <a-dropdown @select="handleSelect($event, record)">
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

    <RunJob :job="selectedJob" v-model:visible="showRunJob"></RunJob>
    <PublishJob :job="selectedJob" v-model:visible="showPublishJob" @ok="QueryData()"></PublishJob>
  </div>
</template>

<style scoped>
.table-op-right {
  margin-left: auto;
  display: flex;
}
</style>
