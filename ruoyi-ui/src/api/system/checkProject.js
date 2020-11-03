import request from '@/utils/request'

// 查询监测项目建档列表
export function listCheckProject(query) {
  return request({
    url: '/system/checkProject/list',
    method: 'get',
    params: query
  })
}

// 查询监测项目建档详细
export function getCheckProject(id) {
  return request({
    url: '/system/checkProject/' + id,
    method: 'get'
  })
}

// 新增监测项目建档
export function addCheckProject(data) {
  return request({
    url: '/system/checkProject',
    method: 'post',
    data: data
  })
}

// 修改监测项目建档
export function updateCheckProject(data) {
  return request({
    url: '/system/checkProject',
    method: 'put',
    data: data
  })
}

// 删除监测项目建档
export function delCheckProject(id) {
  return request({
    url: '/system/checkProject/' + id,
    method: 'delete'
  })
}

// 导出监测项目建档
export function exportCheckProject(query) {
  return request({
    url: '/system/checkProject/export',
    method: 'get',
    params: query
  })
}