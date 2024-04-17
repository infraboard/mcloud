import instance from '../client'

// 查询构建配置
export var LIST_BUILD = (params) => {
  return instance.get('/mflow/api/v1/builds', { params })
}

// 创建构建配置
export var CREATE_BUILD = (data) => {
  return instance.post('/mflow/api/v1/builds', data)
}

// 查询构建配置详情
export var DESCRIBE_BUILD = (id, params) => {
  return instance.get(`/mflow/api/v1/builds/${id}`, { params })
}

// 更新构建配置
export var UPDATE_BUILD = (id, data) => {
  return instance.put(`/mflow/api/v1/builds/${id}`, data)
}
