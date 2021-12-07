import request from '@/utils/request';

export function areaQuery(data){
    return request({
        url: '/region/query',
        method: 'post',
        data
      })
}

export function areaInsert(data){
  return request({
      url: '/region/insert',
      method: 'post',
      data
    })
}

export function areaUpdate(data){
  return request({
      url: '/region/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function areaValid(data){
  return request({
      url: '/region/valid',
      method: 'post',
      data
    })
}

// 删除
export function areaDelete(data){
  return request({
      url: '/region/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function areaQueryAll(){
  return request({
      url: '/region/query_all_valid',
      method: 'post'
    })
}

