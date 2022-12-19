import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Locations from '../views/Locations.vue'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/locations',
      name: 'locations',
      component: Locations,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/auth/:state',
      name: 'auth',
      component: () => import('../views/Auth.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/User.vue'),
      meta: { 
        requiresAuth: true
      }
    }
  ]
})


const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), user => {
      removeListener();
      resolve(user);
    }, reject);
  });
};


router.beforeEach(async (to, from, next) => {
  localStorage.setItem('PREV_ROUTE', from.fullPath)
  if (to.meta.requiresAuth) { 
    if (await getCurrentUser()) { 
      next()
    }
    else { 
      localStorage.setItem('PREV_ROUTE', to.fullPath)
      next({path: '/auth/login'})
    }
  } else { 
    next()
  }

})

export default router
