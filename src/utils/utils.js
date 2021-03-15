
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
function formatDate(formatText = 'YYYY-MM-DD hh:mm:ss', timestamp = +new Date()) {
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
  returnText = returnText.replace('hh', _getFullDate(_targetHour))
  returnText = returnText.replace('mm', _getFullDate(_targetMinutes))
  returnText = returnText.replace('ss', _getFullDate(_targetSecond))
  return returnText
}

/**
 * 获得毫秒数
 * @param {Number} hours 小时
 * @param {Number} minutes 分钟
 * @param {Number} seconds 秒
 */
function getMillisecond(hours, minutes = 0, seconds = 0) {
  return hours * 60 * 60 * 1000 +
          minutes * 60 * 1000 +
            seconds * 1000
}

export {
  debounce,
  throttle,
  formatDate,
  getMillisecond
}
