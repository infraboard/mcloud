export default {
  path: '/develop',
  name: 'DevelopPage',
  component: () => import('@/views/develop/LayoutPage.vue'),
  redirect: { name: 'BaseDevelop' },
  children: [
    {
      path: 'base',
      name: 'BaseDevelop',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '服务管理' },
      redirect: { name: 'ServiceList' },
      children: [
        {
          path: 'service/list',
          name: 'ServiceList',
          component: () => import('@/views/develop/service/ListPage.vue'),
          meta: { label: '服务列表' }
        },
        {
          path: 'service/import/gitlab',
          name: 'GitlabImport',
          component: () => import('@/views/develop/service/GitlabImport.vue'),
          meta: { label: 'Gitlab项目导入' }
        },
        {
          path: 'service/detail/:id',
          name: 'ServiceDetail',
          component: () => import('@/views/develop/service/DetailPage.vue'),
          meta: { label: '服务详情' }
        },
        {
          path: 'service/detail/:id/build_conf/create',
          name: 'BuildConfCreate',
          component: () => import('@/views/develop/service/CreateBuildConf.vue'),
          meta: { label: '构建配置' }
        },
        {
          path: 'approval/list',
          name: 'ApprovalList',
          component: () => import('@/views/develop/approval/ListPage.vue'),
          meta: { label: '上线申请' }
        },
        {
          path: 'task_audit/list',
          name: 'TaskAuditList',
          component: () => import('@/views/develop/task_audit/ListPage.vue'),
          meta: { label: '任务审批' }
        },
        {
          path: 'cluster/list',
          name: 'ServiceClusterList',
          component: () => import('@/views/develop/cluster/ListPage.vue'),
          meta: { label: '部署集群' }
        },
        {
          path: 'cluster/create',
          name: 'ServiceClusterCreate',
          component: () => import('@/views/develop/cluster/CreatePage.vue'),
          meta: { label: '创建集群' }
        },
        {
          path: 'trigger/list',
          name: 'TriggerList',
          component: () => import('@/views/develop/trigger/ListPage.vue'),
          meta: { label: '持续构建' }
        },
        {
          path: 'audit/pod/list',
          name: 'PodAudit',
          component: () => import('@/views/develop/audit/ListPage.vue'),
          meta: { label: 'Pod登录' }
        }
      ]
    },
    {
      path: 'tool',
      name: 'DevToolManage',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '研发工具' },
      redirect: { name: 'DomainPipelineList' },
      children: [
        {
          path: 'pipeline/list',
          name: 'DomainPipelineList',
          component: () => import('@/views/develop/pipeline/ListPage.vue'),
          meta: { label: '流水线模版' }
        },
        {
          path: 'pipeline/detail/:id',
          name: 'DomainPipelineDetail',
          component: () => import('@/views/develop/pipeline/DetailPage.vue'),
          meta: { label: '流水线详情' }
        },
        {
          path: 'pipeline/create',
          name: 'DomainPipelineCreate',
          component: () => import('@/views/develop/pipeline/CreatePage.vue'),
          meta: { label: '创建流水线' }
        },
        {
          path: 'pipeline_task',
          name: 'PipelineTaskList',
          component: () => import('@/views/develop/pipeline_task/ListPage.vue'),
          meta: { label: '执行列表' }
        },
        {
          path: 'pipeline_task/:id',
          name: 'PipelineTaskDetail',
          component: () => import('@/views/develop/pipeline_task/DetailPage.vue'),
          meta: { label: '执行详情' }
        },
        {
          path: 'job/list',
          name: 'DomainJobList',
          component: () => import('@/views/develop/job/ListPage.vue'),
          meta: { label: '任务模版' }
        },
        {
          path: 'job_task/console/:id',
          name: 'JobTaskConsole',
          component: () => import('@/views/develop/job_task/TaskConsole.vue'),
          meta: { label: 'JobTask 日志控制台' }
        },
        {
          path: 'job/create',
          name: 'DomainJobCreate',
          component: () => import('@/views/develop/job/CreateJob.vue'),
          meta: { label: '创建任务' }
        },
        {
          path: 'job/detail/:id',
          name: 'DomainJobDetail',
          component: () => import('@/views/develop/job/DetailPage.vue'),
          meta: { label: 'Job详情' }
        }
      ]
    }
  ]
}
