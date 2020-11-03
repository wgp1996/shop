import request from '@/utils/request'

// 查询业户信息列表
export function listOwner(query) {
  return request({
    url: '/system/owner/list',
    method: 'get',
    params: query
  })
}

// 查询所以业户信息列表
export function ownerAllList(query) {
  return request({
    url: '/system/owner/ownerAllList',
    method: 'get',
    params: query
  })
}


// 查询业户下拉信息列表
export function ownerList(query) {
  return request({
    url: '/system/owner/ownerList',
    method: 'get',
    params: query
  })
}


// 查询业户信息详细
export function getOwner(id) {
  return request({
    url: '/system/owner/' + id,
    method: 'get'
  })
}

// 新增业户信息
export function addOwner(data) {
  return request({
    url: '/system/owner',
    method: 'post',
    data: data
  })
}

// 修改业户信息
export function updateOwner(data) {
  return request({
    url: '/system/owner',
    method: 'put',
    data: data
  })
}

// 删除业户信息
export function delOwner(id) {
  return request({
    url: '/system/owner/' + id,
    method: 'delete'
  })
}

// 导出业户信息
export function exportOwner(query) {
  return request({
    url: '/system/owner/export',
    method: 'get',
    params: query
  })
}