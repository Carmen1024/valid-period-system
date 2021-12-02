import request from '@/utils/request';

export function materialQuery(data){
    return request({
        url: '/material/query',
        method: 'post',
        data
      })
}

export function materialInsert(data){
  return request({
      url: '/material/insert',
      method: 'post',
      data
    })
}

export function materialUpdate(data){
  return request({
      url: '/material/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function materialValid(data){
  return request({
      url: '/material/valid',
      method: 'post',
      data
    })
}

// 删除
export function materialDelete(data){
  return request({
      url: '/material/del',
      method: 'post',
      data
    })
}

// 物料-获取物料列表
export function materialQueryAll(){
  return request({
      url: '/material/query_all_valid',
      method: 'post'
    })
}
