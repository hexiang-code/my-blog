import axios from 'axios'
import cookieServer from './cookie'
// const baseUrl = 'http://localhost:3000/api/'
const baseUrl = 'http://api.hexiang.cn/api/'

const request = axios.create({
    baseURL: baseUrl,
    imeout: 3000,
    withCredentials: true,
    headers: {
        Authorization:'Bearer ' + cookieServer.getCookie('token')
    }
})  

// response 拦截器
request.interceptors.response.use( response => {
    if (response.data.status) {
        return response.data.data
    } else {
        return Promise.reject(response.data)
    }
    
})

export default request