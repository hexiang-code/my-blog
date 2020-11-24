
/**
 * 函数防抖
 * @param {Function} fn 需要防抖的函数
 * @param {Number} wait 等待时间 单位毫秒
 * @param {Object} ctx fn函数执行的上下文环境
 */
function debounce (fn, wait, ctx = null) {
  let timer
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(ctx, ...arguments)
    }, wait)
  }
}

/**
 * 函数节流
 * @param {any} fn
 * @param {number} [wait=200]
 * @param {any} [ctx=null]
 */
function throttle (fn, wait = 200, ctx = null) {
  let timer
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      fn.call(ctx, ...arguments)
      timer = null
    }, wait);
  }
}

/**
 * 格式化时间
 * @param {String} formatText 格式化时间 （YYYY-MM-DD:HH:MM:SS）
 * @param {Number} timestamp 目标时间戳
 */
function formatDate(formatText = 'YYYY-MM-DD:HH:MM:SS', timestamp = +new Date()) {
  const _getFullDate = val => {
    if (String(val).length < 2) {
      return '0' + String(val)
    } else {
      return val
    }
  }
  let targetDate = new Date(timestamp),
  _targetYear = targetDate.getFullYear(),
  _targetMonth = targetDate.getMonth() + 1,
  _targetDay = targetDate.getDate(),
  _targetHour = targetDate.getHours(),
  _targetMinutes = targetDate.getMinutes(),
  _targetSecond = targetDate.getSeconds(),
  returnText = ''
  returnText = formatText.replace('YYYY', _targetYear)
  returnText = returnText.replace('MM', _getFullDate(_targetMonth))
  returnText = returnText.replace('DD', _getFullDate(_targetDay))
  returnText = returnText.replace('HH', _getFullDate(_targetHour))
  returnText = returnText.replace('MM', _getFullDate(_targetMinutes))
  returnText = returnText.replace('SS', _getFullDate(_targetSecond))
  return returnText
}


export {
  debounce,
  throttle,
  formatDate
}
