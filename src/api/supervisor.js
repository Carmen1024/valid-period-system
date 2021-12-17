import request from '@/utils/request';

export function supervisorQuery(data){
    return request({
        url: '/supervisor/query',
        method: 'post',
        data
      })
}

export function supervisorInsert(data){
  return request({
      url: '/supervisor/insert',
      method: 'post',
      data
    })
}

export function supervisorUpdate(data){
  return request({
      url: '/supervisor/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function supervisorValid(data){
  return request({
      url: '/supervisor/valid',
      method: 'post',
      data
    })
}

// 删除
export function supervisorDelete(data){
  return request({
      url: '/supervisor/del',
      method: 'post',
      data
    })
}

// 物料-获取分类列表
export function supervisorQueryAll(){
  return request({
      url: '/supervisor/query_all_valid',
      method: 'post'
    })
}

// 查询所有门店-模糊查询
export function supervisorQueryValid(data){
  return request({
      url: '/supervisor/query_valid',
      method: 'post',
      data
    })
}
