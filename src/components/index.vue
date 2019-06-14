<template>
  <div class="my-blog">
    <headTop></headTop>
    <router-view></router-view>
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

<style scoped>
  .my-blog {
    height: 100%;
  }
</style>
