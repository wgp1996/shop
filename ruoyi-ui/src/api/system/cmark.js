import request from '@/utils/request'

// 查询二级市场信息列表
export function listCmark(query) {
  return request({
    url: '/system/cmark/list',
    method: 'get',
    params: query
  })
}

// 查询二级市场信息详细
export function getCmark(id) {
  return request({
    url: '/system/cmark/' + id,
    method: 'get'
  })
}
//查询主市场信息
export function getMark() {
  return request({
    url: '/system/cmark/markData',
    method: 'get'
  })
}

// 新增二级市场信息
export function addCmark(data) {
  return request({
    url: '/system/cmark',
    method: 'post',
    data: data
  })
}

// 修改二级市场信息
export function updateCmark(data) {
  return request({
    url: '/system/cmark',
    method: 'put',
    data: data
  })
}

// 删除二级市场信息
export function delCmark(id) {
  return request({
    url: '/system/cmark/' + id,
    method: 'delete'
  })
}

// 导出二级市场信息
export function exportCmark(query) {
  return request({
    url: '/system/cmark/export',
    method: 'get',
    params: query
  })
}