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
}

export default new CookieServer()

