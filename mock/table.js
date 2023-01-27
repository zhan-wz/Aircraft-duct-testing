const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    // 检测合格+四个缺陷（划痕缺陷、压坑缺陷、腐蚀缺陷、裂纹缺陷）
    'status|1': ['检测合格', '划痕缺陷', '压坑缺陷', '腐蚀缺陷', '裂纹缺陷'],
    // 'status|1': ['0', '1', '2', '3', '4'],
    /**
     *  switch (status) {
        case 0:
          status = '检测合格'
        case 1:
          status = '裂纹缺陷'
        case 2:
          status = '压坑缺陷'
        case 3:
          status = '腐蚀缺陷'
        case 4:
          status = '划痕缺陷'
      }
     */
    author: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
    create_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
