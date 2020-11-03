import request from '@/utils/request'

// 查询监测物体建档列表
export function listCheckObject(query) {
  return request({
    url: '/system/checkObject/list',
    method: 'get',
    params: query
  })
}

// 查询监测物体建档详细
export function getCheckObject(id) {
  return request({
    url: '/system/checkObject/' + id,
    method: 'get'
  })
}

// 新增监测物体建档
export function addCheckObject(data) {
  return request({
    url: '/system/checkObject',
    method: 'post',
    data: data
  })
}

// 修改监测物体建档
export function updateCheckObject(data) {
  return request({
    url: '/system/checkObject',
    method: 'put',
    data: data
  })
}

// 删除监测物体建档
export function delCheckObject(id) {
  return request({
    url: '/system/checkObject/' + id,
    method: 'delete'
  })
}

// 导出监测物体建档
export function exportCheckObject(query) {
  return request({
    url: '/system/checkObject/export',
    method: 'get',
    params: query
  })
}