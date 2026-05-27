import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

import { registerAuthGuard } from './guard'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Login – ligger utanför app-layouten
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },

        // App-layout – alla inloggade vyer
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'about',
                    name: 'about',
                    component: AboutView
                }
            ]
        }
    ]
})

// Global auth-guard (redan byggd)
registerAuthGuard(router)