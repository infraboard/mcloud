import instance from '../client'

// 查询Job
export var LIST_JOB = (params) => {
  return instance.get('/mflow/api/v1/jobs', { params })
}

// 查询Job详情
export var GET_JOB = (id, params) => {
  return instance.get(`/mflow/api/v1/jobs/${id}`, { params })
}

// 创建任务
export var CREATE_JOB = (data) => {
  return instance.post('/mflow/api/v1/jobs', data)
}

// 更新Job
export var UPDATE_JOB = (id, data) => {
  return instance.put(`/mflow/api/v1/jobs/${id}`, data)
}

// 更新Job状态
export var UPDATE_JOB_STATUS = (id, data) => {
  return instance.put(`/mflow/api/v1/jobs/${id}/status`, data)
}

// 删除Job
export var DELETE_JOB = (id) => {
  return instance.delete(`/mflow/api/v1/jobs/${id}`)
}
