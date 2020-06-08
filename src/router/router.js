import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routerList =  [
    {
        path: '/',
        redirect: '/mainPage'
    },
    {
        path: '/mainPage',
        name: 'mainPage',
        component: () => import('../components/index.vue'),
        children: [
            {
                path: '/mainPage',
                redirect: '/mainPage/notes'
            },
            {
                path: 'mainPage',
                name: 'mainPage',
                component: () => import('../components/mainPage/mainPage.vue')
            },
            {
                path: 'notes',
                name: 'notes',
                component: () => import('../components/notes/index.vue'),
                children: [
                    {
                        path: '/notes',
                        redirect: '/notes/index'
                    },
                    {
                        path: 'index',
                        name: 'index',
                        component: () => import('../components/notes/index.vue')
                    },
                    {
                        path: 'editNotes',
                        name: 'editNotes',
                        component: () => import('../components/notes/edit-note.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/startPage',
        name: 'startPage',
        component: () => import('../components/start-page/start-page.vue')
    }
]

export default new Router({
    mode: 'hash',
    routes: routerList
})

