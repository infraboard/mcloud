<script setup>
import { app } from '@/stores/localstorage'
import { LIST_JOB_TASK } from '@/api/mflow/task'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize,
  job_id: router.currentRoute.value.params.id
})

const pageChange = (v) => {
  pagination.current = v
  QueryData()
}
const pageSizeChange = (v) => {
  pagination.pageSize = v
  pagination.current = 1
  QueryData()
}

const queryLoading = ref(false)
const data = reactive({ items: [], total: 0 })
const QueryData = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_JOB_TASK(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Notification.error(`查询Task失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <a-table
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column title="开始时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.status.start_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column title="模式" data-index="run_mode"></a-table-column>
        <a-table-column title="调试模式" data-index="dry_run"></a-table-column>
        <a-table-column title="状态">
          <template #cell="{ record }">
            <span>{{ record.status.stage }}</span>
          </template>
        </a-table-column>
        <a-table-column title="耗时">
          <template #cell="{ record }">
            <ShowTime
              v-if="record.status.end_at"
              :timestamp="record.status.end_at - record.status.start_at"
              isDuration
            ></ShowTime>
            <span v-else>-</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              @click="router.push({ name: 'JobTaskConsole', params: { id: record.task_id } })"
            >
              <template #icon>
                <icon-file />
              </template>
              日志
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>

<!-- {
  "skip_run": false,
  "number": 0,
  "task_id": "task-ci85q2ro99m31pv5pho0",
  "run_by": "",
  "token": "ci85q2ro99m31pv5phog",
  "domain": "default",
  "namespace": "default",
  "pipeline_task": "",
  "stage_name": "",
  "task_name": "",
  "job_name": "docker_build@default.default",
  "run_mode": "NORMAL",
  "rollback_params": {
   "params": []
  },
  "ignore_failed": false,
  "dry_run": false,
  "webhooks": [
   {
    "url": "https://open.feishu.cn/open-apis/bot/v2/hook/74c50022-ed45-4e5c-b82c-f6c7388e9977",
    "header": {},
    "events": [],
    "description": ""
   }
  ],
  "mention_users": [
   {
    "user_name": "admin",
    "notify_type": [
     "IM"
    ],
    "events": [
     "SUCCEEDED"
    ],
    "comment": ""
   }
  ],
  "labels": {
   "Language": "*",
   "cluster_id": "k8s-test",
   "namespace": "default"
  },
  "create_at": 1687182603,
  "update_at": 0,
  "update_by": "",
  "stage": "ACTIVE",
  "start_at": 1687182603,
  "end_at": 0,
  "message": "",
  "detail": "metadata:\n  annotations:\n    task.mpaas.inforboar.io/id: task-ci85q2ro99m31pv5pho0\n  creationTimestamp: \"2023-06-19T13:50:05Z\"\n  labels:\n    app: app01\n  managedFields:\n  - apiVersion: batch/v1\n    fieldsType: FieldsV1\n    fieldsV1:\n      f:metadata:\n        f:annotations:\n          .: {}\n          f:task.mpaas.inforboar.io/id: {}\n        f:labels:\n          .: {}\n          f:app: {}\n      f:spec:\n        f:activeDeadlineSeconds: {}\n        f:backoffLimit: {}\n        f:completions: {}\n        f:parallelism: {}\n        f:template:\n          f:metadata:\n            f:labels:\n              .: {}\n              f:app: {}\n          f:spec:\n            f:containers:\n              k:{\"name\":\"build-and-push\"}:\n                .: {}\n                f:args: {}\n                f:command: {}\n                f:env:\n                  .: {}\n                  k:{\"name\":\"_JOB_TASK_ID\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"_JOB_TASK_UPDATE_TOKEN\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"APP_DOCKERFILE\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"APP_VERSION\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_COMPRESS\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_ENABLE\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_REPO\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CUSTOM_PLATFORM\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_BRANCH\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_COMMIT_ID\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_SSH_URL\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"IMAGE_REPOSITORY\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                f:image: {}\n                f:imagePullPolicy: {}\n                f:name: {}\n                f:resources: {}\n                f:terminationMessagePath: {}\n                f:terminationMessagePolicy: {}\n                f:volumeMounts:\n                  .: {}\n                  k:{\"mountPath\":\"/kaniko/.docker\"}:\n                    .: {}\n                    f:mountPath: {}\n                    f:name: {}\n                  k:{\"mountPath\":\"/workspace\"}:\n                    .: {}\n                    f:mountPath: {}\n                    f:name: {}\n                f:workingDir: {}\n            f:dnsPolicy: {}\n            f:initContainers:\n              .: {}\n              k:{\"name\":\"download\"}:\n                .: {}\n                f:args: {}\n                f:command: {}\n                f:env:\n                  .: {}\n                  k:{\"name\":\"_JOB_TASK_ID\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"_JOB_TASK_UPDATE_TOKEN\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"APP_DOCKERFILE\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"APP_VERSION\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_COMPRESS\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_ENABLE\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CACHE_REPO\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"CUSTOM_PLATFORM\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_BRANCH\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_COMMIT_ID\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_SSH_COMMAND\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"GIT_SSH_URL\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                  k:{\"name\":\"IMAGE_REPOSITORY\"}:\n                    .: {}\n                    f:name: {}\n                    f:value: {}\n                f:image: {}\n                f:imagePullPolicy: {}\n                f:name: {}\n                f:resources: {}\n                f:terminationMessagePath: {}\n                f:terminationMessagePolicy: {}\n                f:volumeMounts:\n                  .: {}\n                  k:{\"mountPath\":\"/etc/secret-volume\"}:\n                    .: {}\n                    f:mountPath: {}\n                    f:name: {}\n                    f:readOnly: {}\n                  k:{\"mountPath\":\"/workspace\"}:\n                    .: {}\n                    f:mountPath: {}\n                    f:name: {}\n                f:workingDir: {}\n            f:restartPolicy: {}\n            f:schedulerName: {}\n            f:securityContext: {}\n            f:terminationGracePeriodSeconds: {}\n            f:volumes:\n              .: {}\n              k:{\"name\":\"kaniko-secret\"}:\n                .: {}\n                f:name: {}\n                f:secret:\n                  .: {}\n                  f:defaultMode: {}\n                  f:secretName: {}\n              k:{\"name\":\"secret-volume\"}:\n                .: {}\n                f:name: {}\n                f:secret:\n                  .: {}\n                  f:defaultMode: {}\n                  f:secretName: {}\n              k:{\"name\":\"workspace\"}:\n                .: {}\n                f:emptyDir: {}\n                f:name: {}\n    manager: impl.test\n    operation: Update\n    time: \"2023-06-19T13:50:05Z\"\n  name: task-ci85q2ro99m31pv5pho0\n  namespace: default\n  resourceVersion: \"582201969\"\n  selfLink: /apis/batch/v1/namespaces/default/jobs/task-ci85q2ro99m31pv5pho0\n  uid: e03070ff-4967-4bfb-a205-42f867f47119\nspec:\n  activeDeadlineSeconds: 1800\n  backoffLimit: 3\n  completions: 1\n  parallelism: 1\n  selector:\n    matchLabels:\n      controller-uid: e03070ff-4967-4bfb-a205-42f867f47119\n  template:\n    metadata:\n      creationTimestamp: null\n      labels:\n        app: build-pod\n        controller-uid: e03070ff-4967-4bfb-a205-42f867f47119\n        job-name: task-ci85q2ro99m31pv5pho0\n    spec:\n      containers:\n      - args:\n        - -c\n        - /kaniko/executor --cache=${CACHE_ENABLE} --cache-repo=${CACHE_REPO} --compressed-caching=${CACHE_COMPRESS}\n          --custom-platform=${CUSTOM_PLATFORM} --destination=${IMAGE_REPOSITORY}:${APP_VERSION}\n          --dockerfile=${APP_DOCKERFILE}\n        command:\n        - sh\n        env:\n        - name: GIT_SSH_URL\n          value: git@github.com:infraboard/mcenter.git\n        - name: APP_DOCKERFILE\n          value: Dockerfile\n        - name: GIT_BRANCH\n          value: master\n        - name: GIT_COMMIT_ID\n          value: ff533afb86d35862789003f1d51bf356c7cf13ac\n        - name: CACHE_ENABLE\n          value: \"true\"\n        - name: CACHE_REPO\n          value: registry.cn-hangzhou.aliyuncs.com/build_cache/mpaas\n        - name: CACHE_COMPRESS\n          value: \"true\"\n        - name: CUSTOM_PLATFORM\n          value: linux/amd64\n        - name: IMAGE_REPOSITORY\n          value: registry.cn-hangzhou.aliyuncs.com/infraboard/mcenter\n        - name: APP_VERSION\n          value: v0.0.7\n        - name: _JOB_TASK_ID\n          value: task-ci85q2ro99m31pv5pho0\n        - name: _JOB_TASK_UPDATE_TOKEN\n          value: ci85q2ro99m31pv5phog\n        image: registry.cn-hangzhou.aliyuncs.com/godev/kaniko-project.executor:v1.9.2-debug\n        imagePullPolicy: IfNotPresent\n        name: build-and-push\n        resources: {}\n        terminationMessagePath: /dev/termination-log\n        terminationMessagePolicy: File\n        volumeMounts:\n        - mountPath: /workspace\n          name: workspace\n        - mountPath: /kaniko/.docker\n          name: kaniko-secret\n        workingDir: /workspace\n      dnsPolicy: ClusterFirst\n      initContainers:\n      - args:\n        - -c\n        - git clone ${GIT_SSH_URL} workspace --branch=${GIT_BRANCH} --single-branch\n          \u0026\u0026 cd workspace \u0026\u0026 git reset --hard ${GIT_COMMIT_ID}\n        command:\n        - sh\n        env:\n        - name: GIT_SSH_COMMAND\n          value: ssh -i /etc/secret-volume/id_rsa -o StrictHostKeyChecking=no\n        - name: GIT_SSH_URL\n          value: git@github.com:infraboard/mcenter.git\n        - name: APP_DOCKERFILE\n          value: Dockerfile\n        - name: GIT_BRANCH\n          value: master\n        - name: GIT_COMMIT_ID\n          value: ff533afb86d35862789003f1d51bf356c7cf13ac\n        - name: CACHE_ENABLE\n          value: \"true\"\n        - name: CACHE_REPO\n          value: registry.cn-hangzhou.aliyuncs.com/build_cache/mpaas\n        - name: CACHE_COMPRESS\n          value: \"true\"\n        - name: CUSTOM_PLATFORM\n          value: linux/amd64\n        - name: IMAGE_REPOSITORY\n          value: registry.cn-hangzhou.aliyuncs.com/infraboard/mcenter\n        - name: APP_VERSION\n          value: v0.0.7\n        - name: _JOB_TASK_ID\n          value: task-ci85q2ro99m31pv5pho0\n        - name: _JOB_TASK_UPDATE_TOKEN\n          value: ci85q2ro99m31pv5phog\n        image: registry.cn-hangzhou.aliyuncs.com/godev/git:2.39.2\n        imagePullPolicy: IfNotPresent\n        name: download\n        resources: {}\n        terminationMessagePath: /dev/termination-log\n        terminationMessagePolicy: File\n        volumeMounts:\n        - mountPath: /workspace\n          name: workspace\n        - mountPath: /etc/secret-volume\n          name: secret-volume\n          readOnly: true\n        workingDir: /\n      restartPolicy: Never\n      schedulerName: default-scheduler\n      securityContext: {}\n      terminationGracePeriodSeconds: 30\n      volumes:\n      - emptyDir: {}\n        name: workspace\n      - name: secret-volume\n        secret:\n          defaultMode: 384\n          secretName: git-ssh-key\n      - name: kaniko-secret\n        secret:\n          defaultMode: 420\n          secretName: kaniko-secret\nstatus: {}\n",
  "runtime_envs": null,
  "markdown_output": "",
  "temporary_resources": [],
  "events": null,
  "webhook_status": null,
  "notify_status": null,
  "job": {
   "id": "chrfom3o99mdodm63n60",
   "create_at": 1685519448,
   "update_at": 1686712932,
   "update_by": "",
   "runner_type": "K8S_JOB",
   "runner_spec": "apiVersion: batch/v1 # 版本号\nkind: Job # 类型\nmetadata: # 元数据\n  name: test-job # job 名称\n  namespace: default # 所属命名空间\n  labels: #标签\n    app: app01\nspec: # 详情描述\n  completions: 1 # 指定 job 需要成功运行 Pods 的次数。默认值: 1\n  parallelism: 1 # 指定 job 在任一时刻应该并发运行 Pods 的数量。默认值: 1，如果上面的 completions 为 6 ，这个参数为 3 ，表示有 6 个 pod，允许有 3 个 pod 并发运行\n  activeDeadlineSeconds: 1800 # 指定 job 可运行的时间期限，超过时间还未结束，系统将会尝试进行终止。\n  backoffLimit: 3 # 指定 job 失败后进行重试的次数。默认是 6\n  # manualSelector: true # 是否可以使用 selector 选择器选择 pod，默认是 false\n  # selector: # 选择器，通过它指定该控制器管理哪些 pod\n  #   matchLabels:      # Labels 匹配规则\n  #     app: counter-pod\n  # matchExpressions: # Expressions 匹配规则\n  #   - {key: app, operator: In, values: [counter-pod]}\n  template: # 模板，当副本数量不足时，会根据下面的模板创建 pod 副本\n    metadata:\n      labels:\n        app: build-pod\n    spec:\n      restartPolicy: Never # 重启策略只能设置为 Never 或者 OnFailure\n      initContainers:\n        - name: download\n          image: registry.cn-hangzhou.aliyuncs.com/godev/git:2.39.2\n          workingDir: /\n          imagePullPolicy: IfNotPresent\n          command: [\"sh\"]\n          args:\n            [\n              \"-c\",\n              \"git clone ${GIT_SSH_URL} workspace --branch=${GIT_BRANCH} --single-branch \u0026\u0026 cd workspace \u0026\u0026 git reset --hard ${GIT_COMMIT_ID}\",\n            ]\n          env:\n            - name: GIT_SSH_COMMAND\n              value: ssh -i /etc/secret-volume/id_rsa -o StrictHostKeyChecking=no\n          volumeMounts:\n            - name: workspace\n              mountPath: /workspace\n            - name: secret-volume\n              readOnly: true\n              mountPath: \"/etc/secret-volume\"\n      containers:\n        - image: registry.cn-hangzhou.aliyuncs.com/godev/kaniko-project.executor:v1.9.2-debug\n          workingDir: /workspace\n          imagePullPolicy: IfNotPresent\n          name: build-and-push\n          command: [\"sh\"]\n          # /workspace/runtime/task.env 文件是用收集输出的环境变量的\n          args:\n            [\n              \"-c\",\n              \"/kaniko/executor --cache=${CACHE_ENABLE} --cache-repo=${CACHE_REPO} --compressed-caching=${CACHE_COMPRESS} --custom-platform=${CUSTOM_PLATFORM} --destination=${IMAGE_REPOSITORY}:${APP_VERSION} --dockerfile=${APP_DOCKERFILE}\",\n            ]\n          volumeMounts:\n            - name: workspace\n              mountPath: /workspace\n            - name: kaniko-secret\n              mountPath: /kaniko/.docker\n      volumes:\n        - name: workspace\n          emptyDir: {}\n        - name: secret-volume\n          secret:\n            secretName: ${git_ssh_secret}\n            defaultMode: 0600\n        - name: kaniko-secret\n          secret:\n            secretName: ${image_push_secret}\n",
   "readme": "",
   "manual_update_status": false,
   "run_param": {
    "params": []
   },
   "allow_rollback": false,
   "rollback_param": {
    "params": []
   },
   "domain": "default",
   "namespace": "default",
   "create_by": "test",
   "logo": "",
   "icon": "",
   "name": "docker_build",
   "display_name": "",
   "visiable_mode": "NAMESPACE",
   "description": "",
   "labels": {
    "Language": "*",
    "cluster_id": "k8s-test",
    "namespace": "default"
   },
   "extra": {},
   "stage": "PUBLISHED",
   "version": "v1",
   "published_at": 0,
   "published_by": "",
   "published_describe": "",
   "deprecated_describe": ""
  }
 }, -->
