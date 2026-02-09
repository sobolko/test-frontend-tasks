import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth.store'
import AdminLayout from '@/layouts/AdminLayout.vue'

import HomePage from '../pages/HomePage.vue'
import TaskListPage from '../pages/TaskListPage.vue'
import TaskPage from '../pages/TaskPage.vue'
import CreateTaskPage from '../pages/CreateTaskPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import StatisticsPage from '../pages/StatisticsPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { requiresGuest: true },
    },
    {
        path: '/',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/dashboard',
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: HomePage,
            },
            {
                path: '/tasks',
                name: 'tasks',
                component: TaskListPage,
            },
            {
                path: '/tasks/create',
                name: 'createTask',
                component: CreateTaskPage,
            },
            {
                path: '/tasks/:id',
                name: 'task',
                component: TaskPage,
                props: true,
            },
            {
                path: '/statistics',
                name: 'statistics',
                component: StatisticsPage,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Auth guards
router.beforeEach((to, _from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresGuest && auth.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
