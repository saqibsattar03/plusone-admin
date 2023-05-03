import AccountsHistoryView from './AccountsHistoryView.vue';
import { getUser } from '../../utils/local';

export const accountsHistoryRoutes = [
  getUser()?.role === 'ADMIN'
    ? {
        name: 'accounts-history',
        path: '/accounts-history',
        component: AccountsHistoryView
      }
    : {
        path: '/accounts-history',
        redirect: '/no-permission'
      }
];

export const accountsHistoyRouter = accountsHistoryRoutes.filter(function (x) {
  return x !== null;
});
