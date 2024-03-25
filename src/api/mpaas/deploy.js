import instance from '../client'

// 查询部署列表
export var LIST_DEPLOY = (params) => {
  return instance.get('/mpaas/api/v1/deploys', { params })
}

// 查询部署列表
export var DESCRIBE_DEPLOY = (id, params) => {
  return instance.get(`/mpaas/api/v1/deploys/${id}`, { params })
}

// 创建部署
export var CREATE_DEPLOY = (data) => {
  return instance.post('/mpaas/api/v1/deploys', data)
}

// 更新部署
export var UPDATE_DEPLOY = (id, data) => {
  return instance.put('/mpaas/api/v1/deploys', data)
}

// 删除部署
export var DELETE_DEPLOY = (id) => {
  return instance.delete(`/mpaas/api/v1/deploys/${id}`)
}
