import request from '@/utils/request'

// 查询车辆档案列表
export function listCar(query) {
  return request({
    url: '/system/car/list',
    method: 'get',
    params: query
  })
}

// 查询车辆档案详细
export function getCar(id) {
  return request({
    url: '/system/car/' + id,
    method: 'get'
  })
}

// 新增车辆档案
export function addCar(data) {
  return request({
    url: '/system/car',
    method: 'post',
    data: data
  })
}

// 修改车辆档案
export function updateCar(data) {
  return request({
    url: '/system/car',
    method: 'put',
    data: data
  })
}

// 删除车辆档案
export function delCar(id) {
  return request({
    url: '/system/car/' + id,
    method: 'delete'
  })
}

// 导出车辆档案
export function exportCar(query) {
  return request({
    url: '/system/car/export',
    method: 'get',
    params: query
  })
}