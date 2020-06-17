<template>
  <div id="app">
    <router-view />
    <live-rem ref="rem" @liveRemTalk="liveRemCommunication" :welcomeBack="welcomeBack"></live-rem>
  </div>
</template>

<script>
import lovelyRemind from './utils/lovelyRemind'
import Vue from 'vue'
export default {
  name: 'app',
  data () {
    return {
      welcomeBack: {
        audioSrc: '/live-model/rem/sound/lemm_welcome-back.mp3',
        text: '你回来啦'
      }
    }
  },
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
          this.$liveRem.showToast({text: res})
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
