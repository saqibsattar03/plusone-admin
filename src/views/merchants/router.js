import MerchantsView from './MerchantsView';
import VouchersView from './VouchersView';
import AccountsView from './AccountsView';
import MerchantShow from './MerchantsShow';
import VoucherShow from './VouchersShow';
import MerchantForm from './MerchantsForm.vue';
import VoucherForm from './VouchersForm.vue';
import { getUser } from '../../utils/local';

export const merchantsRoutes = [
  //-------- Voucher Routes --------------//
  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
    ? {
        name: 'Vouchers',
        path: '/vouchers',
        component: VouchersView
      }
    : {
        path: '/vouchers',
        redirect: '/no-permission'
      },

  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
    ? {
        name: 'AddVoucher',
        path: '/voucher',
        component: VoucherForm
      }
    : {
        path: '/voucher',
        redirect: '/no-permission'
      },

  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
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
  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
    ? {
        name: 'Merchants',
        path: '/merchants',
        component: MerchantsView
      }
    : {
        path: '/merchants',
        redirect: '/no-permission'
      },

  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
    ? {
        name: 'NewMerchant',
        path: '/merchant',
        component: MerchantForm
      }
    : {
        path: '/merchant',
        redirect: '/no-permission'
      },

  getUser()?.role === 'ADMIN' || getUser()?.role === 'MERCHANT'
    ? {
        name: 'MerchantsDetails',
        path: '/merchant-details',
        component: MerchantShow
      }
    : {
        path: '/merchant-details',
        redirect: '/no-permission'
      },

  //--------- Account Routes ------------//
  {
    name: 'AccountsDetails',
    path: '/account-details',
    component: AccountsView
  }
];

export const merchantsRouter = merchantsRoutes.filter(function (x) {
  return x !== null;
});
