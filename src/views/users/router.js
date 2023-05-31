import UsersView from './UsersView';
import UserShow from './UserShow';
import UserForm from './UserForm.vue';
import { getUser } from '../../utils/local';

export const usersRoutes = [
  getUser()?.role === 'ADMIN'
    ? {
        name: 'Users',
        path: '/',
        title: 'Users',
        component: UsersView
      }
    : {
        path: '/',
        redirect: '/no-permission'
      },
  getUser()?.role === 'ADMIN'
    ? {
        name: 'NewUser',
        path: '/user',
        title: 'Add New User',
        component: UserForm
      }
    : {
        path: '/user',
        redirect: '/no-permission'
      },
  getUser()?.role === 'ADMIN'
    ? {
        name: 'UsersDetails',
        path: '/user-details',
        title: 'User Details',
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
