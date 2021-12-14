import request from '@/utils/request';

export function superviseQuery(data){
    return request({
        url: '/supervise/query',
        method: 'post',
        data
      })
}

export function superviseInsert(data){
  return request({
      url: '/supervise/insert',
      method: 'post',
      data
    })
}

export function superviseUpdate(data){
  return request({
      url: '/supervise/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function superviseValid(data){
  return request({
      url: '/supervise/valid',
      method: 'post',
      data
    })
}

// 删除
export function superviseDelete(data){
  return request({
      url: '/supervise/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function superviseQueryAll(){
  return request({
      url: '/supervise/query_all_valid',
      method: 'post'
    })
}

// 查询所有门店-模糊查询
export function superviseQueryValid(data){
  return request({
      url: '/supervise/query_valid',
      method: 'post',
      data
    })
}
