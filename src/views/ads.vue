<template>
  <div class="video-carousel">
    <div class="summary-view">
      <div class="line">点击次数（次）：{{clickCount}}</div>
      <div class="line">停留时长（秒）：{{viewDuration.toFixed(1)}}</div>
    </div>
    <swiper
      v-if="!ready"
      :space-between="10"
      navigation
      :thumbs="{ swiper: thumbsSwiper }"
      @slideChange="onSlideChange"
      class="gallery-top"
    >
      <swiper-slide class="video-wrapper" v-for="(v, index) in videoList" :key="index">
        <video 
          ref="video"
          muted 
          controls 
          :src="v.url"
          @timeupdate="doCountTime"
          @play="doPlay($event, index)"
        />
      </swiper-slide>
    </swiper>

    <swiper
      v-if="!ready"
      :space-between="10"
      :slides-perView="videoList.length"
      :free-mode="true"
      watch-slides-visibility
      watch-slides-progress
      @swiper="setThumbsSwiper"
      class="gallery-thumbs"
    >
      <swiper-slide :style="{'background-image': getVideoCover(v.url)}" v-for="(v, index) in videoList" :key="index" />
    </swiper>
  </div>
</template>
<script>
  // import Swiper core and required modules
  import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Thumbs, Controller } from 'swiper';

  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue';

  // import api
  import { getAdsList, addWatchMinute } from '../api'

  // 引入element的loading组件
  import { ElLoading } from 'element-plus'

  // Import Swiper styles
  import 'swiper/swiper.scss';
  import 'swiper/components/navigation/navigation.scss';
  import 'swiper/components/pagination/pagination.scss';
  import 'swiper/components/scrollbar/scrollbar.scss';
  import 'swiper/components/thumbs/thumbs.scss';
  import 'swiper/components/controller/controller.scss';

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Thumbs, Controller]);

  const INTERVAL_AUTO_SAVE_TIME = 10

  // Import Swiper styles
  export default {
    data () {
      return {
        firstSwiper: null,
        secondSwiper: null,
        thumbsSwiper: null,
        videoList: [],
        ready: true,
        clickCount: 0,
        viewDuration: 0,
        currentTime: 0
      }
    },

    components: {
      Swiper,
      SwiperSlide
    },

    mounted () {
      this.init()
    },

    methods: {
      setThumbsSwiper(swiper) {
        this.thumbsSwiper = swiper;
      },

      onSlideChange (slider) {
        // 滑动页面时，停止除激活页面的视频以外的视频播放
        const {activeIndex} = slider
        const videos = Array.from(document.querySelectorAll('video'))

        videos.forEach((v, index) => {
          if (index !== activeIndex) {
            v.pause()
          } else {
            setTimeout(() => {
              console.log(v.currentTime, 1)
              this.currentTime = v.currentTime
            }, 0)
          }
        })
      },
      
      init() {
        // 初始化广告视频页面
        this.loading = true
        this.loadingInstance = ElLoading.service()
        let {communityCode, areaId} = this.$route.params
        if (communityCode && areaId) {
          getAdsList({communityCode, areaId}).then(({data}) => {
            console.log(data)
            // this.loadingInstance.close()
            this.videoList = [
              { url: 'https://cdn.wyd94.top/m2.mp4' },
              { url: 'https://cdn.wyd94.top/m3.mp4' },
              { url: 'https://cdn.wyd94.top/m4.mp4' },
              { url: 'https://cdn.wyd94.top/m5.mp4' },
              { url: 'https://cdn.wyd94.top/m6.mp4' },
              { url: 'https://cdn.wyd94.top/m7.mp4' }
            ]
            this.$nextTick(() => {
              this.ready = false
            })
            this.loadingInstance.close()
          })

          setInterval(() => {
            // 10秒钟自动存储一次当前页面用户提交数据
            addWatchMinute({
              customer: communityCode,
              shop: areaId,
              click_count: this.clickCount,
              click_count: Math.round(this.viewDuration)
            }).then(({data}) => {
              if (data.success) {
                console.warn(`[Video Actino Do Save Success]`)
              }
            })
          }, INTERVAL_AUTO_SAVE_TIME * 1000)
        }
      },

      doCountTime(e) {
        // 视频播放时更新播放时长
        this.viewDuration += e.target.currentTime - this.currentTime
        this.currentTime = e.target.currentTime
      },

      doPlay(e, index) {
        // 播放视频时，统计点击次数，并设置当前视频的播放时间
        const videos = Array.from(document.querySelectorAll('video'))

        this.clickCount += 1
        this.currentTime = videos[index].currentTime
      },

      getVideoCover (url) {
        // 获取视频封面
        return `url(${url}?vframe/jpg/offset/1)`
      }
    }
  }
</script>

<style lang="scss">
html,
body {
  position: relative;
  height: 100%;
}

body {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  height: 100%;
}

.video-carousel {
  position: relative;
  height: 100%;
  background: #000;
}

.swiper-container {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.gallery-top {
  height: 80%;
  width: 100%;
}

.gallery-thumbs {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.gallery-thumbs .swiper-slide {
  height: 100%;
  opacity: 0.4;
}

.gallery-thumbs .swiper-slide-thumb-active.swiper-slide{
  opacity: 1;
}

.video-wrapper {
  text-align: center;
  video {
    width: 80%;
    height: 100%;
  }
}
.summary-view {
  position: absolute;
  z-index: 1000;
  background: white;
  padding: 5px;
  top: 0;
  left: 0;
  border: 2px solid white;
  font-size: 14px;
  .line {
    margin: 5px;
  }
} 
</style>