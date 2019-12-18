import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
import Vuex from 'vuex'
import store from './store/index'
Vue.config.productionTip = false
// 导入 element 组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(Vuex)
new Vue({
  router,
  store,
  render: h => h(App),
  created: () => {
    store.dispatch('setCurLoginUserInfo')
  }
}).$mount('#app')
