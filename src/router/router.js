import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//引入组件区域
import Index from '@/components/index';
import MainPage from '@/components/mainPage/mainPage';
import Instruction from '@/components/self-instruction/index';

export const routerList = [
    {
        path: '',
        redirect: '/instruction'
    },
    {
        path: '/instruction',
        component: Instruction
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

