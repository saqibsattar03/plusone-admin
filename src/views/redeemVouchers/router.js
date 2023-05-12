import VouchersView from './VouchersView';
import VouchersShow from './VouchersShow';
import { getUser } from '../../utils/local';

export const redeemVouchersRoutes = [
  getUser()?.role === 'ADMIN'
    ? {
        name: 'Redeem Vouchers',
        path: '/redeem-vouchers',
        component: VouchersView
      }
    : {
        path: '/redeem-vouchers',
        redirect: '/no-permission'
      },
  getUser()?.role === 'ADMIN'
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
