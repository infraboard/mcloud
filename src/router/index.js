import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/login/LoginPage.vue'
import { beforeEachHanler } from './permission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    // 工作台
    {
      path: '/',
      name: 'UserWorkspace',
      redirect: { name: 'HomePage' },
      component: () => import('@/views/workspace/LayoutPage.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'HomePage',
          component: () => import('@/views/workspace/dashboard/HomePage.vue'),
          meta: { label: '个人看版' }
        }
      ]
    },
    // 后台管理
    {
      path: '/admin',
      name: 'AdminPage',
      component: () => import('@/views/admin/LayoutPage.vue'),
      redirect: { name: 'PermissionManage' },
      children: [
        {
          path: 'permission',
          name: 'PermissionManage',
          component: () => import('@/components/RedirectPage.vue'),
          meta: { label: '权限管理' },
          redirect: { name: 'SubUserList' },
          children: [
            {
              path: 'domain/get',
              name: 'DomainDetail',
              component: () => import('@/views/admin/domain/DetailPage.vue')
            },
            {
              path: 'sub_user/list',
              name: 'SubUserList',
              component: () => import('@/views/admin/user/ListPage.vue'),
              meta: { label: '用户列表' }
            },
            {
              path: 'user/create',
              name: 'CreateSubUser',
              component: () => import('@/views/admin/user/CreateUser.vue'),
              meta: { label: '创建用户' }
            },
            {
              path: 'namespace/list',
              name: 'NamespaceList',
              component: () => import('@/views/admin/namespace/ListPage.vue'),
              meta: { label: '空间列表' }
            },
            {
              path: 'namespace/create',
              name: 'CreateNamespace',
              component: () => import('@/views/admin/namespace/CreateNamespace.vue'),
              meta: { label: '创建空间' }
            },
            {
              path: 'role/list',
              name: 'RoleList',
              component: () => import('@/views/admin/role/ListPage.vue'),
              meta: { label: '角色列表' }
            },
            {
              path: 'role/detail',
              name: 'RoleDetail',
              component: () => import('@/views/admin/role/DetailPage.vue'),
              meta: { label: '角色详情' }
            },
            {
              path: 'label/list',
              name: 'LabelList',
              component: () => import('@/views/admin/label/ListPage.vue'),
              meta: { label: '标签列表' }
            }
          ]
        },
        {
          path: 'audit',
          name: 'AuditManage',
          component: () => import('@/components/RedirectPage.vue'),
          meta: { label: '审计管理' },
          redirect: { name: 'LoginLog' },
          children: [
            {
              path: 'log/login',
              name: 'AuditLoginLog',
              component: () => import('@/views/admin/audit/LoginLog.vue'),
              meta: { label: '登录日志' }
            },
            {
              path: 'log/operate',
              name: 'AuditOperateLog',
              component: () => import('@/views/admin/audit/OperateLog.vue'),
              meta: { label: '操作日志' }
            }
          ]
        }
      ]
    },
    // 空间设置
    {
      path: '/setting',
      name: 'SettingPage',
      component: () => import('@/views/setting/LayoutPage.vue'),
      redirect: { name: 'NamespacePermission' },
      children: [
        {
          path: 'permission',
          name: 'NamespacePermission',
          component: () => import('@/components/RedirectPage.vue'),
          meta: { label: '权限管理' },
          redirect: { name: 'NamespacePolicyList' },
          children: [
            {
              path: 'policy/list',
              name: 'NamespacePolicyList',
              component: () => import('@/views/setting/policy/ListPage.vue'),
              meta: { label: '策略列表' }
            },
            {
              path: 'policy/create',
              name: 'NamespacePolicyCreate',
              component: () => import('@/views/setting/policy/CreatePolicy.vue'),
              meta: { label: '创建策略' }
            }
          ]
        }
      ]
    },
    // 资源管理
    {
      path: '/resource',
      name: 'ResourcePage',
      component: () => import('@/views/resource/LayoutPage.vue'),
      redirect: { name: 'ResourceList' },
      children: [
        {
          path: 'list',
          name: 'ResourceList',
          component: () => import('@/components/RedirectPage.vue'),
          meta: { label: '资源列表' },
          redirect: { name: 'ResourceSearch' },
          children: [
            {
              path: 'search',
              name: 'ResourceSearch',
              component: () => import('@/views/resource/SearchPage.vue')
            },
            {
              path: 'k8s',
              name: 'K8sList',
              component: () => import('@/views/resource/k8s/ListPage.vue'),
              meta: { label: 'k8s集群' }
            },
            {
              path: 'host/list',
              name: 'HostList',
              component: () => import('@/views/resource/host/ListPage.vue')
            },
            {
              path: 'gateway/list',
              name: 'GatewayList',
              component: () => import('@/views/resource/gateway/ListPage.vue')
            }
          ]
        },
        {
          path: 'sync',
          name: 'ResourceSync',
          component: () => import('@/components/RedirectPage.vue'),
          redirect: { name: 'ResourceTaskList' },
          children: [
            {
              path: 'task/list',
              name: 'ResourceTaskList',
              component: () => import('@/views/resource/task/ListPage.vue')
            },
            {
              path: 'secret/list',
              name: 'ResourceSecretList',
              component: () => import('@/views/resource/secret/ListPage.vue')
            }
          ]
        }
      ]
    },
    // 服务控制台
    {
      path: '/service_console',
      name: 'ServiceConsole',
      component: () => import('@/views/console/LayoutPage.vue'),
      redirect: { name: 'ServiceDashboard' },
      children: [
        {
          path: 'dashboard',
          name: 'ServiceDashboard',
          component: () => import('@/views/console/dashboard/BoardPage.vue'),
          meta: { label: '终端看板' }
        },
        {
          path: 'terminal',
          name: 'ServiceTerminal',
          component: () => import('@/views/console/terminal/TerminalPage.vue'),
          meta: { label: '服务终端控制台' }
        },
        {
          path: 'cluster/:id',
          name: 'ClusterDetail',
          component: () => import('@/views/console/cluster/DetailPage.vue'),
          meta: { label: '应用集群' }
        },
        {
          path: 'deploy/:id',
          name: 'DeployDetail',
          component: () => import('@/views/console/deploy/DetailPage.vue'),
          meta: { label: '应用部署' }
        }
      ]
    },
    // 研发交付
    {
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
              path: 'approval/list',
              name: 'ApprovalList',
              component: () => import('@/views/develop/approval/ListPage.vue'),
              meta: { label: '上线申请' }
            },
            {
              path: 'deploy/list',
              name: 'DeployList',
              component: () => import('@/views/develop/deploy/ListPage.vue'),
              meta: { label: '服务部署' }
            },
            {
              path: 'trigger/list',
              name: 'TriggerList',
              component: () => import('@/views/develop/trigger/ListPage.vue'),
              meta: { label: '持续构建' }
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
              meta: { label: 'Pipeline模版' }
            },
            {
              path: 'pipeline/detail/:id',
              name: 'DomainPipelineDetail',
              component: () => import('@/views/develop/pipeline/DetailPage.vue'),
              meta: { label: 'Pipeline详情' }
            },
            {
              path: 'pipeline/create',
              name: 'DomainPipelineCreate',
              component: () => import('@/views/develop/pipeline/CreatePage.vue'),
              meta: { label: '创建Pipeline' }
            },
            {
              path: 'job/list',
              name: 'DomainJobList',
              component: () => import('@/views/develop/job/ListPage.vue'),
              meta: { label: 'Job管理' }
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
              meta: { label: '创建Job' }
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
    },
    // 其他通用页面
    {
      path: '/errors/403',
      name: 'PermissionDeny',
      component: () => import('@/views/common/PermissionDeny.vue')
    },
    // 匹配前面所有没有被名字的路由, 都指向404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/common/NotFound.vue')
    }
  ]
})

// 对Router进行导航守卫的设置
// 全局前置守卫
router.beforeEach(beforeEachHanler)

export default router
