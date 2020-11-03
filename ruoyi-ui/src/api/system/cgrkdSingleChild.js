import request from '@/utils/request'

// 查询进货单子表列表
export function listCgrkdchild(query) {
  return request({
    url: '/system/cgrkdSingleChild/list',
    method: 'get',
    params: query
  })
}

// 查询进货单子表详细
export function getCgrkdchild(id) {
  return request({
    url: '/system/cgrkdSingleChild/' + id,
    method: 'get'
  })
}

// 新增进货单子表
export function addCgrkdchild(data) {
  return request({
    url: '/system/cgrkdSingleChild',
    method: 'post',
    data: data
  })
}

// 修改进货单子表
export function updateCgrkdchild(data) {
  return request({
    url: '/system/cgrkdSingleChild',
    method: 'put',
    data: data
  })
}

// 删除进货单子表
export function delCgrkdchild(id) {
  return request({
    url: '/system/cgrkdSingleChild/' + id,
    method: 'delete'
  })
}

// 导出进货单子表
export function exportCgrkdchild(query) {
  return request({
    url: '/system/cgrkdSingleChild/export',
    method: 'get',
    params: query
  })
}