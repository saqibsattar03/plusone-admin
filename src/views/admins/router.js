import AdminsView from './AdminsView';
import AdminForm from './AdminForm.vue';
import { getUserScopes } from '../../utils/local';

export const adminsRoutes = [
  getUserScopes()?.includes('admins:view')
    ? {
        name: 'Admins',
        path: '/admins',
        component: AdminsView
      }
    : {
        path: '/admins',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('admins:new', 'admins:edit')
    ? {
        name: 'NewAdmin',
        path: '/admin',
        component: AdminForm
      }
    : {
        path: '/admin',
        redirect: '/no-permission'
      }
];

export const adminsRouter = adminsRoutes.filter(function (x) {
  return x !== null;
});
