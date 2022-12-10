import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Locations from '../views/Locations.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
    {
      path: '/locations',
      name: 'locations',
      component: Locations
    },
    {
      path: '/auth/:state',
      name: 'auth',
      component: () => import('../views/Auth.vue')
    },
    {
      path: '/user/:path', 
      name: 'user',
      component: () => import('../views/User.vue')
    }
  ]
})

export default router
