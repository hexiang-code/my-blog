import axios from 'axios'
import cookieServer from './cookie'
import { httpBaseUrl } from '../config/js/envConfig'
import Vue from 'vue'
const request = axios.create({
    baseURL: httpBaseUrl,
    imeout: 3000,
    withCredentials: true
})  

// request 拦截器
request.interceptors.request.use(config => {
    config.headers['Authorization'] = cookieServer.getAuthorization()
    return config
})

// response 拦截器
request.interceptors.response.use(response => {
    if (response.data.status) {
        return response.data.data
    } else {
        Vue.prototype.$liveRem.showToast({text: '出错了，蕾姆马上就去排查。。。'})
        return Promise.reject(response.data)
    }
    
})

export default request