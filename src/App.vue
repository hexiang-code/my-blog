<template>
  <div id="app">
    <router-view />
    <live-rem
      :manualLoad="manualLoad"
      ref="rem"
      @liveRemTalk="liveRemCommunication"
      :meauList="$store.getters.getLiveRemMeauList"
      :welcomeBack="welcomeBack">
    </live-rem>
    <global-music></global-music>
  </div>
</template>

<script>
import lovelyRemind from './config/js/remind-map'
import globalMusic from './components/global-components/music-global/music-global'
import Vue from 'vue'
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

  components: {
    'global-music': globalMusic
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
        this.sockets.subscribe(item, res => {
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
  @import './config/css/_globalStyle.scss';
  #app /deep/{
    height: 100%;
    background-color: #f5f5f5;
    color: $font-color;
    .message {
      max-height: 100px;
    }

    .menu-list {
      left: 98px;
    }
  }
</style>
