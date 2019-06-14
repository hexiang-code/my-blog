import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//引入组件区域
import Index from '@/components/index';
import MainPage from '@/components/mainPage/mainPage';

export const routerList = [
    {
        path: '',
        redirect: '/index'
    },
    {
        path: '/index',
        component: Index,
        children: [
            {
                path: '',
                redirect: '/mainPage'
            },
            {
                path: '/mainPage',
                component: MainPage,
                name: 'mainPage'
            }
        ]
    }
]

export default new Router({
    routes: routerList
})

