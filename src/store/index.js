import checkFun from '../utils/check'
import Vuex from 'vuex'
import Vue from 'vue'
import request from '../utils/http'
import { dynamicStyle } from '../config/js/dynamic-setting'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {}, // 用户信息
    mode: '', // 当前访问模式
    // 用户自定义设定
    userDesignSetting: {
      // 网页底部设置
      footerSetting: {
        personalSign: ['天高鸟嗷嗷飞', '水深鱼哗哗游'],
        personalInfo: {
          QQ: '309871923',
          wechat: 'hx309871923',
          address: '安徽合肥',
          email: '309871923@qq.com'
        }
      },
      // 启动页设置
      startSetting: {
        startPoster: require('../assets/startBg.png'),
        startVideo: require("../assets/start-background-video.mp4")
      },
      // 主题背景设置
      themeSetting: {
        background: '',
        backgroundOpacity: '',
        themeColor: ''
      }
    },
    liveRemMeauList: [], // liveRem菜单列表
    // 音乐盒设定
    musicBoxSetting:{
      musicId: '', // 歌曲id
      musicVolume: 50, // 音乐音量
      musicPlayMode: 'sequence' // 播放模式
    }
  },
  getters: {
    // 获取当前用户信息
    getUserInfo: state => {
      return state.userInfo
    },

    // 获取当前访问模式
    getCurMode: state => {
      return state.mode
    },

    // 获取用户自定义设置
    getUserDesignSetting: state => {
      return state.userDesignSetting
    },

    // 获取liveRem菜单列表
    getLiveRemMeauList: state => {
      return state.liveRemMeauList
    },

    // 获取音乐盒是否固定位全局播放
    getMusicBoxSetting: state => {
      return state.musicBoxSetting
    }
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, userInfo) {
      if (!checkFun.checkUserInfo(userInfo)) return
      state.userInfo = userInfo
    },

    // 设置访问模式
    setMode(state, mode) {
      state.mode = mode
    },

    // 设置用户自定义设置
    setUserDesignSetting(state, setting) {
      // 格式化返回数据，以更方便查看的方式存储在vuex
      const { userDesignSetting } = state
      for (const moduleKey in userDesignSetting) {
        if (userDesignSetting.hasOwnProperty(moduleKey)) {
          const module = userDesignSetting[moduleKey]
          for (const settingKey in module) {
            if (module.hasOwnProperty(settingKey)) {
              if (setting[settingKey]) {
                module[settingKey] = setting[settingKey]
                if (moduleKey == 'themeSetting') dynamicStyle(settingKey, setting[settingKey])
              }
            }
          }
        }
      }
      state.userDesignSetting = userDesignSetting
    },

    // 设置liveRem菜单
    setLiveRemMeauList (state, liveRemMeauList) {
      state.liveRemMeauList = liveRemMeauList
    },

    // 设置音乐盒全局播放状态
    setMusicBoxSetting (state, musicBoxSetting) {
      for(let key in state.musicBoxSetting) {
        if ((musicBoxSetting[key] !== undefined && musicBoxSetting[key] !== null) &&  musicBoxSetting[key] !== state.musicBoxSetting[key])  {
          state.musicBoxSetting[key] = musicBoxSetting[key]
        }
      }
    }
  },
  actions: {
    // 设置当前登录的用户信息
    setCurLoginUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        let url = 'user/getCurLoginUserInfo'
        let method = 'GET'
        request({ url, method }).then(res => {
          commit('setUserInfo', res.userInfo)
          let { userName } = res.userInfo
          document.title = userName ? `${userName}的博客呀~` : '嘿嘿嘿~'
          commit('setMode', res.mode)
          if (res.userInfo.userSetting) {
            commit('setUserDesignSetting', res.userInfo.userSetting)
            commit('setMusicBoxSetting', res.userInfo.userSetting)
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
  }
})
export default store
