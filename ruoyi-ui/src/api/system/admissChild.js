import request from '@/utils/request'

// 查询磅房入场单明细列表
export function listAdmissChild(query) {
  return request({
    url: '/system/admissChild/list',
    method: 'get',
    params: query
  })
}

// 查询磅房入场单明细详细
export function getAdmissChild(id) {
  return request({
    url: '/system/admissChild/' + id,
    method: 'get'
  })
}

// 新增磅房入场单明细
export function addAdmissChild(data) {
  return request({
    url: '/system/admissChild',
    method: 'post',
    data: data
  })
}

// 修改磅房入场单明细
export function updateAdmissChild(data) {
  return request({
    url: '/system/admissChild',
    method: 'put',
    data: data
  })
}

// 删除磅房入场单明细
export function delAdmissChild(id) {
  return request({
    url: '/system/admissChild/' + id,
    method: 'delete'
  })
}

// 导出磅房入场单明细
export function exportAdmissChild(query) {
  return request({
    url: '/system/admissChild/export',
    method: 'get',
    params: query
  })
}