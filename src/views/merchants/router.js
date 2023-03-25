import MerchantsView from './MerchantsView';
import MerchantShow from './MerchantsShow';
import MerchantForm from './MerchantsForm.vue';
import { getUserScopes } from '../../utils/local';

export const merchantsRoutes = [
  getUserScopes()?.includes('merchants:view')
    ? {
        name: 'Merchants',
        path: '/merchants',
        component: MerchantsView
      }
    : {
        path: '/merchants',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('merchants:new')
    ? {
        name: 'NewMerchant',
        path: '/merchant',
        component: MerchantForm
      }
    : {
        path: '/merchant',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('merchants:view')
    ? {
        name: 'MerchantsDetails',
        path: '/merchant-details',
        component: MerchantShow
      }
    : {
        path: '/merchant-details',
        redirect: '/no-permission'
      }
];

export const merchantsRouter = merchantsRoutes.filter(function (x) {
  return x !== null;
});
