import request from '@/utils/request';

export function deviceQuery(data){
    return request({
        url: '/terminal/query',
        method: 'post',
        data
      })
}

export function deviceInsert(data){
  return request({
      url: '/terminal/insert',
      method: 'post',
      data
    })
}

export function deviceUpdate(data){
  return request({
      url: '/terminal/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function deviceValid(data){
  return request({
      url: '/terminal/valid',
      method: 'post',
      data
    })
}

// 删除
export function deviceDelete(data){
  return request({
      url: '/terminal/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function deviceQueryAll(){
  return request({
      url: '/terminal/query_all_valid',
      method: 'post'
    })
}

