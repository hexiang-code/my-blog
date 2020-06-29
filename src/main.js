import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
import Vuex from 'vuex'
import store from './store/index'
import codeHeUI from 'codehe-ui'
Vue.config.productionTip = false
import 'codehe-ui/lib/codeheUi.css'
import VueSocketIo from 'vue-socket.io'
import cookieServe from './utils/cookie'
import { wsBaseUrl } from './config/js/envConfig'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './config/css/baseIcon.scss'
import './config/css/globalStyle.scss'
import directives from './utils/directives'
Vue.use(directives)
Vue.use(new VueSocketIo({
  debug: false,
  connection: wsBaseUrl
}))
Vue.use(codeHeUI)
Vue.use(Vuex)
Vue.use(mavonEditor)
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    store.dispatch('setCurLoginUserInfo').then(() => {
      if (store.getters.getCurMode === 'visitor')
        this.$liveRem.showToast({text: '您当前采用访客模式访问本网站，您可以查看主人部分信息，但是不可以提交任何内容哟！', time: 10000})
      if (store.getters.getCurMode === 'user')
        this.$socket.emit('login', cookieServe.getAuthorization())
    }).catch(() => {
      this.$liveRem.showToast({text: '还没登录哦', type: 'lovely'})
    })
  }
}).$mount('#app')
