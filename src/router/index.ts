import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';
import RegisterForm from '../views/RegisterForm.vue';
import ProfilePage from '../views/ProfilePage.vue';
import { checkAuthStatus } from '../services/authService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    beforeEnter: async (_, __, next) => {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
