import request from '@/utils/request'

// 查询附件建档列表
export function listFile(query) {
  return request({
    url: '/system/file/list',
    method: 'get',
    params: query
  })
}

// 查询附件建档详细
export function getFile(id) {
  return request({
    url: '/system/file/' + id,
    method: 'get'
  })
}

// 新增附件建档
export function addFile(data) {
  return request({
    url: '/system/file',
    method: 'post',
    data: data
  })
}

// 修改附件建档
export function updateFile(data) {
  return request({
    url: '/system/file',
    method: 'put',
    data: data
  })
}

// 删除附件建档
export function delFile(id) {
  return request({
    url: '/system/file/' + id,
    method: 'delete'
  })
}

// 导出附件建档
export function exportFile(query) {
  return request({
    url: '/system/file/export',
    method: 'get',
    params: query
  })
}