<script setup>
import { onBeforeMount, ref } from 'vue'

// 声明属性
const props = defineProps({
  ldapSetting: Object
})

// 表单
const form = ref({
  enabled: false,
  url: '',
  bind_dn: '',
  bind_password: '',
  skip_verify: false,
  base_dn: '',
  user_filter: '(uid={input})',
  group_filter: '(|(member={dn})(uid={username})(uid={input}))',
  groupname_attribute: 'cn',
  username_attribute: 'uid',
  mail_attribute: 'mail',
  display_name_attribute: 'displayName',
  data_sync: false
})
const initForm = () => {
  form.value = JSON.parse(JSON.stringify(props.ldapSetting))
  checkIsEdit()
}
onBeforeMount(() => {
  initForm()
})

// 表单是否处于编辑中
const isEdit = ref(false)
const checkIsEdit = () => {
  const ov = JSON.stringify(props.ldapSetting)
  const nv = JSON.stringify(form.value)
  isEdit.value = ov !== nv
}

// 提交表单
const submitLoading = ref(false)
const handleSubmit = () => {
  const payload = JSON.parse(JSON.stringify(form.value))
  // 密码未修改时 不提交
  if (props.ldapSetting.bind_password === payload.bind_password) {
    payload.bind_password = ''
  }
  console.log(payload)
}
</script>

<template>
  <div class="content">
    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="enabled" label="启用" class="enable-line">
          <template #help>
            <span
              >如对LDAP不熟，请参考<a
                class="link"
                href="https://www.jianshu.com/p/4b3c89ce6ac3"
                target="_blank"
                >LDAP简介</a
              ></span
            >
          </template>
          <a-switch type="round" v-model="form.enabled" @change="checkIsEdit">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
        <a-divider orientation="center" type="dotted">服务端配置</a-divider>
        <a-form-item
          field="url"
          label="服务地址"
          :required="form.enabled"
          help="例如: ldap://127.0.0.1:389"
        >
          <a-input v-model="form.url" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item
          field="bind_dn"
          label="Bind DN"
          :required="form.enabled"
          help="管理账号用户, 例如: cn=admin,dc=example,dc=org"
        >
          <a-input v-model="form.bind_dn" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item
          field="bind_password"
          label="Bind Pass"
          :required="form.enabled"
          help="管理账号密码, 至少6位以上"
        >
          <a-input v-model="form.bind_password" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item
          field="skip_verify"
          label="TLS"
          :required="form.enabled"
          help="如果是服务地址是 ldaps时建议开启"
        >
          <a-switch type="round" v-model="form.skip_verify" @change="checkIsEdit" />
        </a-form-item>
        <a-divider orientation="center" type="dotted">用户验证配置</a-divider>
        <a-form-item
          field="base_dn"
          label="Base DN"
          :required="form.enabled"
          help="验证用户时的 Base DN"
        >
          <a-input v-model="form.base_dn" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item
          field="user_filter"
          label="用户过滤器"
          :required="form.enabled"
          help="(uid={input}), 其中{input}表示用户输入的值"
        >
          <a-input v-model="form.user_filter" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item
          field="group_filter"
          label="用户组过滤器"
          :required="form.enabled"
          help="例如: (|(member={dn})(uid={username})(uid={input}))"
        >
          <a-input v-model="form.group_filter" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-divider orientation="center" type="dotted">用户属性映射</a-divider>
        <a-form-item field="groupname_attribute" label="用户组名称" help="用户组的属性名称">
          <a-input v-model="form.groupname_attribute" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item field="username_attribute" label="用户名名称" help="用户名的属性名称">
          <a-input v-model="form.username_attribute" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item field="mail_attribute" label="用户邮箱" help="用户邮箱的属性名称">
          <a-input v-model="form.mail_attribute" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item field="display_name_attribute" label="用户昵称" help="用户昵称的属性名称">
          <a-input v-model="form.display_name_attribute" @change="checkIsEdit"> </a-input>
        </a-form-item>
      </a-form>
      <div class="form-submit">
        <a-space>
          <a-button @click="initForm" :disabled="!isEdit">重置</a-button>
          <a-button type="primary" html-type="submit" :disabled="!isEdit" :loading="submitLoading"
            >保存</a-button
          >
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.enable-line {
  margin-bottom: 0px;
}

.enable-line :deep(.arco-form-item-message) {
  margin-bottom: 0px;
}
</style>
