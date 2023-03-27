import UsersView from './UsersView';
import UserShow from './UserShow';
import UserForm from './UserForm.vue';
import { getUserScopes } from '../../utils/local';

export const usersRoutes = [
  getUserScopes()?.includes('users:view')
    ? {
        name: 'Users',
        path: '/',
        component: UsersView
      }
    : {
        path: '/users',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('users:new')
    ? {
        name: 'NewUser',
        path: '/user',
        component: UserForm
      }
    : {
        path: '/user',
        redirect: '/no-permission'
      },
  getUserScopes()?.includes('users:view')
    ? {
        name: 'UsersDetails',
        path: '/user-details',
        component: UserShow
      }
    : {
        path: '/user-details',
        redirect: '/no-permission'
      }
];

export const usersRouter = usersRoutes.filter(function (x) {
  return x !== null;
});
