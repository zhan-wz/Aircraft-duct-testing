import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/new',
    method: 'get',
    params
  })
}

export function getID(params) {
  return request({
    url: '/api/msg',
    method: 'get',
    params
  })
}

export function getOriPic(id) {
  return request({
    url: `/api/OriImage/${id}`,
    method: 'get'
  })
}

export function getMarkPic(id) {
  return request({
    url: `/api/MarkImage/${id}`,
    method: 'get'
  })
}

export function getTotal(params) {
  return request({
    url: '/api/total',
    method: 'get',
    params
  })
}

// 开始检测
export function postData(data) {
  return request({
    url: `/api/name`,
    method: 'post',
    contentType: "application/json",
    data
  })
}

// 获取所有图号