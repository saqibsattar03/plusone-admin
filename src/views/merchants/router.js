import MerchantsView from './MerchantsView';
import VouchersView from './VouchersView';
import MerchantShow from './MerchantsShow';
import VoucherShow from './VouchersShow';
import MerchantForm from './MerchantsForm.vue';
import VoucherForm from './VouchersForm.vue';
import { getUserScopes } from '../../utils/local';

export const merchantsRoutes = [
  //-------- Voucher Routes --------------//
  getUserScopes()?.includes('vouchers:view')
    ? {
        name: 'Vouchers',
        path: '/vouchers',
        component: VouchersView
      }
    : {
        path: '/vouchers',
        redirect: '/no-permission'
      },

  getUserScopes()?.includes('vouchers:new')
    ? {
        name: 'AddVoucher',
        path: '/voucher',
        component: VoucherForm
      }
    : {
        path: '/voucher',
        redirect: '/no-permission'
      },

  getUserScopes()?.includes('vouchers:view')
    ? {
        name: 'VoucherDetails',
        path: '/voucher-details',
        component: VoucherShow
      }
    : {
        path: '/voucher-details',
        redirect: '/no-permission'
      },

  //--------- Merchant Routes ------------//
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
