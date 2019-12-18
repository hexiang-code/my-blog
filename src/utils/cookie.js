class CookieServer {
    constructor() {

    }

/**
 * 设置cookie
 * @param {String} key 要存入的key值
 * @param {String} value 要存入的value值
 * @param {Number} expirationTime 过期时间单位Day
 */
 setCookie (key,value, expirationTime) {
    let now = new Date();
    now.setTime(now.getTime() + (expirationTime*24*60*60*1000))
    document.cookie =`${key}=${value};expires=${now.toUTCString()};path=/`
 }

 /**
  * 读取cookie
  * @param {String} key 要读取的值得key
  */
 getCookie (key) {
    let cookie = document.cookie
    let paramsArr = cookie.split(';')
    paramsArr.forEach(item => {
        item = item.split('=')
    })
    paramsArr = paramsArr.map(item => {
        item = item.trim()
        return item.split('=')
    })
    let paramMap = new Map(paramsArr)
    return paramMap.get(key)
 }
}

export default new CookieServer()

