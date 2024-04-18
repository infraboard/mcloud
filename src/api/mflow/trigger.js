import instance from '../client'

// 查询触发配置
export var LIST_TRIGGER_RECORD = (params) => {
  return instance.get('/mflow/api/v1/triggers/records', { params })
}

// 手动模拟GITLAB事件触发
export var MANNUL_GITLAB_TRIGGER = (data) => {
  return instance.post('/mflow/api/v1/triggers/mannul', data)
}
