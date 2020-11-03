import request from '@/utils/request'

// 查询【市场信息】列表
export function listInfo(query) {
  return request({
    url: '/system/mark/list',
    method: 'get',
    params: query
  })
}

// 查询【市场信息】详细
export function getInfo(id) {
  return request({
    url: '/system/mark/' + id,
    method: 'get'
  })
}

// 新增【市场信息】
export function addInfo(data) {
  return request({
    url: '/system/mark',
    method: 'post',
    data: data
  })
}

// 修改【市场信息】
export function updateInfo(data) {
  return request({
    url: '/system/mark',
    method: 'put',
    data: data
  })
}

// 删除【市场信息】
export function delInfo(id) {
  return request({
    url: '/system/mark/' + id,
    method: 'delete'
  })
}

// 导出【市场信息】
export function exportInfo(query) {
  return request({
    url: '/system/mark/export',
    method: 'get',
    params: query
  })
}