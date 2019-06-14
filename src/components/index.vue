<template>
  <div class="my-blog">
    <headTop></headTop>
    <router-view></router-view>
  </div>
</template>

<script>
import HeadTop from './headTop/headTop'
export default {
  name: 'Index',
  components: {
    headTop: HeadTop
  }
}
</script>

<style scoped>
  .my-blog {
    height: 100%;
  }
</style>
