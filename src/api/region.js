
import request from '@/utils/request';

export function selectRegion(data) {
    return request({
      url: '/region/queryDistrctAll',
      method: 'post',
      data
    })
  }

  export function selectRegionCode(data) {
    return request({
      url: '/region/queryValid',
      method: 'post',
      data
    })
  }

