import instance from '../client'

// 查询构建配置
export var LIST_BUILD = (params) => {
  return instance.get('/mflow/api/v1/builds', { params })
}
