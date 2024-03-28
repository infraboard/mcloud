<template>
  <a-modal
    :width="780"
    draggable
    v-model:visible="_visible"
    @cancel="handleClick"
    @ok="handleOk"
    unmount-on-close
  >
    <template #title> 配置 </template>
    <div>
      <a-table
        :draggable="{ type: 'handle', width: 40 }"
        @change="handleChange"
        :columns="paramColumns"
        :pagination="false"
        :data="enum_options"
      >
        <template #label="{ rowIndex }">
          <a-input v-model="enum_options[rowIndex].label"></a-input>
        </template>
        <template #value="{ rowIndex }">
          <a-input v-model="enum_options[rowIndex].value"></a-input>
        </template>
        <template #operate="{ rowIndex }">
          <a-button @click="deleteOption(rowIndex)" status="danger">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </template>
      </a-table>
      <a-button @click="addEnum" size="small" style="margin-top: 6px" type="outline">
        <template #icon>
          <icon-plus />
        </template>
        添加选项
      </a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  options: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['update:visible', 'changed'])
const enum_options = ref([])

// 处理canle
const _visible = computed({
  get() {
    return props.visible
  },
  set(newValue) {
    emit('update:visible', newValue)
  }
})

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      enum_options.value = props.options
    }
  },
  { immediate: true }
)
const handleClick = () => {
  _visible.value = true
  enum_options.value = []
}

const deleteOption = (idx) => {
    enum_options.value.splice(idx, 1)
}

// 处理ok
const handleOk = () => {
  emit('changed', enum_options.value)
  enum_options.value = []
}
const handleChange = (_data) => {
  enum_options.value = _data
}
const paramColumns = [
  {
    title: '选项的值',
    dataIndex: 'value',
    slotName: 'value',
    align: 'center',
    fixed: 'left',
    width: 220
  },
  {
    title: '选项说明',
    dataIndex: 'label',
    slotName: 'label',
    align: 'center'
  },
  {
    title: '操作',
    slotName: 'operate',
    align: 'center',
    width: 60
  }
]
const addEnum = () => {
  enum_options.value.push({
    label: '',
    value: '',
    extensions: {}
  })
}
</script>

<style scoped></style>
