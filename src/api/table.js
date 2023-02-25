import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/detect',
    method: 'get',
    params
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