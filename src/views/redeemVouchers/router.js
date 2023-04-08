import VouchersView from './VouchersView';
import VouchersShow from './VouchersShow';
import { getUserScopes } from '../../utils/local';

export const redeemVouchersRoutes = [
  getUserScopes()?.includes('redeem-vouchers:view')
    ? {
        name: 'Redeem Vouchers',
        path: '/redeem-vouchers',
        component: VouchersView
      }
    : {
        path: '/redeem-vouchers',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('redeem-vouchers:view')
    ? {
        name: 'Redeem VoucherDetails',
        path: '/redeem-voucher-details',
        component: VouchersShow
      }
    : {
        path: '/redeem-voucher-details',
        redirect: '/no-permission'
      }
];

export const redeemVouchersRouter = redeemVouchersRoutes.filter(function (x) {
  return x !== null;
});
