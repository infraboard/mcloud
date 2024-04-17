import instance from '../client'

// 查询触发配置
export var LIST_TRIGGER_RECORD = (params) => {
  return instance.get('/mflow/api/v1/triggers/records', { params })
}
