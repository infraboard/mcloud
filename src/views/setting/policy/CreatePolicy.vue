<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_POLICY, CREATE_POLICY } from '@/api/mcenter/policy'
import { Notification } from '@arco-design/web-vue'
import SearchUser from '@/components/SearchUser.vue'
import SearchRole from '@/components/SearchRole.vue'
import dayjs from 'dayjs'

const router = useRouter()
const form = ref({
  enabled: true,
  user_id: '',
  role_id: '',
  scope: [],
  expired_time: 0
})
const isExpired = ref(false)
const expiredTime = ref(0)

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    form.value.expired_time = dayjs(expiredTime.value).hour(23).minute(59).second(59).unix()
    try {
      submitLoading.value = true
      await CREATE_POLICY(data.values)
      Notification.success(`保存成功`)
      router.push({ name: 'NamespacePolicyList' })
    } finally {
      submitLoading.value = false
    }
  }
}

// 判断更新模式
let pageHeader = '创建策略'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined
const GetPolicy = async () => {
  if (!isCreate) {
    pageHeader = '编辑策略'
    const resp = await GET_POLICY(id)
    form.value = resp

    // 补充界面的过期选项
    isExpired.value = resp.expired_time > 0
    if (isExpired.value) {
      expiredTime.value = dayjs.unix(resp.expired_time)
    }
  }
}
onBeforeMount(async () => {
  GetPolicy()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="enabled" label="启用" class="enable-line" help="启用后该策略才会生效">
          <a-switch type="round" v-model="form.enabled">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>

        <a-form-item field="user_id" label="用户" help="请输入用户名进行模糊搜索" required>
          <SearchUser v-model="form.user_id"></SearchUser>
        </a-form-item>
        <a-form-item field="role_id" label="角色" help="成员角色" required>
          <SearchRole v-model="form.role_id"></SearchRole>
        </a-form-item>
        <a-form-item label="是否过期" help="">
          <a-switch type="round" v-model="isExpired">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
        <a-form-item v-if="isExpired" field="expired_time" label="过期时间">
          <a-date-picker
            :disabled-date="(current) => dayjs(current).add(1, 'day').isBefore(dayjs())"
            v-model="expiredTime"
          />
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'NamespacePolicyList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>

<!-- // CreatePolicyRequest 创建策略的请求
message CreatePolicyRequest {
      // 启用该策略
    // @gotags: bson:"enabled" json:"enabled"
    bool enabled = 9; 

    // 用户
    // @gotags: bson:"username" json:"username" validate:"required,lte=120"
    string username = 4;
    // 角色Id
    // @gotags: bson:"role_id" json:"role_id" validate:"required,lte=40"
    string role_id = 5;
    // 该角色的生效范围
    // @gotags: bson:"scope" json:"scope"
    repeated mcube.resource.LabelRequirement scope = 6;
    // 策略过期时间
    // @gotags: bson:"expired_time" json:"expired_time"
    int64 expired_time = 7;
    // 只读策略, 不允许用户修改, 一般用于系统管理
    // @gotags: bson:"read_only" json:"read_only"
    bool read_only = 8;
 
    // 扩展属性
    // @gotags: bson:"extra" json:"extra"
    map<string,string> extra = 14; 
    // 标签
    // @gotags: bson:"labels" json:"labels"
    map<string,string> labels = 15;        
} -->
