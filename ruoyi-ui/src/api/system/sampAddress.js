import request from '@/utils/request'

// 查询取样地建档列表
export function listSampAddress(query) {
  return request({
    url: '/system/sampAddress/list',
    method: 'get',
    params: query
  })
}

// 查询取样地检测
export function getAllSampAddress(query) {
  return request({
    url: '/system/sampAddress/getAllSampAddress ',
    method: 'get',
    params: query
  })
}

// 查询取样地建档详细
export function getSampAddress(id) {
  return request({
    url: '/system/sampAddress/' + id,
    method: 'get'
  })
}

// 新增取样地建档
export function addSampAddress(data) {
  return request({
    url: '/system/sampAddress',
    method: 'post',
    data: data
  })
}

// 修改取样地建档
export function updateSampAddress(data) {
  return request({
    url: '/system/sampAddress',
    method: 'put',
    data: data
  })
}

// 删除取样地建档
export function delSampAddress(id) {
  return request({
    url: '/system/sampAddress/' + id,
    method: 'delete'
  })
}

// 导出取样地建档
export function exportSampAddress(query) {
  return request({
    url: '/system/sampAddress/export',
    method: 'get',
    params: query
  })
}