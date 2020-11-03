import request from '@/utils/request'

// 查询检测申请单列表
export function listTestApplicationForm(query) {
  return request({
    url: '/system/TestApplicationForm/list',
    method: 'get',
    params: query
  })
}

// 查询检测申请单明细
export function TestApplicationFormChild(query) {
  return request({
    url: '/system/TestApplicationFormChild/list',
    method: 'get',
    params: query
  })
}

// 查询检测申请单详细
export function getTestApplicationForm(id) {
  return request({
    url: '/system/TestApplicationForm/' + id,
    method: 'get'
  })
}

// 新增检测申请单
export function addTestApplicationForm(data) {
  return request({
    url: '/system/TestApplicationForm',
    method: 'post',
    data: data
  })
}

// 修改检测申请单
export function updateTestApplicationForm(data) {
  return request({
    url: '/system/TestApplicationForm',
    method: 'put',
    data: data
  })
}

// 删除检测申请单
export function delTestApplicationForm(id) {
  return request({
    url: '/system/TestApplicationForm/' + id,
    method: 'delete'
  })
}

// 导出检测申请单
export function exportTestApplicationForm(query) {
  return request({
    url: '/system/TestApplicationForm/export',
    method: 'get',
    params: query
  })
}