<script setup>
import * as monaco from 'monaco-editor'
import { onMounted, ref, watch } from 'vue'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// 定义事件
const props = defineProps({
  theme: { type: String, default: 'vs' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '100px' },
  fixedHeight: { type: Boolean, default: false },
  language: { type: String, default: 'json' },
  readOnly: { type: Boolean, default: false },
  modelValue: { type: String, default: '{}' }
})
// 定义事件 v-models
const emit = defineEmits(['update:modelValue'])

const codeRef = ref('')
// 初始化编辑器，确保dom已经渲染
window.MonacoEnvironment = {
  getWorker: (_, label) => {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  }
}

const contentHeight = ref(props.height)
const resetHeight = (editor) => {
  const height = editor.getContentHeight() + 10
  if (!props.fixedHeight && height > 100) {
    contentHeight.value = `${height}px`
  }
}
onMounted(() => {
  // 使用样例参考: https://microsoft.github.io/monaco-editor/playground.html
  // 更多属性请参考: https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IEditorOptions.html
  const editor = monaco.editor.create(codeRef.value, {
    value: props.modelValue,
    readOnly: props.readOnly,
    language: props.language,
    // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light
    theme: props.theme,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    scrollbar: {
      alwaysConsumeMouseWheel: false
    },
    minimap: {
      enabled: false
    }
  })
  resetHeight(editor)

  // 更新数据
  watch(
    () => props.modelValue,
    (newV) => {
      const v = editor.getValue()
      if (newV !== v) {
        editor.setValue(newV)
        resetHeight(editor)
      }
    }
  )

  // 监听值的变化
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    resetHeight(editor)
    emit('update:modelValue', value)
  })
})
</script>

<template>
  <div
    class="view"
    id="external-container"
    ref="codeRef"
    :style="{ width, height: contentHeight }"
  ></div>
</template>

<style scoped>
.view {
  height: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  margin: 0;
  padding: 0;
}
</style>
