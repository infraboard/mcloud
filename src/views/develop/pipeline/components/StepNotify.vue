<template>
  <div class="page">
    <a-alert style="margin-bottom: 12px">订阅任务状态通知</a-alert>
    <a-form :model="form" auto-label-width layout="vertical">
      <a-form-item field="im_robot_notify" label="群组通知">
        <a-space wrap>
          <a-button-group
            size="small"
            v-for="(item, imIndex) in im_robot_notify"
            :key="item.description"
          >
            <a-button @click="editUpdateImRobotNotify(item, imIndex)">{{
              item.description
            }}</a-button>
            <a-button v-if="edit" @click="$emit('updateImRobotNotify', 'delete', imIndex)">
              <template #icon>
                <icon-close />
              </template>
            </a-button>
          </a-button-group>
          <a-button v-if="edit" type="outline" size="mini" @click="addUpdateImRobotNotify">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item field="mention_users" label="个人通知">
        <a-space wrap>
          <a-button-group size="small" v-for="(item, muIndex) in mention_users" :key="item.description">
            <a-button @click="editUpdateMentitionUserNotify(item, muIndex)">{{
              item.user_name
            }}</a-button>
            <a-button v-if="edit" @click="$emit('updateMentitionUserNotify', 'delete', muIndex)">
              <template #icon>
                <icon-close />
              </template>
            </a-button>
          </a-button-group>
          <a-button v-if="edit" type="outline" size="mini" @click="addUpdateMentitionUserNotify">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item field="webhooks" label="Web Hooks" tooltip="通过WebHook与外部系统集成">
        <a-space wrap>
          <a-button-group size="small" v-for="(item, whIndex) in webhooks" :key="item.description">
            <a-button @click="editUpdateWebHookNotify(item, whIndex)">{{
              item.description
            }}</a-button>
            <a-button v-if="edit" @click="$emit('updateWebHookNotify', 'delete', whIndex)">
              <template #icon>
                <icon-close />
              </template>
            </a-button>
          </a-button-group>
          <a-button v-if="edit" type="outline" size="mini" @click="addUpdateWebHookNotify">
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
      @cancel="handleImFormCancel"
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
    <a-modal
      :visible="showDialogName === 'mention_users'"
      @ok="handleMentitionUserSubmit"
      @cancel="handleMentitionUserFormCancel"
      draggable
    >
      <template #title> {{ updateMentitionUserNotifyTitle }}个人通知 </template>
      <a-form :model="mentitionUserForm" ref="mentitionUserFormRef" auto-label-width>
        <a-form-item field="user_name" label="用户" required help="用户名称">
          <SearchUser v-model="mentitionUserForm.user_name"></SearchUser>
        </a-form-item>
        <a-form-item field="notify_types" label="通知方式" required help="默认邮件通知">
          <a-select  v-model="mentitionUserForm.notify_types" :default-value="['MAIL']" multiple>
            <a-option value="MAIL">邮件</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :visible="showDialogName === 'webhooks'"
      @ok="handleWebHookSubmit"
      @cancel="handleWebHookFormCancel"
      draggable
    >
      <template #title> {{ updateWebHookNotifyTitle }}Web Hook </template>
      <a-form :model="webHookForm" ref="webHookFormRef" auto-label-width>
        <a-form-item field="url" label="URL" required help="Web Hook的URL">
          <a-input v-model="webHookForm.url" />
        </a-form-item>
        <a-form-item field="description" label="描述" required help="描述">
          <a-input v-model="webHookForm.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchUser from '@/components/SearchUser.vue'

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
const emit = defineEmits(['updateImRobotNotify', 'updateWebHookNotify', 'updateMentitionUserNotify'])

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
const handleImFormCancel = () => {
  imFormRef.value.resetFields()
  showDialogName.value = ''
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

// 个人通知 mention_users
const mentitionUserFormRef = ref(null)
const mentitionUserForm = ref({
  user_name: '',
  notify_types: ['MAIL'],
  events: [],
  description: ''
})
const updateMentitionUserNotifyTitle = ref('添加')
const addUpdateMentitionUserNotify = () => {
  updateMentitionUserNotifyTitle.value = '添加'
  showDialogName.value = 'mention_users'
}
const editUpdateMentitionUserNotify = (item, imIndex) => {
  mentitionUserForm.value = { ...item, index: imIndex }
  updateMentitionUserNotifyTitle.value = '编辑'
  showDialogName.value = 'mention_users'
}
const handleMentitionUserFormCancel = () => {
  mentitionUserFormRef.value.resetFields()
  showDialogName.value = ''
}

const handleMentitionUserSubmit = async () => {
  const err = await mentitionUserFormRef.value.validate()
  if (!err) {
    let aciont = 'add'
    if (updateMentitionUserNotifyTitle.value === '编辑') {
      aciont = 'update'
    }
    emit('updateMentitionUserNotify', aciont, { ...mentitionUserForm.value })
    mentitionUserFormRef.value.resetFields()
    showDialogName.value = ''
  }
}


// WebHook通知
const webHookFormRef = ref(null)
const webHookForm = ref({
  url: '',
  header: {},
  events: [],
  description: ''
})
const updateWebHookNotifyTitle = ref('添加')
const addUpdateWebHookNotify = () => {
  updateWebHookNotifyTitle.value = '添加'
  showDialogName.value = 'webhooks'
}
const editUpdateWebHookNotify = (item, imIndex) => {
  webHookForm.value = { ...item, index: imIndex }
  updateWebHookNotifyTitle.value = '编辑'
  showDialogName.value = 'webhooks'
}
const handleWebHookFormCancel = () => {
  webHookFormRef.value.resetFields()
  showDialogName.value = ''
}

const handleWebHookSubmit = async () => {
  const err = await webHookFormRef.value.validate()
  if (!err) {
    let aciont = 'add'
    if (updateWebHookNotifyTitle.value === '编辑') {
      aciont = 'update'
    }
    emit('updateWebHookNotify', aciont, { ...webHookForm.value })
    webHookFormRef.value.resetFields()
    showDialogName.value = ''
  }
}
</script>

<style scoped></style>
