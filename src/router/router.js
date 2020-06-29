import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routerList =  [
    {
        path: '/',
        redirect: '/startPage'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../components/index.vue'),
        children: [
            {
                path: '/index',
                redirect: '/index/notes'
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
                        path: '/index/notes',
                        redirect: 'notesMain'
                    },
                    {
                        path: 'notesMain',
                        name: 'notesMain',
                        component: () => import('../components/notes/notes-main.vue')
                    },
                    {
                        path: 'editNotes',
                        name: 'editNotes',
                        component: () => import('../components/notes/edit-note.vue')
                    },
                    {
                        path: 'notesDetail',
                        name: 'notesDetail',
                        component: () => import('../components/notes/notes-detail')
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

