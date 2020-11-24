import store from '../store'

const install = Vue => {
  // 访客模式指令
  Vue.directive('visitor', function (el) {
      if (store.getters.getCurMode === 'visitor') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  )
}

export default install
