import request from '@/utils/request'

// 查询磅房入场单列表
export function listAdmiss(query) {
  return request({
    url: '/system/admiss/list',
    method: 'get',
    params: query
  })
}

// 查询磅房入场单明细详细
export function getAdmissChild(djNumber) {
  return request({
    url: '/system/admissChild/getAdmissChild?djNumber=' + djNumber,
    method: 'get'
  })
}
// 删除磅房入场单明细
export function delAdmissChild(id) {
  return request({
    url: '/system/admissChild/' + id,
    method: 'delete'
  })
}

// 查询磅房入场单详细
export function getAdmiss(id) {
  return request({
    url: '/system/admiss/' + id,
    method: 'get'
  })
}

// 新增磅房入场单
export function addAdmiss(data) {
  return request({
    url: '/system/admiss',
    method: 'post',
    data: data
  })
}

// 修改磅房入场单
export function updateAdmiss(data) {
  return request({
    url: '/system/admiss',
    method: 'put',
    data: data
  })
}

// 生效进货单
export function updateAdmissStatus(id) {
  return request({
    url: '/system/admiss/effect/' + id,
    method: 'delete'
  })
}

// 删除磅房入场单
export function delAdmiss(id) {
  return request({
    url: '/system/admiss/' + id,
    method: 'delete'
  })
}

// 导出磅房入场单
export function exportAdmiss(query) {
  return request({
    url: '/system/admiss/export',
    method: 'get',
    params: query
  })
}