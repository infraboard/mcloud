<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="$router.go(-1)"> </a-page-header>

    <a-card>
      <a-steps :current="current">
        <a-step>选择权限</a-step>
        <a-step>基本信息</a-step>
        <a-step>权限确认</a-step>
      </a-steps>
      <div class="content">
        <div class="permission" v-if="current === 1">
          <div class="svc-tree">
            <a-tree :default-selected-keys="['0-0']" :data="treeData" :show-line="showLine" />
          </div>
          <dir class="svc-perm">perm</dir>
        </div>
        <div v-if="current === 2">基本信息</div>
        <div v-if="current === 3">权限确认</div>
      </div>
      <a-space align="center" class="summit">
        <a-button type="secondary" :disabled="current <= 1" @click="onPrev">
          <IconLeft /> 上一步
        </a-button>
        <a-button type="primary" :disabled="current >= 3" @click="onNext">
          下一步 <IconRight />
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 判断更新模式
let pageHeader = '创建角色'

// 切换
const current = ref(1)
const onPrev = () => {
  current.value = Math.max(1, current.value - 1)
}
const onNext = () => {
  current.value = Math.min(3, current.value + 1)
}

// 服务树
const treeData = ref([
  {
    title: '服务树',
    key: 'root',
    children: []
  }
])
</script>

<style scoped>
.summit {
  display: flex;
  justify-content: center;
}

.content {
  margin-top: 12px;
  height: 700px;
}

.permission {
  display: flex;
  height: 100%;
}

.svc-tree {
  width: 260px;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 2px 2px 0 0;
  background-color: var(--color-fill-1);
}
</style>
