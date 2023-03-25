import noPermission from './NoPermisionView';

export const noPermissionRoutes = [
  {
    name: 'no-permission',
    path: '/no-permission',
    component: noPermission
  }
];

export const noPermissionRouter = noPermissionRoutes.filter(function (x) {
  return x !== null;
});
