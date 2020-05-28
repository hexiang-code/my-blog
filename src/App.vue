<template>
  <div id="app">
    <router-view />
    <live-rem ref="rem" @liveRemTalk="liveRemCommunication"></live-rem>
  </div>
</template>

<script>
import lovelyRemind from './utils/lovelyRemind'
import Vue from 'vue'
export default {
  name: 'app',
  mounted () {
    let liveRem = this.$refs.rem
    if (liveRem) {
      Vue.prototype.$liveRem = liveRem
      this.lovelyRemind()
    }
  },

  methods: {
    lovelyRemind () {
      Object.keys(lovelyRemind).forEach(item => {
        this.sockets.listener.subscribe(item, res => {
          window.focus()
          console.log(res, 'remind')
          this.$liveRem.showToast(res)
        })
      })
    },

    liveRemCommunication (talkAbout) {
      // this.$socket.emit('liveRemCommunication', talkAbout)
    }
  }
}
</script>

<style>
  #app {
    height: 100%;
  }
</style>
