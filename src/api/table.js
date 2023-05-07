import request from '@/utils/request'

// 所有检测任务 以图片为单位 每一个对象对应一张图片
export function getList(params) {
  return request({
    url: '/api/detect',
    method: 'get',
    params
  })
}

// 单个检测任务 返回 5张图片
export function getListItem(id) {
  return request({
    url: `/api/detect/${id}`,
    method: 'get'
  })
}

export function getPic(id) {
  return request({
    url: `/api/OriImage/${id}`,
    method: 'get'
  })
}

export function getLabel(data) {
  return request({
    url: `/api/description`,
    method: 'post',
    contentType: "application/json",
    data
  })
}

export function getDate(data) {
  return request({
    url: `/api/date`,
    method: 'post',
    contentType: "application/json",
    data
  })
}

// 查看所有的图号 
export function getPname(id) {
  return request({
    url: `/api/pname`,
    method: 'get'
  })
}

// 获取所有的令号
export function getName(id) {
  return request({
    url: `/api/batch`,
    method: 'get'
  })
}