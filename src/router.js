import Vue from 'vue';
import VueRouter from 'vue-router';
import SignInView from './views/auth/SignIn';
import NotFound from './views/404.vue';
import Dashboard from './components/Dashboard';
import { usersRouter } from './views/users/router';
import { adminsRouter } from './views/admins/router';
import { noPermissionRouter } from './views/permission/router';

import { merchantsRouter } from './views/merchants/router';
import { redeemVouchersRouter } from './views/redeemVouchers/router';
import { quotesRouter } from './views/quotes/router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      ...usersRouter,
      ...adminsRouter,
      ...noPermissionRouter,
      ...merchantsRouter,
      ...redeemVouchersRouter,
      ...quotesRouter
    ]
  },
  {
    name: 'SignIn',
    path: '/auth/sign-in',
    component: SignInView
  },
  {
    name: 'NotFound',
    path: '**',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, __, next) => {
  if (!localStorage.getItem('auth_token')) {
    if (to.path !== '/auth/sign-in') {
      next('/auth/sign-in');
    }
  }

  next();
});

export default router;
