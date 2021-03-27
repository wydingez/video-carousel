import { createRouter, createWebHashHistory } from 'vue-router';
import ads from './views/ads.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      redirect: '/ads/hjhy/899521'
    },  {
      path: '/ads/:communityCode/:areaId',
      component: ads
    }
  ]
})