import request from '@/utils/request'

// 查询检测人员建档列表
export function listCheckPerson(query) {
  return request({
    url: '/system/checkPerson/list',
    method: 'get',
    params: query
  })
}

// 查询检测人员建档详细
export function getCheckPerson(id) {
  return request({
    url: '/system/checkPerson/' + id,
    method: 'get'
  })
}

// 新增检测人员建档
export function addCheckPerson(data) {
  return request({
    url: '/system/checkPerson',
    method: 'post',
    data: data
  })
}

// 修改检测人员建档
export function updateCheckPerson(data) {
  return request({
    url: '/system/checkPerson',
    method: 'put',
    data: data
  })
}

// 删除检测人员建档
export function delCheckPerson(id) {
  return request({
    url: '/system/checkPerson/' + id,
    method: 'delete'
  })
}

// 导出检测人员建档
export function exportCheckPerson(query) {
  return request({
    url: '/system/checkPerson/export',
    method: 'get',
    params: query
  })
}