import request from '@/utils/request';

export function classifyQuery(data){
    return request({
        url: '/classify/query',
        method: 'post',
        data
      })
}

export function classifyInsert(data){
  return request({
      url: '/classify/insert',
      method: 'post',
      data
    })
}

export function classifyUpdate(data){
  return request({
      url: '/classify/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function classifyValid(data){
  return request({
      url: '/classify/valid',
      method: 'post',
      data
    })
}

// 删除
export function classifyDelete(data){
  return request({
      url: '/classify/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function classifyQueryAll(){
  return request({
      url: '/classify/query_all_valid',
      method: 'post'
    })
}

