import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
import Vuex from 'vuex'
import store from './store/index'
import codeHeUI from 'codehe-ui'

Vue.config.productionTip = false
// 导入 element 组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'codehe-ui/lib/codeheUi.css'
import VueSocketIo from 'vue-socket.io'
import cookieServe from './utils/cookie'
Vue.use(new VueSocketIo({
  debug: false,
  connection: 'ws://api.hexiangzone.cn'
}))
Vue.use(ElementUI);
Vue.use(codeHeUI)
Vue.use(Vuex)
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    store.dispatch('setCurLoginUserInfo').then(() => {
      this.$socket.emit('login', cookieServe.getAuthorization())
    })
  }
}).$mount('#app')
