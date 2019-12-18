import checkFun from '../utils/check'
import Vuex from 'vuex'
import Vue from 'vue'
import request from '../utils/http'
import cookieServe from '../utils/cookie'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userInfo: {}
    },
    getters: {
        getUserInfo: state => {
            return state.userInfo
        }
    },
    mutations: {
        setUserInfo (state, userInfo) {
            if (!checkFun.checkUserInfo(userInfo)) return
            state.userInfo = userInfo
        }
    },
    actions: {
        // 获取当前登录的用户信息
        setCurLoginUserInfo ({commit, state}) {
            if (cookieServe.getCookie('token')) {
                let url = 'user/getCurLoginUserInfo'
                let method = 'GET'
                request({url, method}).then(res => {
                    commit('setUserInfo', res.userInfo)
                })
            } else {
                console.log('用户暂未登录')
            }
        }
    }
})
export default store