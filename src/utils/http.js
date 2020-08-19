import axios from 'axios'
import cookieServer from './cookie'
import { httpBaseUrl } from '../config/js/envConfig'
import Vue from 'vue'
import store from '../store'
import { urlWhiteList } from './httpsUrlConfig'
const request = axios.create({
    baseURL: httpBaseUrl,
    timeout: 3000,
    withCredentials: true
})

// request 拦截器
request.interceptors.request.use(config => {
    let author = cookieServer.getAuthorization()
    if (author) config.headers['Authorization'] = author
    config.cancelToken = new axios.CancelToken(c => {
      if (store.getters.getCurMode === 'visitor' && config.method === 'post') {
        let index = urlWhiteList.findIndex(item => item === config.url)
        if(index === -1) {
          Vue.prototype.$liveRem.showToast({text: '访客是不能更改数据的哦', type: 'error'})
          c()
        }
      }
    })
    return config
})

// response 拦截器
request.interceptors.response.use(response => {
    if (response.data.status) {
      return response.data.data
    } else {
      let text = response.data.msg || '出错了，蕾姆马上就去排查。。。'
      Vue.prototype.$liveRem.showToast({text})
      return Promise.reject(response.data)
    }

})

export default request
