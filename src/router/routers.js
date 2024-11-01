import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    meta: { title: 'Index', noCache: true },
    component: (resolve) => require(['@/views/outer/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/shelf',
    meta: { title: 'Shelf', noCache: true,  requiresAuth: true },
    component: (resolve) => require(['@/views/books/shelf/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/detail/:id',
    meta: { title: 'detail', noCache: true,  requiresAuth: false},
    component: (resolve) => require(['@/views/outer/detail.vue'], resolve),
    hidden: true
  },
  {
    path: '/login',
    meta: { title: 'Login', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/book',
    component: Layout,
    children: [
      {
        path: '/book/detail/:id',
        component: (resolve) => require(['@/views/books/detail/index'], resolve),
      }
    ],
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/home',
    meta: { title: '', icon: 'dashboard', affix: true, noCache: true,  requiresAuth: true},
    children: [
      {
        path: 'home',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', affix: true, noCache: true,  requiresAuth: true}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: 'My Account',
        meta: { title: 'My Account',  requiresAuth: true }
      }
    ]
  },
  {
    path: '/profile',
    component: (resolve) => require(['@/views/system/user/profile'], resolve),
    hidden: true,
    meta: { title: 'profile',  requiresAuth: true }
  }
]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
