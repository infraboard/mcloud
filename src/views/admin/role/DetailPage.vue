<script setup>
import { app } from '@/stores/localstorage'
import { GET_ROLE } from '@/api/mcenter/role'
import { Notification } from '@arco-design/web-vue'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FormatDate } from '@/tools/time.js'

const router = useRouter()
const id = router.currentRoute.value.query.id
const attrMap = {
  name: '角色名称',
  description: '角色描述',
  create_by: '创建人',
  create_at: '创建时间',
  enabled: '启用状态',
  visiable: '可见范围'
}

const roleAttr = ref([])
const rolePerm = ref([])
const GetRole = async () => {
  try {
    let resp = await GET_ROLE(id)
    rolePerm.value = resp.permissions

    let attr = []
    Object.keys(attrMap).forEach((key) => {
      let value = resp[key]
      switch (key) {
        case 'create_at':
          value = FormatDate(value * 1000)
          break
      }
      let label = attrMap[key]
      if (label) {
        attr.push({ label, value })
      }
    })
    roleAttr.value = attr
  } catch (error) {
    Notification.error(`查询角色详情失败: ${error}`)
  }
}

onBeforeMount(() => {
  GetRole()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header title="角色详情" @back="router.go(-1)"> </a-page-header>
    <a-card>
      <a-descriptions
        :size="app.size"
        :label-style="{ fontSize: '12px' }"
        title="基础信息"
        :data="roleAttr"
      >
        <a-descriptions-item v-for="item of roleAttr" :key="item.label" :label="item.label">
          <span style="font-size: 12px">{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card style="margin-top: 12px">
      <div class="arco-descriptions-title">角色权限</div>
      <a-table :data="rolePerm" :bordered="{ cell: true }" :pagination="false">
        <template #columns>
          <a-table-column title="描述" data-index="desc"></a-table-column>
          <a-table-column title="效力" data-index="effect"></a-table-column>
          <a-table-column title="资源">
            <template #cell="{ record }">
              {{ record.service_id }}:{{ record.resource_name }}
            </template>
          </a-table-column>
          <a-table-column title="权限">
            <template #cell="{ record }">
              <span v-if="record.match_all"> * </span>
              <span v-else>
                {{ record.label_values }}
              </span>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
