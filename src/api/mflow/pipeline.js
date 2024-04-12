import instance from '../client'

// 查询流水线列表
export var LIST_PIPELINE = (params) => {
  return instance.get('/mflow/api/v1/pipelines', { params })
}

// 创建流水线
export var CREATE_PIPELINE = (data) => {
  return instance.post(`/mflow/api/v1/pipelines/`, data)
}

// 查询流水线详情
export var GET_PIPELINE = (id, params) => {
  return instance.get(`/mflow/api/v1/pipelines/${id}`, { params })
}

// 查询流水线详情
export var DELETE_PIPELINE = (id) => {
  return instance.delete(`/mflow/api/v1/pipelines/${id}`)
}

// 更新流水线详情
export var UPDATE_PIPELINE = (id, data) => {
  return instance.put(`/mflow/api/v1/pipelines/${id}`, data)
}
