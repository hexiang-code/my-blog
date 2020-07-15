<template>
  <div id="app">
    <router-view />
    <live-rem :manualLoad="manualLoad" ref="rem" @liveRemTalk="liveRemCommunication" :welcomeBack="welcomeBack"></live-rem>
  </div>
</template>

<script>
import lovelyRemind from './utils/lovelyRemind'
import Vue from 'vue'
import eventBus from './utils/eventBus'
export default {
  name: 'app',
  data () {
    return {
      welcomeBack: {
        audioSrc: '/live-model/rem/sound/lemm_welcome-back.mp3',
        text: '你回来啦',
      },
      manualLoad: false // 是否手动加载蕾姆
    }
  },
  mounted () {
    let liveRem = this.$refs.rem
    if (liveRem) {
      Vue.prototype.$liveRem = liveRem
      this.lovelyRemind()
    }
    // eventBus.$on('videoAlready', async () => {
    //   liveRem.initLiveRem()
    // })
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

<style scoped lang="scss">
  #app /deep/{
    height: 100%;
    .message {
      max-height: 100px;
    }
  }
</style>
