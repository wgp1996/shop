import request from '@/utils/request'

// 查询进货单子表列表
export function listCgrkdchild(query) {
  return request({
    url: '/system/cgrkdchild/list',
    method: 'get',
    params: query
  })
}

// 查询进货单子表详细
export function getCgrkdchild(id) {
  return request({
    url: '/system/cgrkdchild/' + id,
    method: 'get'
  })
}

// 新增进货单子表
export function addCgrkdchild(data) {
  return request({
    url: '/system/cgrkdchild',
    method: 'post',
    data: data
  })
}

// 修改进货单子表
export function updateCgrkdchild(data) {
  return request({
    url: '/system/cgrkdchild',
    method: 'put',
    data: data
  })
}

// 删除进货单子表
export function delCgrkdchild(id) {
  return request({
    url: '/system/cgrkdchild/' + id,
    method: 'delete'
  })
}

// 导出进货单子表
export function exportCgrkdchild(query) {
  return request({
    url: '/system/cgrkdchild/export',
    method: 'get',
    params: query
  })
}