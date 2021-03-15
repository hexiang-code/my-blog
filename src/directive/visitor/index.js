import store from '../../store'

// 访客模式指令
const visitorMode = Vue => {
  Vue.directive('visitor', function (el) {
      if (store.getters.getCurMode === 'visitor') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  )
}

export default visitorMode


