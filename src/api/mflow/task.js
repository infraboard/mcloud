import instance from '../client'

// 查询Job执行记录
export var LIST_JOB_TASK = (params) => {
  return instance.get('/mflow/api/v1/job_tasks', { params })
}

// 运行Job
export var RUN_JOB_TASK = (data) => {
  return instance.post(`/mflow/api/v1/job_tasks`, data)
}

// 查询Job执行详情
export var GET_JOB_TASK = (id) => {
  return instance.get(`/mflow/api/v1/job_tasks/${id}`)
}

// 查询Job执行记录
export var Audit_JOB_TASK = (id, data) => {
  return instance.post(`/mflow/api/v1/job_tasks/${id}/audit`, data)
}

// 查询Pipeline执行列表
export var LIST_PIPELINE_TASK = (params) => {
  return instance.get('/mflow/api/v1/pipeline_tasks', { params })
}

// 执行Pipeline任务
export var RUN_PIPELINE_TASK = (data) => {
  return instance.post('/mflow/api/v1/pipeline_tasks', data)
}

// 查询Pipeline执行详情
export var GET_PIPELINE_TASK = (id, params) => {
  return instance.get(`/mflow/api/v1/pipeline_tasks/${id}`, { params })
}

// 删除Pipeline执行详情
export var DELETE_PIPELINE_TASK = (id) => {
  return instance.delete(`/mflow/api/v1/pipeline_tasks/${id}`)
}
