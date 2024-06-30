<script setup>
import { app, showMemberManagement } from '@/stores/localstorage'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import mapping from '@/stores/mapping'
import NamespaceSelect from './NamespaceSelect.vue'

const router = useRouter()
const Logout = () => {
  app.value.isLogin = false
  router.push({ name: 'LoginPage' })
}
const JumpToUpdatePassword = () => {
  router.push({ name: 'UpdateMyPassword' })
}
const JumpToAdmin = () => {
  router.push({ name: app.value.menu.admin })
}
const ChangeSystem = () => {
  if (app.value.system === '') {
    app.value.system = 'ServiceConsole'
  }

  switch (app.value.system) {
    case 'SettingPage':
      try {
        router.push({ name: app.value.menu.setting })
      } catch (error) {
        console.log(error)
        router.push({ name: 'NamespacePolicyList' })
      }
      break
    case 'ResourcePage':
      try {
        router.push({ name: app.value.menu.resource })
      } catch (error) {
        console.log(error)
        router.push({ name: 'ResourceSearch' })
      }
      break
    case 'K8sPage':
      try {
        router.push({ name: app.value.menu.k8s })
      } catch (error) {
        console.log(error)
        router.push({ name: 'K8sClusterList' })
      }
      break
    case 'DevelopPage':
      try {
        router.push({ name: app.value.menu.develop })
      } catch (error) {
        console.log(error)
        router.push({ name: 'BaseDevelop' })
      }
      break
    default:
      router.push({ name: app.value.system })
      break
  }
}
const JumpToFrontend = () => {
  ChangeSystem()
}
const menuItemClickHandler = (routeName) => {
  app.value.system = routeName
  ChangeSystem()
}

// 监听URL变化
const isAdminPage = ref(router.currentRoute.value.fullPath.indexOf('/system/admin') === 0)
watch(
  () => router.currentRoute.value.fullPath,
  (value) => {
    isAdminPage.value = value.indexOf('/system/admin') === 0
  }
)
</script>

<template>
  <a-affix :offsetTop="1">
    <!-- 顶部导航 -->
    <div class="nav">
      <!-- logo显示区 -->
      <div class="logo">
        <span>{{ app.token.meta.domain_description }}</span>
      </div>
      <!-- 空间选择区 -->
      <div v-if="!isAdminPage" class="namespace-choice">
        <NamespaceSelect></NamespaceSelect>
      </div>

      <!-- 系统菜单 -->
      <div v-if="!isAdminPage" class="nav-menu">
        <a-menu
          mode="horizontal"
          :default-selected-keys="['ServiceConsole']"
          :selected-keys="[app.system]"
          @menu-item-click="menuItemClickHandler"
        >
          <a-menu-item key="ServiceConsole"> 工作台 </a-menu-item>
          <a-menu-item key="SettingPage" v-if="showMemberManagement()">成员管理</a-menu-item>
          <a-menu-item key="ResourcePage">资源管理</a-menu-item>
          <a-menu-item key="K8sClusterList">容器平台</a-menu-item>
          <a-menu-item key="DevelopPage">研发交付</a-menu-item>
        </a-menu>
      </div>
      <!-- 登录操作区 -->
      <div class="nav-right">
        <div class="user-op" v-if="!isAdminPage">
          <a-button
            v-if="app.token.user_type === 'SUPPER' || app.token.user_type === 'PRIMARY'"
            type="text"
            @click="JumpToAdmin"
          >
            管理后台
          </a-button>
        </div>
        <div class="user-op" v-else>
          <a-button type="text" @click="JumpToFrontend">
            <template #icon>
              <icon-home />
            </template>
            返回前台
          </a-button>
        </div>

        <div class="user-info">
          <a-trigger>
            <div style="display: flex">
              <div class="user-name">
                <div class="username">{{ app.token.username }}</div>
                <div class="user-type">{{ mapping.USER_TYPE[app.token.user_type] }}</div>
              </div>
              <div class="user-avatar">
                <a-avatar :size="30" :style="{ backgroundColor: '#00d0b6' }">{{
                  app.token.username[0].toUpperCase()
                }}</a-avatar>
              </div>
            </div>
            <template #content>
              <a-card class="user-menu">
                <template #title>
                  <div class="user-card-title">
                    <div class="user-card-line">
                      <div style="font-weight: 600; font-size: 14px; width: 60px">
                        {{ app.token.username }}
                      </div>
                      <a-tag color="arcoblue" bordered>{{
                        mapping.USER_TYPE[app.token.user_type]
                      }}</a-tag>
                    </div>
                    <a-space>
                      <span>账号 ID</span>
                      <span style="margin-left: 12px">{{ app.token.user_id }}</span>
                    </a-space>
                  </div>
                </template>
                <template #default>
                  <div class="user-menu-content">
                    <a-button class="user-menu-item" type="text" @click="JumpToUpdatePassword"
                      >修改密码</a-button
                    >
                  </div>
                </template>
                <template #actions>
                  <a-button class="user-menu-item" type="text" @click="Logout">退出</a-button>
                </template>
              </a-card>
            </template>
          </a-trigger>
        </div>
      </div>
    </div>
  </a-affix>
</template>

<style scoped>
.nav {
  /* margin-top: 46px; */
  padding: 0 0 0 8px;
  height: 59px;
  width: 100vw;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(229, 230, 235);
  background-color: #fff;
}

.nav-menu {
  width: 100%;
  height: 100%;
}

.nav-menu :deep(.arco-menu-selected) {
  margin-top: 14px;
}

.nav-right {
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-right :deep(.arco-btn-size-medium) {
  height: 100%;
}

.nav :deep(.arco-menu) {
  height: 100%;
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-inner) {
  padding: 0px 0px;
}

.nav :deep(.arco-menu-selected-label) {
  bottom: -7px;
}

.namespace-choice {
  display: flex;
  align-items: center;
  width: 160px;
  padding: 4px;
}

.namespace-choice :deep(.arco-select-view-single) {
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 193px !important;
  font-size: 12px;
  color: var(--color-text-2);
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 120px;
  cursor: pointer;
}

.user-card-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info:hover {
  background-color: var(--color-neutral-2);
}

.user-op {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-name {
  display: flex;
  width: 90px;
  font-size: 12px;
  flex-direction: column;
  align-items: flex-end;
}

.user-type {
  font-size: 0.9em;
  color: var(--color-neutral-6);
}

.username {
  font-size: inherit;
}

.user-avatar {
  margin: 0px 10px;
}

.user-menu {
  width: 260px;
  margin-top: 12px;
}

.user-menu :deep(.arco-card-header) {
  border-bottom: 1px solid var(--color-neutral-3);
  height: 80px !important;
  background-color: var(--color-neutral-2);
}

.user-menu :deep(.arco-card-body) {
  padding: 0 0;
}

.user-menu :deep(.arco-card-actions) {
  border-top: 1px solid var(--color-neutral-3);
  margin-top: 0px;
}

.user-menu :deep(.arco-card-actions-right) {
  width: 100%;
}
.user-menu :deep(.arco-card-actions-item) {
  width: 100%;
}

.user-menu-item {
  width: 100%;
  color: var(--color-neutral-8);
  height: 50px;
  font-weight: 400;
  font-size: 12px;
}
</style>
