import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/valid-period-system/table/list',
    method: 'get',
    params
  })
}
