import request from '@/utils/request'

// 查询设备建档列表
export function getAllDeviceItem(query) {
  return request({
    url: '/system/deviceItem/getAllDeviceItem',
    method: 'get',
    params: query
  })
}

// 设备检测
export function listDeviceItem(query) {
  return request({
    url: '/system/deviceItem/list',
    method: 'get',
    params: query
  })
}

// 查询设备建档详细
export function getDeviceItem(id) {
  return request({
    url: '/system/deviceItem/' + id,
    method: 'get'
  })
}

// 新增设备建档
export function addDeviceItem(data) {
  return request({
    url: '/system/deviceItem',
    method: 'post',
    data: data
  })
}

// 修改设备建档
export function updateDeviceItem(data) {
  return request({
    url: '/system/deviceItem',
    method: 'put',
    data: data
  })
}

// 删除设备建档
export function delDeviceItem(id) {
  return request({
    url: '/system/deviceItem/' + id,
    method: 'delete'
  })
}

// 导出设备建档
export function exportDeviceItem(query) {
  return request({
    url: '/system/deviceItem/export',
    method: 'get',
    params: query
  })
}