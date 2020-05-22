<template>
  <div id="app">
    <router-view />
    <live-rem ref="rem"></live-rem>
  </div>
</template>

<script>

import Vue from 'vue'
export default {
  name: 'app',
  mounted () {
    let liveRem = this.$refs.rem
    if (liveRem) Vue.prototype.$liveRem = liveRem
  }
}
</script>

<style>
  #app {
    height: 100%;
  }
</style>
