import request from '@/utils/request'

// 查询检测标准设定列表
export function listCheck(query) {
  return request({
    url: '/system/check/list',
    method: 'get',
    params: query
  })
}

// 查询检测标准设定详细
export function getCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'get'
  })
}

// 新增检测标准设定
export function addCheck(data) {
  return request({
    url: '/system/check',
    method: 'post',
    data: data
  })
}

// 修改检测标准设定
export function updateCheck(data) {
  return request({
    url: '/system/check',
    method: 'put',
    data: data
  })
}

// 删除检测标准设定
export function delCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'delete'
  })
}

// 导出检测标准设定
export function exportCheck(query) {
  return request({
    url: '/system/check/export',
    method: 'get',
    params: query
  })
}