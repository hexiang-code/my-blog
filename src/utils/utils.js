
/**
 * 函数防抖
 * @param {Function} fn 需要防抖的函数
 * @param {Number} wait 等待时间 单位毫秒
 * @param {Object} ctx fn函数执行的上下文环境
 */
// const debouce = (fn, wait, ctx = null) => {
//   let timer
//   return () => {
//     if (timer) clearTimeout(timer)
//     timer = setTimeout(() => {
//       fn.call(ctx, ...arguments)
//     }, wait);
//   }
// }

function debounce (fn, wait) {
  let timer
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(null, ...arguments)
    }, wait)
  }
}

export {
  debounce
}
