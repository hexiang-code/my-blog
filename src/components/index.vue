<template>
  <div class="my-blog">
    <headTop></headTop>
    <div class="container">
      <router-view></router-view>
    </div>
    <footBottom></footBottom>
  </div>
</template>

<script>
import HeadTop from './headTop/headTop';
import FootBottom from './footBottom/footBottom';
export default {
  name: 'Index',
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
