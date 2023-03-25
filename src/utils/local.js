import axios from 'axios';

export function getUserScopes() {
  const user = localStorage.getItem('user');
  const scopes = JSON.parse(user)?.scopes;
  return scopes ? scopes : null;
}

export function getFullPath(_file) {
  return axios.defaults.baseURL + '/uploads/' + _file;
}
