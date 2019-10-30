import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//引入组件区域
import Index from '@/components/index';
import MainPage from '@/components/mainPage/mainPage';
import Instruction from '@/components/self-instruction/index';
import Login from '@/components/login/index';
import StartPage from '@/components/start-page/start-page'

export const routerList = [
    {
        path: '',
        redirect: '/index'
    },
    {
        path: '/instruction',
        component: Instruction
    },
    {
        path: '/login',
        component: Login
    },
    {   
        path: '/index',
        component: Index,
        children: [
            {
                path: '',
                redirect: '/startPage'
            },
            {
                path: '/mainPage',
                component: MainPage,
                name: 'mainPage'
            }
        ]
    },
    {
        path: '/startPage',
        component: StartPage,
        name: 'startPage'
    }
]

export default new Router({
    routes: routerList
})

