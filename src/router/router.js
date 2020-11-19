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
                component: () => import('../components/main-page/main-page.vue')
            },
            {
                path: 'notes',
                name: 'notes',
                redirect: '/index/notes/notesMain',
                component: () => import('../components/notes/index.vue'),
                children: [
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
            },
            {
              path: 'managerPage',
              name: 'managerPage',
              component: () => import('../components/manager-page/manager-page.vue')
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
    mode: 'history',
    routes: routerList
})

