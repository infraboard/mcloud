import instance from '../client'

// 查询部署列表
export var LIST_DEPLOY = (params) => {
  return instance.get('/mpaas/api/v1/deploys', { params })
}

// 查询部署列表
export var DESCRIBE_CLUSTER = (id, params) => {
  return instance.get(`/mpaas/api/v1/deploys/${id}`, { params })
}

// 创建部署
export var CREATE_DEPLOY = (data) => {
  return instance.post('/mpaas/api/v1/deploys', data)
}

