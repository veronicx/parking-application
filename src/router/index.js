import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
      path: '/explore', 
      name: 'Explore',
      component: () => import('../views/Listing.vue')
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
    },
    {
      path: '/spaces',
      name: 'spaces',
      component: () => import('../views/Spaces.vue'),
      children: [
        {
          path: 'new', 
          name: 'new spaces',
          component: () => import('../components/Spaces/NewSpace.vue'),
          meta: { 
            requiresAuth: true
          }
      },
        {
        path: 'panel/:id',
        name: 'Space Panel',
        component: () => import('../components/Spaces/SpacePanel.vue'),
          meta: {
          requiresAuth: true
          }
        },
      ],
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/space/current/:id',
      name: 'User Space', 
      component: () => import('../components/Spaces/UserSpace.vue')
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
