import request from '@/utils/request'

// 查询市场摊位信息列表
export function listStall(query) {
  return request({
    url: '/system/stall/list',
    method: 'get',
    params: query
  })
}

// 查询市场摊位下拉信息列表
export function getStallAll(query) {
  return request({
    url: '/system/stall/getStallAll',
    method: 'get',
    params: query
  })
}

// 合同选择市场摊位信息列表
export function leaseStallList(query) {
  return request({
    url: '/system/stall/leaseStallList',
    method: 'get',
    params: query
  })
}

// 查询市场摊位信息详细
export function getStall(id) {
  return request({
    url: '/system/stall/' + id,
    method: 'get'
  })
}
//查询二级市场信息
export function cmarkData() {
  return request({
    url: '/system/stall/cmarkData',
    method: 'get'
  })
}


// 新增市场摊位信息
export function addStall(data) {
  return request({
    url: '/system/stall',
    method: 'post',
    data: data
  })
}

// 修改市场摊位信息
export function updateStall(data) {
  return request({
    url: '/system/stall',
    method: 'put',
    data: data
  })
}

// 删除市场摊位信息
export function delStall(id) {
  return request({
    url: '/system/stall/' + id,
    method: 'delete'
  })
}

// 导出市场摊位信息
export function exportStall(query) {
  return request({
    url: '/system/stall/export',
    method: 'get',
    params: query
  })
}