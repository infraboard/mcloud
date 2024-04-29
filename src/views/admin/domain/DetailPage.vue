<script setup>
import { app } from '@/stores/localstorage'
import LocalUser from './components/LocalUser.vue'
import LdpaSetting from './components/LdpaSetting.vue'
import FeishuSetting from './components/FeishuSetting.vue'
import { GET_DOMAIN } from '@/api/mcenter/domain'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tab = ref(router.currentRoute.value.query.tab)
if (!tab.value) {
  tab.value = 'PASSWORD'
}
const ChangeTab = (v) => {
  tab.value = v
  router.replace({ query: { tab: v } })
}

const settings = ref({
  security_setting: {}
})
onBeforeMount(async () => {
  let resp = await GET_DOMAIN(app.value.token.domain)
  settings.value = resp
})
</script>

<template>
  <div>
    <a-tabs :size="app.size" :active-key="tab" @change="ChangeTab">
      <a-tab-pane key="PASSWORD" title="本地认证">
        <LocalUser :password-config="settings.password_config" v-if="settings.password_config" />
      </a-tab-pane>
      <a-tab-pane key="LDAP" title="LDAP">
        <LdpaSetting :ldap-setting="settings.ldap_setting" v-if="settings.ldap_setting" />
      </a-tab-pane>
      <a-tab-pane key="FEISHU" title="飞书登录">
        <FeishuSetting :feishu-setting="settings.feishu_setting" v-if="settings.feishu_setting" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
