import request from '@/utils/request'

// 查询检测地点建档列表
export function listCheckAddress(query) {
  return request({
    url: '/system/checkAddress/list',
    method: 'get',
    params: query
  })
}

// 查询检测地点建档详细
export function getCheckAddress(id) {
  return request({
    url: '/system/checkAddress/' + id,
    method: 'get'
  })
}

// 新增检测地点建档
export function addCheckAddress(data) {
  return request({
    url: '/system/checkAddress',
    method: 'post',
    data: data
  })
}

// 修改检测地点建档
export function updateCheckAddress(data) {
  return request({
    url: '/system/checkAddress',
    method: 'put',
    data: data
  })
}

// 删除检测地点建档
export function delCheckAddress(id) {
  return request({
    url: '/system/checkAddress/' + id,
    method: 'delete'
  })
}

// 导出检测地点建档
export function exportCheckAddress(query) {
  return request({
    url: '/system/checkAddress/export',
    method: 'get',
    params: query
  })

}
