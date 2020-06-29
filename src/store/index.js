import checkFun from '../utils/check'
import Vuex from 'vuex'
import Vue from 'vue'
import request from '../utils/http'
import cookieServe from '../utils/cookie'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userInfo: {}, // 用户信息
        mode: '' // 当前访问模式
    },
    getters: {
      // 获取当前用户信息
      getUserInfo: state => {
          return state.userInfo
      },

      // 获取当前访问模式
      getCurMode: state => {
        return state.mode
      }
    },
    mutations: {
      setUserInfo (state, userInfo) {
          if (!checkFun.checkUserInfo(userInfo)) return
          state.userInfo = userInfo
      },
      setMode (state, mode) {
        state.mode = mode
      }
    },
    actions: {
        // 获取当前登录的用户信息
        setCurLoginUserInfo ({commit}) {
          return new Promise((resolve, reject) => {
            let url = 'user/getCurLoginUserInfo'
            let method = 'GET'
            request({url, method}).then(res => {
              commit('setUserInfo', res.userInfo)
              commit('setMode', res.mode)
              resolve()
            }).catch(() => {
              reject()
            })
          })
        }
    }
})
export default store
