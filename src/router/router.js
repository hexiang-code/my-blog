import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//引入组件区域
import Index from '@/components/index';

export const routerList = [
    {
        path: '',
        redirect: '/index'
    },
    {
        path: '/index',
        component: Index,
        name: 'index'
    }
]

export default new Router({
    routes: routerList
})

