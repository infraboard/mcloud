<template>
  <div class="page">
    <a-alert style="margin-bottom: 12px">订阅任务状态通知</a-alert>
    <a-form :model="form" auto-label-width layout="vertical">
      <a-form-item field="im_robot_notify" label="群组通知">
        <a-space>
          <a-tag v-for="item in im_robot_notify" :key="item.description">{{
            item.description
          }}</a-tag>
          <a-button type="outline" size="mini">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item field="mention_users" label="个人通知">
        <a-space>
          <a-tag v-for="item in mention_users" :key="item.UserName">{{ item.UserName }}</a-tag>
          <a-button type="outline" size="mini">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item field="webhooks" label="Web Hooks" tooltip="通过WebHook与外部系统集成">
        <a-space>
          <a-tag v-for="item in webhooks" :key="item.description">{{ item.description }}</a-tag>
          <a-button type="outline" size="mini">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  im_robot_notify: {
    type: Array,
    default() {
      return []
    }
  },
  mention_users: {
    type: Array,
    default() {
      return []
    }
  },
  webhooks: {
    type: Array,
    default() {
      return []
    }
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const form = ref({ im_robot_notify: [], mention_users: [], webhooks: [] })
</script>

<style scoped></style>
