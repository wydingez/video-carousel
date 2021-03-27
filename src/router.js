import { createRouter, createWebHashHistory } from 'vue-router';
import ads from './views/ads.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      redirect: '/ads'
    },  {
      path: '/ads/:communityCode/:areaId',
      component: ads
    }
  ]
})