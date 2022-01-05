import request from '@/utils/request';

//分类统计-查询
export function queryClassifyList(data){
  return request({
    url: '/home/query_classify_list_with_day',
    method: 'post',
    data
  })
}

//打印统计-查询
export function queryPrintList(data){
  return request({
    url: '/home/query_print_list_with_day',
    method: 'post',
    data
  })
}

//门店打印排名
export function queryStoreRank(data){
  return request({
    url: '/home/query_print_list_with_store',
    method: 'post',
    data
  })
}

