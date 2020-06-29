import store from '../store'

const install = Vue => {
  Vue.directive('visitor',
    {
      inserted: function (el) {
        if (store.getters.getCurMode === 'visitor') {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    }
  )
}

export default install
