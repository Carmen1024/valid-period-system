import request from '@/utils/request';

export function storeQuery(data){
    return request({
        url: '/store/query',
        method: 'post',
        data
      })
}

export function storeInsert(data){
  return request({
      url: '/store/insert',
      method: 'post',
      data
    })
}

export function storeUpdate(data){
  return request({
      url: '/store/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function storeValid(data){
  return request({
      url: '/store/valid',
      method: 'post',
      data
    })
}

// 删除
export function storeDelete(data){
  return request({
      url: '/store/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function storeQueryAll(){
  return request({
      url: '/store/query_all_valid',
      method: 'post'
    })
}

// 查询所有门店-模糊查询
export function storeQueryValid(data){
  return request({
      url: '/store/query_valid',
      method: 'post',
      data
    })
}
