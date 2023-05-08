import CustomerSupportsView from './CustomerSupportsView.vue';
import CustomerSupportsShow from './CustomerSupportsShow.vue';
import { getUser } from '../../utils/local';

export const customerSupportsRoutes = [
  getUser()?.role === 'ADMIN'
    ? {
        name: 'CustomerSupports',
        path: '/customer-supports',
        component: CustomerSupportsView
      }
    : {
        path: '/customer-supports',
        redirect: '/no-permission'
      },

  getUser()?.role === 'ADMIN'
    ? {
        name: 'CustomerSupportsDetails',
        path: '/customer-supports-details',
        component: CustomerSupportsShow
      }
    : {
        path: '/customer-supports-details',
        redirect: '/no-permission'
      }
];

export const customerSupportsRouter = customerSupportsRoutes.filter(function (
  x
) {
  return x !== null;
});
