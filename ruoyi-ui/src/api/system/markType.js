import request from '@/utils/request'

// 查询市场分类列表
export function listMarkType(query) {
  return request({
    url: '/system/markType/list',
    method: 'get',
    params: query
  })
}

// 查询市场分类详细
export function getMarkType(markId) {
  return request({
    url: '/system/markType/' + markId,
    method: 'get'
  })
}

// 新增市场分类
export function addMarkType(data) {
  return request({
    url: '/system/markType',
    method: 'post',
    data: data
  })
}

// 修改市场分类
export function updateMarkType(data) {
  return request({
    url: '/system/markType',
    method: 'put',
    data: data
  })
}

// 删除市场分类
export function delMarkType(markId) {
  return request({
    url: '/system/markType/' + markId,
    method: 'delete'
  })
}

// 导出市场分类
export function exportMarkType(query) {
  return request({
    url: '/system/markType/export',
    method: 'get',
    params: query
  })
}