<template>
  <div class="page">
    <a-alert style="margin-bottom: 12px">订阅任务状态通知</a-alert>
    <a-form :model="form" auto-label-width layout="vertical">
      <a-form-item field="im_robot_notify" label="群组通知">
        <a-space wrap>
          <a-button-group v-for="(item, imIndex) in im_robot_notify" :key="item.description">
            <a-button @click="editUpdateImRobotNotify(item, imIndex)">{{
              item.description
            }}</a-button>
            <a-button @click="$emit('updateImRobotNotify', 'delete', imIndex)">
              <template #icon>
                <icon-close />
              </template>
            </a-button>
          </a-button-group>
          <a-button type="outline" size="mini" @click="addUpdateImRobotNotify">
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
    <a-modal
      :visible="showDialogName === 'im_robot_notify'"
      @ok="handleImFormSubmit"
      @cancel="showDialogName = ''"
      draggable
    >
      <template #title> {{ updateImRobotNotifyTitle }}群组通知 </template>
      <a-form :model="imForm" ref="imFormRef" auto-label-width>
        <a-form-item field="url" label="URL" required help="群组的URL">
          <a-input v-model="imForm.url" />
        </a-form-item>
        <a-form-item field="description" label="描述" required help="群组的名称">
          <a-input v-model="imForm.description" />
        </a-form-item>
      </a-form>
    </a-modal>
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
const emit = defineEmits(['updateImRobotNotify'])

const form = ref({ im_robot_notify: [], mention_users: [], webhooks: [] })

const showDialogName = ref('')

// 群组通知
const imFormRef = ref(null)
const imForm = ref({
  url: '',
  header: {},
  events: [],
  description: ''
})
const updateImRobotNotifyTitle = ref('添加')
const addUpdateImRobotNotify = () => {
  updateImRobotNotifyTitle.value = '添加'
  showDialogName.value = 'im_robot_notify'
}
const editUpdateImRobotNotify = (item, imIndex) => {
  imForm.value = { ...item, index: imIndex }
  updateImRobotNotifyTitle.value = '编辑'
  showDialogName.value = 'im_robot_notify'
}
const handleImFormSubmit = async () => {
  const err = await imFormRef.value.validate()
  if (!err) {
    let aciont = 'add'
    if (updateImRobotNotifyTitle.value === '编辑') {
      aciont = 'update'
    }
    emit('updateImRobotNotify', aciont, { ...imForm.value })
    imFormRef.value.resetFields()
    showDialogName.value = ''
  }
}
</script>

<style scoped></style>
