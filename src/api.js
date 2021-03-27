import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 5000
});

// 获取所有广告列表信息，包括视频地址
export const getAdsList = ({communityCode, areaId}) =>
  instance.request({
    url: `/community.manage-web/frame_center/open/test/adverts/${communityCode}/${areaId}`,
    method: 'get'
  })  


export const addWatchMinute = (data) =>
  instance.request({
    url: '/community.manage-web/frame_center/open/test/adverts/saveClickAndViewTime',
    method: 'post',
    data
  })

