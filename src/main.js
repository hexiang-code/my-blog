import Vue from 'vue'
import App from './App.vue'

import router from './router/router'

Vue.config.productionTip = false
// 导入 element 组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
