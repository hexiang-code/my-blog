<template>
  <div class="my-blog">
    <headTop></headTop>
    <div class="container">
      <keep-alive :include="keepAliveRouter">
        <router-view></router-view>
      </keep-alive>
    </div>
    <footBottom></footBottom>
  </div>
</template>

<script>
import HeadTop from './head-top/head-top'
import FootBottom from './foot-bottom/foot-bottom'
import keepAliveRouter from '../config/js/keep-router'
export default {
  name: 'Index',
  data () {
    return {
      keepAliveRouter
    }
  },
  components: {
    headTop: HeadTop,
    footBottom: FootBottom
  }
}
</script>

<style lang="scss" scoped>
  @import '../config/css/_globalStyle.scss';
  .my-blog {
    height: 100%;
    background: $background no-repeat;
    background-size: cover;
    background-attachment: fixed;

    .container {
      position: relative;
      padding-top: 80px;
      min-height: 100vh;
      // background: $background no-repeat;
      // background-size: cover;
      // background-attachment: fixed;
    }
  }
</style>
