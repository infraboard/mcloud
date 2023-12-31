import instance from '../client'

// 查询Job
export var LIST_JOB = (params) => {
  return instance.get('/mflow/api/v1/jobs', { params })
}

// 查询Job详情
export var GET_JOB = (id, params) => {
  return instance.get(`/mflow/api/v1/jobs/${id}`, { params })
}

// 创建Job
export var CREATE_JOB = (data) => {
  return instance.post('/mflow/api/v1/jobs', data)
}
