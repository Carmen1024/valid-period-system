import request from '@/utils/request';

export function validQuery(data){
    return request({
        url: '/material_type/query',
        method: 'post',
        data
      })
}

export function validInsert(data){
  return request({
      url: '/material_type/insert',
      method: 'post',
      data
    })
}

export function validUpdate(data){
  return request({
      url: '/material_type/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function validValid(data){
  return request({
      url: '/material_type/valid',
      method: 'post',
      data
    })
}

// 删除
export function validDelete(data){
  return request({
      url: '/material_type/del',
      method: 'post',
      data
    })
}
