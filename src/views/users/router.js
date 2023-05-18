import UsersView from './UsersView';
import UserShow from './UserShow';
import UserForm from './UserForm.vue';
import { getUser } from '../../utils/local';

export const usersRoutes = [
  getUser()?.role === 'ADMIN'
    ?
    {
      name: 'Users',
      path: '/',
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
