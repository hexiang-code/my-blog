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
    paramsArr = paramsArr.map(item => item.trim().split('='))
    let paramMap = new Map(paramsArr)
    return paramMap.get(key)
 }

 /**
  * 清除cookie
  *
  * @param {Sttring} key
  *
  * @memberOf CookieServer
  */
 clear (key) {
   this.setCookie(key, '', 0)
 }

  // 获取授权信息
  getAuthorization() {
    let token = this.getCookie('token')
    if (token) return `Bearer ${token}`
    else return ''
  }
}

export default new CookieServer()

